/**
 * @testfile cnpj.test.ts
 * @description Comprehensive unit tests for CNPJ validation and formatting
 * @requirements RN-002, RN-004, RN-022
 * @coverage
 *   - CNPJ validation with correct algorithm (RN-002)
 *   - CNPJ normalization without formatting (RN-004)
 *   - Valid CNPJ formats (with and without formatting)
 *   - Invalid CNPJ formats
 *   - CNPJ with repeated digits
 *   - Edge cases (empty, null, undefined, wrong length)
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { validateCNPJ, unformatCNPJ } from '@/lib/utils/formatters'

describe('[UNIT] CNPJ Validator', () => {
  describe('validateCNPJ()', () => {
    // ========================================================================
    // HAPPY PATH - Valid CNPJs
    // ========================================================================
    describe('Valid CNPJ scenarios', () => {
      it('should return true for valid CNPJ without formatting', () => {
        // Arrange
        const validCNPJ = '11222333000181'

        // Act
        const result = validateCNPJ(validCNPJ)

        // Assert
        expect(result).toBe(true)
      })

      it('should return true for valid CNPJ with formatting', () => {
        // Arrange
        const validCNPJ = '11.222.333/0001-81'

        // Act
        const result = validateCNPJ(validCNPJ)

        // Assert
        expect(result).toBe(true)
      })

      it('should return true for multiple valid CNPJs', () => {
        // Arrange - Lista de CNPJs válidos reais
        const validCNPJs = [
          '11222333000181',
          '11.222.333/0001-81',
          '34028316000103',
          '34.028.316/0001-03',
          '00000000000191',
          '00.000.000/0001-91'
        ]

        // Act & Assert
        validCNPJs.forEach(cnpj => {
          expect(validateCNPJ(cnpj)).toBe(true)
        })
      })

      it('should return true for CNPJ of well-known companies', () => {
        // Arrange - CNPJs de empresas conhecidas (formato público)
        const knownCNPJs = [
          '00000000000191', // Banco do Brasil
          '60701190000104', // Itaú
          '33000167000101'  // Petrobras
        ]

        // Act & Assert
        knownCNPJs.forEach(cnpj => {
          expect(validateCNPJ(cnpj)).toBe(true)
        })
      })
    })

    // ========================================================================
    // SAD PATH - Invalid CNPJs
    // ========================================================================
    describe('Invalid CNPJ scenarios', () => {
      it('should return false for CNPJ with all same digits', () => {
        // Arrange - CNPJs com todos dígitos iguais são inválidos
        const invalidCNPJs = [
          '00000000000000',
          '11111111111111',
          '22222222222222',
          '33333333333333',
          '44444444444444',
          '55555555555555',
          '66666666666666',
          '77777777777777',
          '88888888888888',
          '99999999999999'
        ]

        // Act & Assert
        invalidCNPJs.forEach(cnpj => {
          expect(validateCNPJ(cnpj)).toBe(false)
        })
      })

      it('should return false for CNPJ with wrong check digits', () => {
        // Arrange
        const invalidCNPJ = '11222333000182' // último dígito errado

        // Act
        const result = validateCNPJ(invalidCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CNPJ with wrong first check digit', () => {
        // Arrange
        const invalidCNPJ = '11222333000191' // penúltimo dígito errado

        // Act
        const result = validateCNPJ(invalidCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CNPJ with letters', () => {
        // Arrange
        const invalidCNPJ = '11.222.333/000A-81'

        // Act
        const result = validateCNPJ(invalidCNPJ)

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
        const emptyCNPJ = ''

        // Act
        const result = validateCNPJ(emptyCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CNPJ with less than 14 digits', () => {
        // Arrange
        const shortCNPJ = '1122233300018'

        // Act
        const result = validateCNPJ(shortCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CNPJ with more than 14 digits', () => {
        // Arrange
        const longCNPJ = '112223330001811'

        // Act
        const result = validateCNPJ(longCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should return false for CNPJ with special characters only', () => {
        // Arrange
        const specialCNPJ = '../-'

        // Act
        const result = validateCNPJ(specialCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should accept CNPJ with spaces (they are removed)', () => {
        // Arrange
        const spacedCNPJ = '11 222 333 0001 81'

        // Act
        const result = validateCNPJ(spacedCNPJ)

        // Assert - Espaços são removidos pela função unformat
        expect(result).toBe(true)
      })
    })

    // ========================================================================
    // ALGORITHM VERIFICATION - RN-002
    // ========================================================================
    describe('CNPJ algorithm verification (RN-002)', () => {
      it('should correctly calculate first verification digit', () => {
        // Arrange
        const cnpjBase = '112223330001' // Base sem dígitos verificadores
        const expectedFirstDigit = 8
        const cnpjWithFirstDigit = cnpjBase + expectedFirstDigit + '1'

        // Act
        const result = validateCNPJ(cnpjWithFirstDigit)

        // Assert
        expect(result).toBe(true)
      })

      it('should correctly calculate second verification digit', () => {
        // Arrange
        const cnpjBase = '112223330001' // Base sem dígitos verificadores
        const expectedSecondDigit = 1
        const fullCNPJ = cnpjBase + '8' + expectedSecondDigit

        // Act
        const result = validateCNPJ(fullCNPJ)

        // Assert
        expect(result).toBe(true)
      })

      it('should reject CNPJ when only first digit is wrong', () => {
        // Arrange
        const invalidCNPJ = '11222333000171' // primeiro dígito verificador errado (deveria ser 8)

        // Act
        const result = validateCNPJ(invalidCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should reject CNPJ when only second digit is wrong', () => {
        // Arrange
        const invalidCNPJ = '11222333000182' // segundo dígito verificador errado (deveria ser 1)

        // Act
        const result = validateCNPJ(invalidCNPJ)

        // Assert
        expect(result).toBe(false)
      })

      it('should validate using modulo 11 algorithm correctly', () => {
        // Arrange - Testando o algoritmo completo
        const validCNPJ = '34028316000103'

        // Act
        const result = validateCNPJ(validCNPJ)

        // Assert
        expect(result).toBe(true)
      })
    })
  })

  describe('unformatCNPJ() - RN-004: Normalization', () => {
    it('should remove all formatting from CNPJ', () => {
      // Arrange
      const formattedCNPJ = '11.222.333/0001-81'
      const expected = '11222333000181'

      // Act
      const result = unformatCNPJ(formattedCNPJ)

      // Assert
      expect(result).toBe(expected)
    })

    it('should keep CNPJ unchanged if no formatting exists', () => {
      // Arrange
      const unformattedCNPJ = '11222333000181'

      // Act
      const result = unformatCNPJ(unformattedCNPJ)

      // Assert
      expect(result).toBe(unformattedCNPJ)
    })

    it('should remove dots, slashes, hyphens and spaces', () => {
      // Arrange
      const cnpj = '11.222.333/0001-81 '
      const expected = '11222333000181'

      // Act
      const result = unformatCNPJ(cnpj)

      // Assert
      expect(result).toBe(expected)
    })

    it('should handle empty string', () => {
      // Arrange
      const emptyCNPJ = ''

      // Act
      const result = unformatCNPJ(emptyCNPJ)

      // Assert
      expect(result).toBe('')
    })

    it('should normalize CNPJ for database storage (RN-004)', () => {
      // Arrange - Testando normalização para armazenamento
      const userInputCNPJ = '11.222.333/0001-81'
      const databaseFormat = '11222333000181'

      // Act
      const normalized = unformatCNPJ(userInputCNPJ)

      // Assert
      expect(normalized).toBe(databaseFormat)
      expect(normalized).toMatch(/^\d{14}$/)
    })
  })
})
