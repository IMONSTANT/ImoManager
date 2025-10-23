/**
 * @testfile cnpj-formatter.test.ts
 * @description Comprehensive unit tests for CNPJ formatting functions
 * @requirements RN-022
 * @coverage
 *   - CNPJ formatting for display (RN-022)
 *   - CNPJ masking during input
 *   - Handling null/undefined values
 *   - Edge cases
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { formatCNPJ, maskCNPJ } from '@/lib/utils/formatters'

describe('[UNIT] CNPJ Formatter', () => {
  describe('formatCNPJ() - RN-022: Display Formatting', () => {
    // ========================================================================
    // HAPPY PATH - Valid formatting
    // ========================================================================
    it('should format valid 14-digit CNPJ to XX.XXX.XXX/XXXX-XX pattern', () => {
      // Arrange
      const unformattedCNPJ = '11222333000181'
      const expected = '11.222.333/0001-81'

      // Act
      const result = formatCNPJ(unformattedCNPJ)

      // Assert
      expect(result).toBe(expected)
    })

    it('should keep already formatted CNPJ unchanged', () => {
      // Arrange
      const formattedCNPJ = '11.222.333/0001-81'
      const expected = '11.222.333/0001-81'

      // Act
      const result = formatCNPJ(formattedCNPJ)

      // Assert
      expect(result).toBe(expected)
    })

    it('should format multiple CNPJs correctly', () => {
      // Arrange
      const testCases = [
        { input: '11222333000181', expected: '11.222.333/0001-81' },
        { input: '34028316000103', expected: '34.028.316/0001-03' },
        { input: '00000000000191', expected: '00.000.000/0001-91' }
      ]

      // Act & Assert
      testCases.forEach(({ input, expected }) => {
        expect(formatCNPJ(input)).toBe(expected)
      })
    })

    it('should format CNPJ with leading zeros correctly', () => {
      // Arrange
      const cnpjWithZeros = '00000000000191'
      const expected = '00.000.000/0001-91'

      // Act
      const result = formatCNPJ(cnpjWithZeros)

      // Assert
      expect(result).toBe(expected)
    })

    // ========================================================================
    // EDGE CASES - Null/undefined handling
    // ========================================================================
    it('should return empty string for null', () => {
      // Arrange
      const nullCNPJ = null

      // Act
      const result = formatCNPJ(nullCNPJ)

      // Assert
      expect(result).toBe('')
    })

    it('should return empty string for undefined', () => {
      // Arrange
      const undefinedCNPJ = undefined

      // Act
      const result = formatCNPJ(undefinedCNPJ)

      // Assert
      expect(result).toBe('')
    })

    it('should return empty string for empty string', () => {
      // Arrange
      const emptyCNPJ = ''

      // Act
      const result = formatCNPJ(emptyCNPJ)

      // Assert
      expect(result).toBe('')
    })

    // ========================================================================
    // SAD PATH - Invalid lengths
    // ========================================================================
    it('should return original string if length is not 14 digits', () => {
      // Arrange
      const shortCNPJ = '1122233300018'

      // Act
      const result = formatCNPJ(shortCNPJ)

      // Assert
      expect(result).toBe(shortCNPJ)
    })

    it('should return original string if length is greater than 14 digits', () => {
      // Arrange
      const longCNPJ = '112223330001811'

      // Act
      const result = formatCNPJ(longCNPJ)

      // Assert
      expect(result).toBe(longCNPJ)
    })
  })

  describe('maskCNPJ() - Input Masking', () => {
    // ========================================================================
    // PROGRESSIVE MASKING - As user types
    // ========================================================================
    it('should not format when less than 2 digits', () => {
      // Arrange & Act & Assert
      expect(maskCNPJ('1')).toBe('1')
    })

    it('should add first dot after 2 digits', () => {
      // Arrange
      const input = '112'
      const expected = '11.2'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should add second dot after 5 digits', () => {
      // Arrange
      const input = '112223'
      const expected = '11.222.3'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should add slash after 8 digits', () => {
      // Arrange
      const input = '112223330'
      const expected = '11.222.333/0'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should add hyphen after 12 digits', () => {
      // Arrange
      const input = '1122233300018'
      const expected = '11.222.333/0001-8'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should complete full format with 14 digits', () => {
      // Arrange
      const input = '11222333000181'
      const expected = '11.222.333/0001-81'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should limit to 14 digits maximum', () => {
      // Arrange
      const input = '112223330001819999'
      const expected = '11.222.333/0001-81'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    // ========================================================================
    // SANITIZATION - Remove non-digits
    // ========================================================================
    it('should remove non-digit characters before masking', () => {
      // Arrange
      const input = '11abc222xyz333/0001-81'
      const expected = '11.222.333/0001-81'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle already formatted input', () => {
      // Arrange
      const input = '11.222.333/0001-81'
      const expected = '11.222.333/0001-81'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle spaces in input', () => {
      // Arrange
      const input = '11 222 333 0001 81'
      const expected = '11.222.333/0001-81'

      // Act
      const result = maskCNPJ(input)

      // Assert
      expect(result).toBe(expected)
    })

    // ========================================================================
    // REAL-TIME TYPING SIMULATION
    // ========================================================================
    it('should progressively format as user types', () => {
      // Arrange - Simulating user typing "11222333000181"
      const typingSequence = [
        { input: '1', expected: '1' },
        { input: '11', expected: '11' },
        { input: '112', expected: '11.2' },
        { input: '1122', expected: '11.22' },
        { input: '11222', expected: '11.222' },
        { input: '112223', expected: '11.222.3' },
        { input: '1122233', expected: '11.222.33' },
        { input: '11222333', expected: '11.222.333' },
        { input: '112223330', expected: '11.222.333/0' },
        { input: '1122233300', expected: '11.222.333/00' },
        { input: '11222333000', expected: '11.222.333/000' },
        { input: '112223330001', expected: '11.222.333/0001' },
        { input: '1122233300018', expected: '11.222.333/0001-8' },
        { input: '11222333000181', expected: '11.222.333/0001-81' }
      ]

      // Act & Assert
      typingSequence.forEach(({ input, expected }) => {
        expect(maskCNPJ(input)).toBe(expected)
      })
    })

    // ========================================================================
    // FORMATTING CONSISTENCY
    // ========================================================================
    it('should format same value consistently regardless of input format', () => {
      // Arrange
      const inputs = [
        '11222333000181',
        '11.222.333/0001-81',
        '11 222 333 0001 81',
        '11.222.333.0001.81'
      ]
      const expected = '11.222.333/0001-81'

      // Act & Assert
      inputs.forEach(input => {
        expect(maskCNPJ(input)).toBe(expected)
      })
    })
  })
})
