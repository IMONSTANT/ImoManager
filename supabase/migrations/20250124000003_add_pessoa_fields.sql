-- ============================================================================
-- Migration: Add nacionalidade and estado_civil to pessoa
-- Description: Adiciona campos de nacionalidade e estado civil
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-24
-- ============================================================================

-- ============================================================================
-- Adiciona colunas à tabela pessoa
-- ============================================================================

ALTER TABLE pessoa
ADD COLUMN IF NOT EXISTS nacionalidade VARCHAR(50) DEFAULT 'brasileiro(a)',
ADD COLUMN IF NOT EXISTS estado_civil VARCHAR(20);

-- Comentários
COMMENT ON COLUMN pessoa.nacionalidade IS 'Nacionalidade da pessoa (ex: brasileiro(a), argentino(a))';
COMMENT ON COLUMN pessoa.estado_civil IS 'Estado civil da pessoa (solteiro(a), casado(a), divorciado(a), viúvo(a))';

-- Índice para melhorar buscas por estado civil
CREATE INDEX IF NOT EXISTS idx_pessoa_estado_civil ON pessoa(estado_civil) WHERE estado_civil IS NOT NULL;

-- ============================================================================
-- Atualiza dados existentes com valores padrão
-- ============================================================================

-- Desabilita temporariamente o trigger de updated_at para evitar erro
ALTER TABLE pessoa DISABLE TRIGGER update_pessoa_updated_at;

-- Define nacionalidade padrão para registros existentes
UPDATE pessoa
SET nacionalidade = 'brasileiro(a)'
WHERE nacionalidade IS NULL;

-- Reabilita o trigger de updated_at
ALTER TABLE pessoa ENABLE TRIGGER update_pessoa_updated_at;

-- ============================================================================
-- Constraint para validar estado_civil
-- ============================================================================

ALTER TABLE pessoa
ADD CONSTRAINT pessoa_estado_civil_valid
CHECK (estado_civil IS NULL OR estado_civil IN (
    'solteiro(a)',
    'casado(a)',
    'divorciado(a)',
    'viúvo(a)',
    'união estável',
    'separado(a)'
));
