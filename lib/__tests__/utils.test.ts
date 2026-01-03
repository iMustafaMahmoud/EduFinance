import { cn } from '../utils'

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2')
      expect(result).toBe('px-4 py-2')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('hidden-class')
    })

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, 'class2', null, 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('merges Tailwind classes correctly (removes duplicates)', () => {
      const result = cn('px-2 py-1', 'px-4')
      // tailwind-merge should keep only px-4
      expect(result).toContain('px-4')
      expect(result).not.toContain('px-2')
    })

    it('handles empty inputs', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('handles array inputs', () => {
      const result = cn(['class1', 'class2'], 'class3')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
    })
  })
})

