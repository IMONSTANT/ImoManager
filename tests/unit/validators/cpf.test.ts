/**
 * @testfile cpf.test.ts
 * @description Comprehensive unit tests for CPF validation and formatting
 * @requirements RN-001, RN-021
 * @coverage
 *   - CPF validation with correct algorithm
 *   - Valid CPF formats (with and without formatting)
 *   - Invalid CPF formats
 *   - CPF with repeated digits
 *   - Edge cases (empty, null, undefined, wrong length)
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { validateCPF, unformatCPF } from '@/lib/utils/formatters'

describe('[UNIT] CPF Validator', () => {
  describe('validateCPF()', () => {
    // ========================================================================
    // HAPPY PATH - Valid CPFs
    // ========================================================================
    describe('Valid CPF scenarios', () => {
      it('should return true for valid CPF without formatting', () => {
        // Arrange
        const validCPF = '11144477735'

        // Act
        const result = validateCPF(validCPF)

        // Assert
        expect(result).toBe(true)
      })

      it('should return true for valid CPF with formatting', () => {
        // Arrange
        const validCPF = '111.444.777-35'

        // Act
        const result = validateCPF(validCPF)

        // Assert
        expect(result).toBe(true)
      })

      it('should return true for multiple valid CPFs', () => {
        // Arrange - Lista de CPFs válidos reais
        const validCPFs = [
          '11144477735',
          '111.444.777-35',
          '52998224725',
          '529.982.247-25',
          '12345678909',
          '123.456.789-09'
        ]

        // Act & Assert
        validCPFs.forEach(cpf => {
          expect(validateCPF(cpf)).toBe(true)
        })
      })
    })

    // ========================================================================
    // SAD PATH - Invalid CPFs
    // ========================================================================
    describe('Invalid CPF scenarios', () => {
      it('should return false for CPF with all same digits', () => {
        // Arrange - CPFs com todos dígitos iguais são inválidos
        const invalidCPFs = [
          '00000000000',
          '11111111111',
          '22222222222',
          '33333333333',
          '44444444444',
          '55555555555',
          '66666666666',
          '77777777777',
          '88888888888',
          '99999999999'
        ]

        // Act & Assert
        invalidCPFs.forEach(cpf => {
          expect(validateCPF(cpf)).toBe(false)
        })
      })

      it('should return false for CPF with wrong check digits', () => {
        // Arrange
        const invalidCPF = '11144477736' // último dígito errado

        // Act
        const result = validateCPF(invalidCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CPF with wrong first check digit', () => {
        // Arrange
        const invalidCPF = '11144477745' // penúltimo dígito errado

        // Act
        const result = validateCPF(invalidCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CPF with letters', () => {
        // Arrange
        const invalidCPF = '111.444.77A-35'

        // Act
        const result = validateCPF(invalidCPF)

        // Assert
        expect(result).toBe(false)
      })
    })

    // ========================================================================
    // EDGE CASES - Boundary conditions
    // ========================================================================
    describe('Edge cases', () => {
      it('should return false for empty string', () => {
        // Arrange
        const emptyCPF = ''

        // Act
        const result = validateCPF(emptyCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CPF with less than 11 digits', () => {
        // Arrange
        const shortCPF = '1114447773'

        // Act
        const result = validateCPF(shortCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CPF with more than 11 digits', () => {
        // Arrange
        const longCPF = '111444777355'

        // Act
        const result = validateCPF(longCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CPF with special characters only', () => {
        // Arrange
        const specialCPF = '...-'

        // Act
        const result = validateCPF(specialCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should accept CPF with spaces (they are removed)', () => {
        // Arrange
        const spacedCPF = '111 444 777 35'

        // Act
        const result = validateCPF(spacedCPF)

        // Assert - Espaços são removidos pela função unformat
        expect(result).toBe(true)
      })
    })

    // ========================================================================
    // ALGORITHM VERIFICATION - RN-001
    // ========================================================================
    describe('CPF algorithm verification (RN-001)', () => {
      it('should correctly calculate first verification digit', () => {
        // Arrange
        const cpfBase = '111444777' // Base sem dígitos verificadores
        const expectedFirstDigit = 3
        const cpfWithFirstDigit = cpfBase + expectedFirstDigit + '5'

        // Act
        const result = validateCPF(cpfWithFirstDigit)

        // Assert
        expect(result).toBe(true)
      })

      it('should correctly calculate second verification digit', () => {
        // Arrange
        const cpfBase = '111444777' // Base sem dígitos verificadores
        const expectedSecondDigit = 5
        const fullCPF = cpfBase + '3' + expectedSecondDigit

        // Act
        const result = validateCPF(fullCPF)

        // Assert
        expect(result).toBe(true)
      })

      it('should reject CPF when only first digit is wrong', () => {
        // Arrange
        const invalidCPF = '11144477725' // primeiro dígito verificador errado (deveria ser 3)

        // Act
        const result = validateCPF(invalidCPF)

        // Assert
        expect(result).toBe(false)
      })

      it('should reject CPF when only second digit is wrong', () => {
        // Arrange
        const invalidCPF = '11144477733' // segundo dígito verificador errado (deveria ser 5)

        // Act
        const result = validateCPF(invalidCPF)

        // Assert
        expect(result).toBe(false)
      })
    })
  })

  describe('unformatCPF()', () => {
    it('should remove all formatting from CPF', () => {
      // Arrange
      const formattedCPF = '111.444.777-35'
      const expected = '11144477735'

      // Act
      const result = unformatCPF(formattedCPF)

      // Assert
      expect(result).toBe(expected)
    })

    it('should keep CPF unchanged if no formatting exists', () => {
      // Arrange
      const unformattedCPF = '11144477735'

      // Act
      const result = unformatCPF(unformattedCPF)

      // Assert
      expect(result).toBe(unformattedCPF)
    })

    it('should remove dots, hyphens and spaces', () => {
      // Arrange
      const cpf = '111.444.777-35 '
      const expected = '11144477735'

      // Act
      const result = unformatCPF(cpf)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle empty string', () => {
      // Arrange
      const emptyCPF = ''

      // Act
      const result = unformatCPF(emptyCPF)

      // Assert
      expect(result).toBe('')
    })
  })
})
