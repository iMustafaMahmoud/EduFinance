import '@testing-library/jest-dom'
import React from 'react'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => {
  const React = require('react')
  
  // Helper to filter out motion-specific props
  const filterMotionProps = (props: any) => {
    const {
      initial,
      animate,
      exit,
      variants,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileDrag,
      whileInView,
      drag,
      dragConstraints,
      dragElastic,
      layout,
      layoutId,
      ...rest
    } = props
    return rest
  }
  
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => 
        React.createElement('div', { ...filterMotionProps(props), ref }, children)
      ),
      button: React.forwardRef(({ children, ...props }: any, ref: any) =>
        React.createElement('button', { ...filterMotionProps(props), ref }, children)
      ),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia only in jsdom environment
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}
