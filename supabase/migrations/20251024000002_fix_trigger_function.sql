-- ============================================================================
-- Migration: Fix Trigger Function for Contrato
-- Description: Remove trigger e cria função correta para atualizado_em
-- Date: 2025-10-24
-- ============================================================================

-- Remove trigger da tabela contrato_locacao
DROP TRIGGER IF EXISTS update_contrato_locacao_updated_at ON contrato_locacao;

-- Cria função específica que atualiza atualizado_em
CREATE OR REPLACE FUNCTION update_contrato_locacao_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recria o trigger usando a função específica
CREATE TRIGGER update_contrato_locacao_updated_at
    BEFORE UPDATE ON contrato_locacao
    FOR EACH ROW
    EXECUTE FUNCTION update_contrato_locacao_timestamp();

COMMENT ON FUNCTION update_contrato_locacao_timestamp IS 'Atualiza o campo atualizado_em na tabela contrato_locacao';
