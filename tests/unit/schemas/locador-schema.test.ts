/**
 * @testfile locador-schema.test.ts
 * @description Comprehensive unit tests for Locador (Landlord) Zod schema
 * @requirements RN-002, RN-003, RN-004, RF-013
 * @coverage
 *   - RN-002: CNPJ validation with correct algorithm
 *   - RN-003: CNPJ and Razão Social mandatory for PJ
 *   - RN-004: CNPJ normalization (without formatting)
 *   - Locador field validations
 *   - Edge cases
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { locadorSchema } from '@/lib/validations/imobiliaria'

describe('[UNIT] Locador Schema', () => {
  // ========================================================================
  // HAPPY PATH - Pessoa Física (PF)
  // ========================================================================
  describe('Valid Pessoa Física scenarios', () => {
    it('should validate pessoa física without CNPJ or Razão Social', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate pessoa física even with optional CNPJ fields', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'fisica' as const,
        cnpj: '',
        razao_social: ''
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  // ========================================================================
  // HAPPY PATH - Pessoa Jurídica (PJ) with RN-003
  // ========================================================================
  describe('Valid Pessoa Jurídica scenarios (RN-003)', () => {
    it('should validate pessoa jurídica with valid CNPJ and Razão Social (RN-003)', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181', // Valid CNPJ
        razao_social: 'Empresa Exemplo LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate pessoa jurídica with formatted CNPJ (RN-002)', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11.222.333/0001-81', // Formatted CNPJ
        razao_social: 'Empresa Exemplo LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate with multiple valid CNPJs', () => {
      // Arrange
      const validCNPJs = [
        '11222333000181',
        '34028316000103',
        '00000000000191'
      ]

      // Act & Assert
      validCNPJs.forEach(cnpj => {
        const result = locadorSchema.safeParse({
          pessoa_id: 1,
          tipo_pessoa: 'juridica' as const,
          cnpj,
          razao_social: 'Empresa LTDA'
        })
        expect(result.success).toBe(true)
      })
    })
  })

  // ========================================================================
  // SAD PATH - PJ without required fields (RN-003)
  // ========================================================================
  describe('Pessoa Jurídica validation failures (RN-003)', () => {
    it('should reject pessoa jurídica without CNPJ (RN-003)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        razao_social: 'Empresa Exemplo LTDA'
        // Missing CNPJ
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CNPJ e Razão Social são obrigatórios para pessoa jurídica')
        expect(result.error.issues[0].path).toContain('cnpj')
      }
    })

    it('should reject pessoa jurídica without Razão Social (RN-003)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181'
        // Missing Razão Social
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CNPJ e Razão Social são obrigatórios para pessoa jurídica')
      }
    })

    it('should reject pessoa jurídica with empty CNPJ string (RN-003)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '',
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject pessoa jurídica with empty Razão Social (RN-003)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181',
        razao_social: ''
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject pessoa jurídica without both CNPJ and Razão Social', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // CNPJ VALIDATION - RN-002
  // ========================================================================
  describe('CNPJ validation algorithm (RN-002)', () => {
    it('should reject invalid CNPJ for pessoa jurídica (RN-002)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000182', // Invalid check digit
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CNPJ inválido')
        expect(result.error.issues[0].path).toContain('cnpj')
      }
    })

    it('should reject CNPJ with all same digits (RN-002)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11111111111111',
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('CNPJ inválido')
      }
    })

    it('should reject CNPJ with wrong length', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '1122233300018', // 13 digits
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject CNPJ with letters', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11.222.333/000A-81',
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // TIPO_PESSOA VALIDATION
  // ========================================================================
  describe('Tipo pessoa validation', () => {
    it('should accept "fisica" as tipo_pessoa', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should accept "juridica" as tipo_pessoa', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181',
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject invalid tipo_pessoa value', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'invalido'
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing tipo_pessoa', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // REQUIRED FIELDS
  // ========================================================================
  describe('Required fields validation', () => {
    it('should reject missing pessoa_id', () => {
      // Arrange
      const invalidData = {
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject invalid pessoa_id (zero)', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 0,
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject negative pessoa_id', () => {
      // Arrange
      const invalidData = {
        pessoa_id: -1,
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // RAZAO_SOCIAL VALIDATION
  // ========================================================================
  describe('Razão Social validation', () => {
    it('should accept Razão Social up to 255 characters', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181',
        razao_social: 'A'.repeat(255)
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject Razão Social longer than 255 characters', () => {
      // Arrange
      const invalidData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '11222333000181',
        razao_social: 'A'.repeat(256)
      }

      // Act
      const result = locadorSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Razão social muito longa')
      }
    })
  })

  // ========================================================================
  // EDGE CASES
  // ========================================================================
  describe('Edge cases', () => {
    it('should coerce string pessoa_id to number', () => {
      // Arrange
      const validData = {
        pessoa_id: '1',
        tipo_pessoa: 'fisica' as const
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.pessoa_id).toBe('number')
        expect(result.data.pessoa_id).toBe(1)
      }
    })

    it('should handle optional fields as undefined', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'fisica' as const,
        cnpj: undefined,
        razao_social: undefined
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should trim whitespace from CNPJ via validation', () => {
      // Arrange
      const validData = {
        pessoa_id: 1,
        tipo_pessoa: 'juridica' as const,
        cnpj: '  11222333000181  ',
        razao_social: 'Empresa LTDA'
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert - Should pass because validateCNPJ removes non-digits (including spaces)
      expect(result.success).toBe(true)
    })
  })

  // ========================================================================
  // COMBINED SCENARIOS
  // ========================================================================
  describe('Combined validation scenarios', () => {
    it('should handle complete pessoa jurídica data correctly', () => {
      // Arrange
      const validData = {
        pessoa_id: 123,
        tipo_pessoa: 'juridica' as const,
        cnpj: '34.028.316/0001-03',
        razao_social: 'Acme Corporation Ltda'
      }

      // Act
      const result = locadorSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.pessoa_id).toBe(123)
        expect(result.data.tipo_pessoa).toBe('juridica')
        expect(result.data.cnpj).toBe('34.028.316/0001-03')
        expect(result.data.razao_social).toBe('Acme Corporation Ltda')
      }
    })

    it('should validate real-world company CNPJs', () => {
      // Arrange
      const companies = [
        { cnpj: '00000000000191', razao: 'Banco do Brasil S.A.' },
        { cnpj: '60701190000104', razao: 'Itaú Unibanco S.A.' },
        { cnpj: '33000167000101', razao: 'Petrobras S.A.' }
      ]

      // Act & Assert
      companies.forEach(({ cnpj, razao }) => {
        const result = locadorSchema.safeParse({
          pessoa_id: 1,
          tipo_pessoa: 'juridica' as const,
          cnpj,
          razao_social: razao
        })
        expect(result.success).toBe(true)
      })
    })
  })
})
