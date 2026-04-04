import type { Transition, Variants } from 'motion/react';

// Standard scroll reveal: fade-in + translate-y(20px), 0.3-0.5s (D-04)
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// Fade in without vertical movement
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

// Scale up from slightly smaller
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

// Stagger container: 0.1s between items (D-04)
export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// Fast stagger for smaller item groups
export const staggerContainerFast: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

// Hero entrance: slightly bolder (D-04) -- larger translate, longer duration
export const heroEntrance: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

// Default transition timing (D-04: 0.3-0.5s)
export const defaultTransition = {
    duration: 0.4,
    ease: [0.25, 0.1, 0.25, 1] as const,
};

// Hero transition (slightly longer)
export const heroTransition = {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1] as const,
};

// Quick transition for micro-interactions
export const quickTransition = {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1] as const,
};

// === Brand v1.1 Motion Design Language ===

// D-17: Modal/overlay entrance -- scale from 0.95 with opacity fade
export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
};

// D-17: Drawer/panel slide-in from left (LTR default)
export const slideInFromLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

// D-17: Drawer/panel slide-in from right (RTL or right panels)
export const slideInFromRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
};

// D-17: Slide up entrance (for bottom sheets, tooltips)
export const slideInFromBottom: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

// D-20: Transition timing tokens
export const transitionFast: Transition = {
    duration: 0.15,
    ease: 'easeOut',
};

export const transitionDefault: Transition = {
    duration: 0.3,
    ease: 'easeOut',
};

export const transitionSlow: Transition = {
    duration: 0.5,
    ease: 'easeOut',
};

// D-18: Spring-based interaction transition (for hover/press feedback)
export const interactionSpring: Transition = {
    type: 'spring',
    stiffness: 400,
    damping: 30,
};

// D-18: Gentle spring for larger UI elements
export const gentleSpring: Transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
};

// D-19: Slow stagger for ambient/decorative elements
export const staggerContainerSlow: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};
