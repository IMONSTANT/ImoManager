-- ============================================================================
-- Migration: Add cpf_cnpj Column with Triggers
-- Description: Adiciona coluna cpf_cnpj mantida por triggers
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-24
-- ============================================================================

-- Remove a view anterior (se existir)
DROP VIEW IF EXISTS pessoa_view CASCADE;
DROP FUNCTION IF EXISTS get_cpf_cnpj(BIGINT);

-- ============================================================================
-- Adiciona coluna cpf_cnpj
-- ============================================================================

ALTER TABLE pessoa
ADD COLUMN IF NOT EXISTS cpf_cnpj VARCHAR(14);

-- Índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_pessoa_cpf_cnpj ON pessoa(cpf_cnpj) WHERE cpf_cnpj IS NOT NULL;

-- Comentário
COMMENT ON COLUMN pessoa.cpf_cnpj IS 'CPF (pessoa física) ou CNPJ (pessoa jurídica via locador) - atualizado por trigger';

-- ============================================================================
-- Função para atualizar cpf_cnpj
-- ============================================================================

CREATE OR REPLACE FUNCTION update_pessoa_cpf_cnpj()
RETURNS TRIGGER AS $$
DECLARE
    v_cnpj CHAR(14);
    v_tipo_pessoa VARCHAR(20);
BEGIN
    -- Verifica se é pessoa jurídica através da tabela locador
    SELECT cnpj, tipo_pessoa INTO v_cnpj, v_tipo_pessoa
    FROM locador
    WHERE pessoa_id = NEW.id AND tipo_pessoa = 'juridica'
    LIMIT 1;

    -- Se for PJ com CNPJ, usa CNPJ. Senão, usa CPF
    IF v_tipo_pessoa = 'juridica' AND v_cnpj IS NOT NULL THEN
        NEW.cpf_cnpj := v_cnpj;
    ELSE
        NEW.cpf_cnpj := NEW.cpf;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para pessoa (INSERT e UPDATE)
DROP TRIGGER IF EXISTS trigger_update_pessoa_cpf_cnpj ON pessoa;
CREATE TRIGGER trigger_update_pessoa_cpf_cnpj
    BEFORE INSERT OR UPDATE OF cpf ON pessoa
    FOR EACH ROW
    EXECUTE FUNCTION update_pessoa_cpf_cnpj();

-- ============================================================================
-- Função para atualizar cpf_cnpj quando locador muda
-- ============================================================================

CREATE OR REPLACE FUNCTION update_pessoa_cpf_cnpj_from_locador()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualiza a pessoa relacionada
    UPDATE pessoa
    SET cpf_cnpj = CASE
        WHEN NEW.tipo_pessoa = 'juridica' AND NEW.cnpj IS NOT NULL THEN NEW.cnpj
        ELSE (SELECT cpf FROM pessoa WHERE id = NEW.pessoa_id)
    END
    WHERE id = NEW.pessoa_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para locador (INSERT e UPDATE)
DROP TRIGGER IF EXISTS trigger_update_pessoa_from_locador ON locador;
CREATE TRIGGER trigger_update_pessoa_from_locador
    AFTER INSERT OR UPDATE OF cnpj, tipo_pessoa ON locador
    FOR EACH ROW
    EXECUTE FUNCTION update_pessoa_cpf_cnpj_from_locador();

-- ============================================================================
-- Popula dados existentes
-- ============================================================================

-- Desabilita temporariamente o trigger de updated_at para evitar erro
ALTER TABLE pessoa DISABLE TRIGGER update_pessoa_updated_at;

-- Atualiza todas as pessoas existentes
UPDATE pessoa p
SET cpf_cnpj = COALESCE(
    (SELECT cnpj FROM locador l WHERE l.pessoa_id = p.id AND l.tipo_pessoa = 'juridica' LIMIT 1),
    p.cpf
)
WHERE cpf_cnpj IS NULL OR cpf_cnpj != COALESCE(
    (SELECT cnpj FROM locador l WHERE l.pessoa_id = p.id AND l.tipo_pessoa = 'juridica' LIMIT 1),
    p.cpf
);

-- Reabilita o trigger de updated_at
ALTER TABLE pessoa ENABLE TRIGGER update_pessoa_updated_at;
