/**
 * Retry utilities with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: any) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, "shouldRetry">> & {
  shouldRetry?: (error: any) => boolean;
} = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = DEFAULT_OPTIONS.maxRetries,
    initialDelay = DEFAULT_OPTIONS.initialDelay,
    maxDelay = DEFAULT_OPTIONS.maxDelay,
    backoffMultiplier = DEFAULT_OPTIONS.backoffMultiplier,
    shouldRetry = () => true,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }

      // Don't wait after the last attempt
      if (attempt < maxRetries) {
        const delay = calculateDelay(
          attempt,
          initialDelay,
          maxDelay,
          backoffMultiplier
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * Retry with immediate retry for specific errors
 */
export async function retryWithImmediateRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions & {
    immediateRetryErrors?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const { immediateRetryErrors, ...retryOptions } = options;

  return retry(fn, {
    ...retryOptions,
    shouldRetry: (error) => {
      // If it's an immediate retry error, don't wait
      if (immediateRetryErrors && immediateRetryErrors(error)) {
        return retryOptions.shouldRetry?.(error) !== false;
      }

      return retryOptions.shouldRetry
        ? retryOptions.shouldRetry(error)
        : true;
    },
  });
}

/**
 * Retry a fetch request with exponential backoff
 */
export async function retryFetch(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return retry(
    async () => {
      const response = await fetch(url, options);

      // Retry on 5xx errors
      if (response.status >= 500 && response.status < 600) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Retry on network errors (handled by fetch itself)
      if (!response.ok && response.status < 500) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      return response;
    },
    {
      shouldRetry: (error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && error.message.includes("HTTP error")) {
          return false;
        }
        return retryOptions.shouldRetry?.(error) !== false;
      },
      ...retryOptions,
    }
  );
}

/**
 * Retry with circuit breaker pattern
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private options: {
      failureThreshold: number;
      resetTimeout: number;
      halfOpenMaxAttempts: number;
    }
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();

    // Check if we should try to reset from open state
    if (
      this.state === "open" &&
      this.lastFailureTime &&
      now - this.lastFailureTime > this.options.resetTimeout
    ) {
      this.state = "half-open";
      this.failures = 0;
    }

    // If circuit is open, fail fast
    if (this.state === "open") {
      throw new Error("Circuit breaker is open");
    }

    try {
      const result = await fn();

      // Success - reset failures if in half-open or closed state
      if (this.state === "half-open") {
        this.state = "closed";
        this.failures = 0;
      } else if (this.state === "closed") {
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = now;

      // Check if we should open the circuit
      if (
        this.failures >= this.options.failureThreshold &&
        this.state !== "open"
      ) {
        this.state = "open";
      }

      throw error;
    }
  }

  reset(): void {
    this.failures = 0;
    this.lastFailureTime = null;
    this.state = "closed";
  }

  getState(): "closed" | "open" | "half-open" {
    return this.state;
  }
}

