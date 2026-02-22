/**
 * Page Transition Animations
 * Reusable animation variants for Framer Motion
 * Use with motion components for smooth page transitions
 */

export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: 'easeIn',
    },
  },
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
}

export const cardHoverVariants = {
  rest: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  hover: {
    boxShadow: '0 20px 25px rgba(0,0,0,0.15)',
    y: -5,
    transition: {
      duration: 0.3,
    },
  },
}

export const buttonVariants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
}

export const slideInVariants = (direction = 'left') => {
  const directionOffsets = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
  }

  return {
    initial: directionOffsets[direction],
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: directionOffsets[direction],
  }
}

export const fadeInUpVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const staggerContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
}

export const scaleInVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

export const rotateInVariants = {
  initial: {
    opacity: 0,
    rotate: -10,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

export const shimmerVariants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 100%'],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
}

export const bounceVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// Combine variants for complex animations
export const createCombinedVariants = (...variants) => {
  return Object.assign({}, ...variants)
}

// Delay helper function
export const delayChildren = (index, baseDelay = 0, delayPerChild = 0.1) => {
  return baseDelay + index * delayPerChild
}
