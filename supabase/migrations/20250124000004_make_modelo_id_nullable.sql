-- =====================================================
-- MIGRATION: Tornar modelo_id nullable em documento_instancia
-- =====================================================
-- Como os templates agora estão hardcoded no código,
-- não precisamos mais de modelo_id obrigatório
-- =====================================================

ALTER TABLE documento_instancia
ALTER COLUMN modelo_id DROP NOT NULL;

-- Adiciona comentário explicando
COMMENT ON COLUMN documento_instancia.modelo_id IS 'ID do modelo (nullable porque templates podem estar hardcoded no código)';
