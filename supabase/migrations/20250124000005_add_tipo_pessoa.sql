-- ============================================================================
-- Migration: Add tipo column to pessoa table
-- Description: Adiciona coluna tipo para diferenciar PF (Pessoa Física) e PJ (Pessoa Jurídica)
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-24
-- ============================================================================

-- Adiciona coluna tipo à tabela pessoa
ALTER TABLE pessoa
ADD COLUMN IF NOT EXISTS tipo VARCHAR(2) DEFAULT 'PF';

-- Adiciona constraint para validar tipo
ALTER TABLE pessoa
ADD CONSTRAINT pessoa_tipo_valid
CHECK (tipo IN ('PF', 'PJ'));

-- Comentário
COMMENT ON COLUMN pessoa.tipo IS 'Tipo de pessoa: PF (Pessoa Física) ou PJ (Pessoa Jurídica)';

-- Índice para melhorar buscas por tipo
CREATE INDEX IF NOT EXISTS idx_pessoa_tipo ON pessoa(tipo);

-- ============================================================================
-- Atualiza dados existentes
-- ============================================================================

-- Desabilita temporariamente o trigger de updated_at
ALTER TABLE pessoa DISABLE TRIGGER update_pessoa_updated_at;

-- Define tipo padrão como PF para registros existentes
UPDATE pessoa
SET tipo = 'PF'
WHERE tipo IS NULL;

-- Reabilita o trigger de updated_at
ALTER TABLE pessoa ENABLE TRIGGER update_pessoa_updated_at;

-- ============================================================================
-- Ajusta constraint de CPF para ser opcional em PJ
-- ============================================================================

-- Remove constraint antiga se existir
ALTER TABLE pessoa DROP CONSTRAINT IF EXISTS pessoa_cpf_format;

-- Adiciona nova constraint que permite CPF vazio em PJ
ALTER TABLE pessoa
ADD CONSTRAINT pessoa_cpf_format
CHECK (
  cpf IS NULL OR
  cpf ~ '^[0-9]{11}$'
);

COMMENT ON CONSTRAINT pessoa_cpf_format ON pessoa IS 'CPF obrigatório para PF, opcional para PJ';
