import { Variants, Transition } from "framer-motion"

// Netflix-style animation timing
export const netflixTransitions: {
  fast: Transition;
  normal: Transition;
  slow: Transition;
} = {
  fast: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  normal: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  slow: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
}

// Card hover animations
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    zIndex: 1,
  },
  hover: {
    scale: 1.5,
    y: -50,
    zIndex: 50,
    transition: netflixTransitions.normal,
  },
}

// Fade animations
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: netflixTransitions.normal },
  exit: { opacity: 0, transition: netflixTransitions.fast },
}

// Slide animations
export const slideVariants: Variants = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: netflixTransitions.normal },
  exit: { x: 20, opacity: 0, transition: netflixTransitions.fast },
}

// Modal animations
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: netflixTransitions.normal },
  exit: { opacity: 0, scale: 0.95, transition: netflixTransitions.fast },
}

// Backdrop animations
export const backdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: netflixTransitions.fast },
  exit: { opacity: 0, transition: netflixTransitions.fast },
}

