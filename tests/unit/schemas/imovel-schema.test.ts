/**
 * @testfile imovel-schema.test.ts
 * @description Comprehensive unit tests for Imovel (Property) Zod schema
 * @requirements RN-005, RN-007, RF-017
 * @coverage
 *   - RN-005: Área construída <= área total
 *   - RN-007: Valores monetários não-negativos
 *   - Property field validations
 *   - Edge cases and boundary conditions
 * @author TDD Test Architect Agent
 */

import { describe, it, expect } from 'vitest'
import { imovelSchema } from '@/lib/validations/imobiliaria'

describe('[UNIT] Imovel Schema', () => {
  // ========================================================================
  // HAPPY PATH - Valid property data
  // ========================================================================
  describe('Valid property scenarios', () => {
    it('should validate complete property data', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        codigo_imovel: 'IMV20240001',
        descricao: 'Casa ampla com 3 quartos',
        area_total: 250.00,
        area_construida: 200.00,
        quartos: 3,
        banheiros: 2,
        vagas_garagem: 2,
        valor_aluguel: 2500.00,
        valor_condominio: 300.00,
        iptu: 150.00,
        disponivel: true,
        observacoes: 'Imóvel recém reformado'
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate minimal required fields', () => {
      // Arrange
      const minimalData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 1500.00
      }

      // Act
      const result = imovelSchema.safeParse(minimalData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.disponivel).toBe(true) // default value
      }
    })

    it('should validate when area_construida equals area_total (RN-005 boundary)', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 200.00,
        area_construida: 200.00, // Equal is valid
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should validate when area_construida is less than area_total (RN-005)', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 300.00,
        area_construida: 250.00,
        valor_aluguel: 2500.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })
  })

  // ========================================================================
  // SAD PATH - Area validation (RN-005)
  // ========================================================================
  describe('Area validation (RN-005)', () => {
    it('should reject when area_construida is greater than area_total', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 200.00,
        area_construida: 250.00, // Greater than total
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Área construída não pode ser maior que área total')
        expect(result.error.issues[0].path).toContain('area_construida')
      }
    })

    it('should reject negative area_total', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: -100.00,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        const areaError = result.error.issues.find(e => e.path.includes('area_total'))
        expect(areaError?.message).toBe('Área total deve ser positiva')
      }
    })

    it('should reject negative area_construida', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_construida: -50.00,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject zero area_total', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 0,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // MONETARY VALUES - Non-negative validation (RN-007)
  // ========================================================================
  describe('Monetary values validation (RN-007)', () => {
    it('should accept positive valor_aluguel', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2500.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative valor_aluguel (RN-007)', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: -500.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor do aluguel é obrigatório')
      }
    })

    it('should reject zero valor_aluguel', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 0
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should accept zero valor_condominio (optional, non-negative)', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00,
        valor_condominio: 0
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative valor_condominio (RN-007)', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00,
        valor_condominio: -100.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Valor do condomínio deve ser positivo')
      }
    })

    it('should accept zero iptu (optional, non-negative)', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00,
        iptu: 0
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative iptu (RN-007)', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00,
        iptu: -50.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('IPTU deve ser positivo')
      }
    })
  })

  // ========================================================================
  // ROOM/FACILITY COUNTS - Non-negative validation
  // ========================================================================
  describe('Room and facility counts validation', () => {
    it('should accept zero quartos', () => {
      // Arrange - Studio apartment
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        quartos: 0,
        valor_aluguel: 1500.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should reject negative quartos', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        quartos: -1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Quartos deve ser positivo')
      }
    })

    it('should reject negative banheiros', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        banheiros: -1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Banheiros deve ser positivo')
      }
    })

    it('should reject negative vagas_garagem', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        vagas_garagem: -2,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Vagas deve ser positivo')
      }
    })
  })

  // ========================================================================
  // REQUIRED FIELDS VALIDATION
  // ========================================================================
  describe('Required fields validation', () => {
    it('should reject missing endereco_id', () => {
      // Arrange
      const invalidData = {
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing locador_id', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing tipo_imovel_id', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })

    it('should reject missing valor_aluguel', () => {
      // Arrange
      const invalidData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1
      }

      // Act
      const result = imovelSchema.safeParse(invalidData)

      // Assert
      expect(result.success).toBe(false)
    })
  })

  // ========================================================================
  // DEFAULT VALUES
  // ========================================================================
  describe('Default values', () => {
    it('should set disponivel to true by default', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.disponivel).toBe(true)
      }
    })

    it('should allow overriding disponivel default', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        valor_aluguel: 2000.00,
        disponivel: false
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.disponivel).toBe(false)
      }
    })
  })

  // ========================================================================
  // EDGE CASES
  // ========================================================================
  describe('Edge cases', () => {
    it('should handle very large areas', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 10000.00,
        area_construida: 8000.00,
        valor_aluguel: 50000.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should handle very large number of rooms', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        quartos: 20,
        banheiros: 15,
        vagas_garagem: 10,
        valor_aluguel: 100000.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should handle decimal values for areas', () => {
      // Arrange
      const validData = {
        endereco_id: 1,
        locador_id: 1,
        tipo_imovel_id: 1,
        area_total: 250.75,
        area_construida: 200.50,
        valor_aluguel: 2500.00
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
    })

    it('should coerce string numbers to numbers', () => {
      // Arrange
      const validData = {
        endereco_id: '1',
        locador_id: '1',
        tipo_imovel_id: '1',
        valor_aluguel: '2000.00',
        quartos: '3',
        banheiros: '2'
      }

      // Act
      const result = imovelSchema.safeParse(validData)

      // Assert
      expect(result.success).toBe(true)
      if (result.success) {
        expect(typeof result.data.endereco_id).toBe('number')
        expect(typeof result.data.valor_aluguel).toBe('number')
      }
    })
  })
})
