/**
 * @testfile cpf-formatter.test.ts
 * @description Comprehensive unit tests for CPF formatting functions
 * @requirements RN-021
 * @coverage
 *   - CPF formatting for display (RN-021)
 *   - CPF masking during input
 *   - Handling null/undefined values
 *   - Edge cases
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { formatCPF, maskCPF } from '@/lib/utils/formatters'

describe('[UNIT] CPF Formatter', () => {
  describe('formatCPF() - RN-021: Display Formatting', () => {
    // ========================================================================
    // HAPPY PATH - Valid formatting
    // ========================================================================
    it('should format valid 11-digit CPF to XXX.XXX.XXX-XX pattern', () => {
      // Arrange
      const unformattedCPF = '11144477735'
      const expected = '111.444.777-35'

      // Act
      const result = formatCPF(unformattedCPF)

      // Assert
      expect(result).toBe(expected)
    })

    it('should keep already formatted CPF unchanged', () => {
      // Arrange
      const formattedCPF = '111.444.777-35'
      const expected = '111.444.777-35'

      // Act
      const result = formatCPF(formattedCPF)

      // Assert
      expect(result).toBe(expected)
    })

    it('should format multiple CPFs correctly', () => {
      // Arrange
      const testCases = [
        { input: '11144477735', expected: '111.444.777-35' },
        { input: '52998224725', expected: '529.982.247-25' },
        { input: '12345678909', expected: '123.456.789-09' }
      ]

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(formatCPF(input)).toBe(expected)
      })
    })

    // ========================================================================
    // EDGE CASES - Null/undefined handling
    // ========================================================================
    it('should return empty string for null', () => {
      // Arrange
      const nullCPF = null

      // Act
      const result = formatCPF(nullCPF)

      // Assert
      expect(result).toBe('')
    })

    it('should return empty string for undefined', () => {
      // Arrange
      const undefinedCPF = undefined

      // Act
      const result = formatCPF(undefinedCPF)

      // Assert
      expect(result).toBe('')
    })

    it('should return empty string for empty string', () => {
      // Arrange
      const emptyCPF = ''

      // Act
      const result = formatCPF(emptyCPF)

      // Assert
      expect(result).toBe('')
    })

    // ========================================================================
    // SAD PATH - Invalid lengths
    // ========================================================================
    it('should return original string if length is not 11 digits', () => {
      // Arrange
      const shortCPF = '1114447773'

      // Act
      const result = formatCPF(shortCPF)

      // Assert
      expect(result).toBe(shortCPF)
    })

    it('should return original string if length is greater than 11 digits', () => {
      // Arrange
      const longCPF = '111444777355'

      // Act
      const result = formatCPF(longCPF)

      // Assert
      expect(result).toBe(longCPF)
    })

    it('should handle CPF with leading zeros', () => {
      // Arrange
      const cpfWithZeros = '00012345678'
      const expected = '000.123.456-78'

      // Act
      const result = formatCPF(cpfWithZeros)

      // Assert
      expect(result).toBe(expected)
    })
  })

  describe('maskCPF() - Input Masking', () => {
    // ========================================================================
    // PROGRESSIVE MASKING - As user types
    // ========================================================================
    it('should not format when less than 3 digits', () => {
      // Arrange & Act & Assert
      expect(maskCPF('1')).toBe('1')
      expect(maskCPF('11')).toBe('11')
    })

    it('should add first dot after 3 digits', () => {
      // Arrange
      const input = '1114'
      const expected = '111.4'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should add second dot after 6 digits', () => {
      // Arrange
      const input = '1114447'
      const expected = '111.444.7'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should add hyphen after 9 digits', () => {
      // Arrange
      const input = '111444777'
      const expected = '111.444.777-'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should complete full format with 11 digits', () => {
      // Arrange
      const input = '11144477735'
      const expected = '111.444.777-35'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should limit to 11 digits maximum', () => {
      // Arrange
      const input = '111444777355555'
      const expected = '111.444.777-35'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    // ========================================================================
    // SANITIZATION - Remove non-digits
    // ========================================================================
    it('should remove non-digit characters before masking', () => {
      // Arrange
      const input = '111abc444xyz777-35'
      const expected = '111.444.777-35'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle already formatted input', () => {
      // Arrange
      const input = '111.444.777-35'
      const expected = '111.444.777-35'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle spaces in input', () => {
      // Arrange
      const input = '111 444 777 35'
      const expected = '111.444.777-35'

      // Act
      const result = maskCPF(input)

      // Assert
      expect(result).toBe(expected)
    })

    // ========================================================================
    // REAL-TIME TYPING SIMULATION
    // ========================================================================
    it('should progressively format as user types', () => {
      // Arrange - Simulating user typing "11144477735"
      const typingSequence = [
        { input: '1', expected: '1' },
        { input: '11', expected: '11' },
        { input: '111', expected: '111' },
        { input: '1114', expected: '111.4' },
        { input: '11144', expected: '111.44' },
        { input: '111444', expected: '111.444' },
        { input: '1114447', expected: '111.444.7' },
        { input: '11144477', expected: '111.444.77' },
        { input: '111444777', expected: '111.444.777-' },
        { input: '1114447773', expected: '111.444.777-3' },
        { input: '11144477735', expected: '111.444.777-35' }
      ]

      // Act & Assert
      typingSequence.forEach(({ input, expected }) => {
        expect(maskCPF(input)).toBe(expected)
      })
    })
  })
})
