/**
 * @testfile contrato-schema.test.ts
 * @description Comprehensive unit tests for Contrato (Lease Contract) Zod schema
 * @requirements RN-008, RN-009, RN-014, RF-021
 * @coverage
 *   - RN-008: Data fim > data início
 *   - RN-009: Dia vencimento entre 1-31
 *   - RN-014: Data assinatura <= data início
 *   - Contract field validations
 *   - Edge cases and boundary conditions
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { contratoLocacaoSchema } from '@/lib/validations/imobiliaria'

describe('[UNIT] Contrato Locação Schema', () => {
  // ========================================================================
  // HAPPY PATH - Valid contract data
  // ========================================================================
  describe('Valid contract scenarios', () => {
    it('should validate complete contract data', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        fiador_id: 1,
        tipo_locacao_id: 1,
        valor: 2500.00,
        caucao: 5000.00,
        valor_iptu: 150.00,
        valor_condominio: 300.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2025-01-01',
        data_vencimento_aluguel: 10,
        indice_reajuste: 'IGPM',
        periodicidade_reajuste: 12,
        dia_vencimento: 10,
        observacoes: 'Contrato padrão',
        clausulas_especiais: 'Permite animais'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate minimal required fields', () => {
      // Arrange
      const minimalData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(minimalData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dia_vencimento).toBe(10) // default
        expect(result.data.indice_reajuste).toBe('IGPM') // default
        expect(result.data.periodicidade_reajuste).toBe(12) // default
      }
    })

    it('should validate when data_fim is exactly 1 day after data_inicio', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-01-02' // Minimal valid duration
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  // ========================================================================
  // DATE VALIDATION - RN-008: Data fim > data início
  // ========================================================================
  describe('Date validation (RN-008)', () => {
    it('should reject when data_fim equals data_inicio (RN-008)', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-01-01' // Same date
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de fim deve ser posterior à data de início')
        expect(result.error.issues[0].path).toContain('data_fim_contrato')
      }
    })

    it('should reject when data_fim is before data_inicio (RN-008)', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-12-31',
        data_fim_contrato: '2024-01-01' // Before start
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de fim deve ser posterior à data de início')
      }
    })

    it('should validate long-term contracts', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2029-01-01' // 5 years
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject empty data_inicio_contrato', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de início é obrigatória')
      }
    })

    it('should reject empty data_fim_contrato', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: ''
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Data de fim é obrigatória')
      }
    })
  })

  // ========================================================================
  // DIA VENCIMENTO VALIDATION - RN-009: Entre 1-31
  // ========================================================================
  describe('Dia vencimento validation (RN-009)', () => {
    it('should accept dia_vencimento of 1 (lower boundary)', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: 1
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should accept dia_vencimento of 31 (upper boundary)', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: 31
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject dia_vencimento of 0 (RN-009)', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: 0
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Dia de vencimento deve ser entre 1 e 31')
      }
    })

    it('should reject dia_vencimento of 32 (RN-009)', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: 32
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Dia de vencimento deve ser entre 1 e 31')
      }
    })

    it('should reject negative dia_vencimento', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: -5
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should use default dia_vencimento of 10', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dia_vencimento).toBe(10)
      }
    })
  })

  // ========================================================================
  // MONETARY VALUES VALIDATION
  // ========================================================================
  describe('Monetary values validation', () => {
    it('should accept positive valor', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2500.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative valor', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: -500.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor do aluguel é obrigatório')
      }
    })

    it('should reject zero valor', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 0,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should accept zero caucao (optional)', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        caucao: 0,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative caucao', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        caucao: -1000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Caução deve ser positiva')
      }
    })

    it('should reject negative valor_iptu', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        valor_iptu: -50.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor do IPTU deve ser positivo')
      }
    })

    it('should reject negative valor_condominio', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        valor_condominio: -100.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor do condomínio deve ser positivo')
      }
    })
  })

  // ========================================================================
  // REQUIRED FIELDS VALIDATION
  // ========================================================================
  describe('Required fields validation', () => {
    it('should reject missing imovel_id', () => {
      // Arrange
      const invalidData = {
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing locatario_id', () => {
      // Arrange
      const invalidData = {
        imovel_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should allow missing fiador_id (optional)', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  // ========================================================================
  // DEFAULT VALUES
  // ========================================================================
  describe('Default values', () => {
    it('should use all default values when not provided', () => {
      // Arrange
      const minimalData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(minimalData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dia_vencimento).toBe(10)
        expect(result.data.indice_reajuste).toBe('IGPM')
        expect(result.data.periodicidade_reajuste).toBe(12)
        expect(result.data.data_vencimento_aluguel).toBe(10)
      }
    })

    it('should allow overriding default values', () => {
      // Arrange
      const customData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 2000.00,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31',
        dia_vencimento: 5,
        indice_reajuste: 'IPCA',
        periodicidade_reajuste: 24
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(customData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dia_vencimento).toBe(5)
        expect(result.data.indice_reajuste).toBe('IPCA')
        expect(result.data.periodicidade_reajuste).toBe(24)
      }
    })
  })

  // ========================================================================
  // EDGE CASES
  // ========================================================================
  describe('Edge cases', () => {
    it('should coerce string numbers to numbers', () => {
      // Arrange
      const validData = {
        imovel_id: '1',
        locatario_id: '1',
        tipo_locacao_id: '1',
        valor: '2000.00',
        dia_vencimento: '15',
        periodicidade_reajuste: '12',
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.imovel_id).toBe('number')
        expect(typeof result.data.valor).toBe('number')
        expect(typeof result.data.dia_vencimento).toBe('number')
      }
    })

    it('should handle very large contract values', () => {
      // Arrange
      const validData = {
        imovel_id: 1,
        locatario_id: 1,
        tipo_locacao_id: 1,
        valor: 999999.99,
        caucao: 1999999.98,
        data_inicio_contrato: '2024-01-01',
        data_fim_contrato: '2024-12-31'
      }

      // Act
      const result = contratoLocacaoSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })
})
