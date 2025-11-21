/**
 * Fuzzy search implementation for channel search
 */

import { IPTVChannel } from "@/lib/iptv/types";
import { SetflixContentItem } from "@/lib/iptv/types";

export interface SearchResult<T> {
  item: T;
  score: number;
  matches: Array<{
    field: string;
    value: string;
    score: number;
  }>;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Calculate distances
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const distance = levenshteinDistance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  return 1 - distance / maxLen;
}

/**
 * Check if a string contains another (fuzzy)
 */
function fuzzyContains(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match
  if (textLower.includes(queryLower)) return true;

  // Check if all query characters appear in order in text
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  return queryIndex === queryLower.length;
}

/**
 * Calculate match score for a channel
 */
function calculateChannelScore(
  channel: IPTVChannel,
  query: string
): { score: number; matches: Array<{ field: string; value: string; score: number }> } {
  const queryLower = query.toLowerCase();
  const matches: Array<{ field: string; value: string; score: number }> = [];
  let totalScore = 0;

  // Name matching (highest weight)
  const nameLower = channel.name.toLowerCase();
  if (nameLower === queryLower) {
    matches.push({ field: "name", value: channel.name, score: 1.0 });
    totalScore += 1.0 * 10;
  } else if (nameLower.startsWith(queryLower)) {
    matches.push({ field: "name", value: channel.name, score: 0.9 });
    totalScore += 0.9 * 10;
  } else if (nameLower.includes(queryLower)) {
    matches.push({ field: "name", value: channel.name, score: 0.8 });
    totalScore += 0.8 * 10;
  } else if (fuzzyContains(channel.name, query)) {
    const similarity = calculateSimilarity(nameLower, queryLower);
    matches.push({ field: "name", value: channel.name, score: similarity });
    totalScore += similarity * 8;
  } else {
    const similarity = calculateSimilarity(nameLower, queryLower);
    if (similarity > 0.6) {
      matches.push({ field: "name", value: channel.name, score: similarity });
      totalScore += similarity * 6;
    }
  }

  // Group matching (medium weight)
  if (channel.group) {
    const groupLower = channel.group.toLowerCase();
    if (groupLower === queryLower) {
      matches.push({ field: "group", value: channel.group, score: 1.0 });
      totalScore += 1.0 * 5;
    } else if (groupLower.includes(queryLower)) {
      matches.push({ field: "group", value: channel.group, score: 0.8 });
      totalScore += 0.8 * 5;
    } else if (fuzzyContains(channel.group, query)) {
      const similarity = calculateSimilarity(groupLower, queryLower);
      if (similarity > 0.5) {
        matches.push({ field: "group", value: channel.group, score: similarity });
        totalScore += similarity * 3;
      }
    }
  }

  // Country matching (low weight)
  if (channel.country) {
    const countryLower = channel.country.toLowerCase();
    if (countryLower.includes(queryLower)) {
      matches.push({ field: "country", value: channel.country, score: 0.5 });
      totalScore += 0.5 * 2;
    }
  }

  return { score: totalScore, matches };
}

/**
 * Fuzzy search channels
 */
export function fuzzySearchChannels(
  channels: IPTVChannel[],
  query: string,
  options: {
    minScore?: number;
    maxResults?: number;
    threshold?: number;
  } = {}
): IPTVChannel[] {
  const {
    minScore = 0.3,
    maxResults = 100,
    threshold = 0.5,
  } = options;

  if (!query.trim()) {
    return channels;
  }

  const results: Array<{ channel: IPTVChannel; score: number }> = [];

  for (const channel of channels) {
    const { score } = calculateChannelScore(channel, query);

    if (score >= minScore * 10) {
      results.push({ channel, score });
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Filter by threshold and limit results
  const filtered = results
    .filter(r => r.score >= threshold * 10)
    .slice(0, maxResults)
    .map(r => r.channel);

  return filtered;
}

/**
 * Fuzzy search content items
 */
export function fuzzySearchContent(
  items: SetflixContentItem[],
  query: string,
  options: {
    minScore?: number;
    maxResults?: number;
    threshold?: number;
  } = {}
): SetflixContentItem[] {
  const {
    minScore = 0.3,
    maxResults = 100,
    threshold = 0.5,
  } = options;

  if (!query.trim()) {
    return items;
  }

  const queryLower = query.toLowerCase();
  const results: Array<{ item: SetflixContentItem; score: number }> = [];

  for (const item of items) {
    let score = 0;
    const titleLower = item.title.toLowerCase();

    // Title matching
    if (titleLower === queryLower) {
      score += 10;
    } else if (titleLower.startsWith(queryLower)) {
      score += 9;
    } else if (titleLower.includes(queryLower)) {
      score += 8;
    } else if (fuzzyContains(item.title, query)) {
      const similarity = calculateSimilarity(titleLower, queryLower);
      score += similarity * 6;
    } else {
      const similarity = calculateSimilarity(titleLower, queryLower);
      if (similarity > 0.6) {
        score += similarity * 4;
      }
    }

    // Genre matching
    if (item.genres) {
      for (const genre of item.genres) {
        const genreLower = genre.toLowerCase();
        if (genreLower.includes(queryLower)) {
          score += 2;
        }
      }
    }

    // Description matching
    if (item.description) {
      const descLower = item.description.toLowerCase();
      if (descLower.includes(queryLower)) {
        score += 1;
      }
    }

    if (score >= minScore * 10) {
      results.push({ item, score });
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  // Filter by threshold and limit results
  return results
    .filter(r => r.score >= threshold * 10)
    .slice(0, maxResults)
    .map(r => r.item);
}

/**
 * Get search suggestions (autocomplete)
 */
export function getSearchSuggestions(
  channels: IPTVChannel[],
  query: string,
  maxResults: number = 5
): string[] {
  if (!query.trim() || query.length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();

  for (const channel of channels) {
    const nameLower = channel.name.toLowerCase();

    // Check if channel name starts with or contains query
    if (nameLower.startsWith(queryLower) || nameLower.includes(queryLower)) {
      suggestions.add(channel.name);
      if (suggestions.size >= maxResults) break;
    }
  }

  return Array.from(suggestions).slice(0, maxResults);
}

