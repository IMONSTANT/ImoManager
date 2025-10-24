-- ============================================================================
-- Migration: Add cpf_cnpj Computed Column to Pessoa
-- Description: Adiciona campo computado que retorna CPF (PF) ou CNPJ (PJ)
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-24
-- ============================================================================

-- ============================================================================
-- FUNÇÃO: get_cpf_cnpj
-- Retorna CPF se pessoa física ou CNPJ se pessoa jurídica (via locador)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_cpf_cnpj(p_pessoa_id BIGINT)
RETURNS VARCHAR(14) AS $$
DECLARE
    v_cpf CHAR(11);
    v_cnpj CHAR(14);
    v_tipo_pessoa VARCHAR(20);
BEGIN
    -- Busca CPF da pessoa
    SELECT cpf INTO v_cpf
    FROM pessoa
    WHERE id = p_pessoa_id;

    -- Verifica se é locador e se é pessoa jurídica
    SELECT l.cnpj, l.tipo_pessoa INTO v_cnpj, v_tipo_pessoa
    FROM locador l
    WHERE l.pessoa_id = p_pessoa_id;

    -- Se for pessoa jurídica e tiver CNPJ, retorna CNPJ
    IF v_tipo_pessoa = 'juridica' AND v_cnpj IS NOT NULL THEN
        RETURN v_cnpj;
    END IF;

    -- Caso contrário, retorna CPF
    RETURN v_cpf;
END;
$$ LANGUAGE plpgsql STABLE;

-- Comentário
COMMENT ON FUNCTION get_cpf_cnpj IS 'Retorna CPF para pessoa física ou CNPJ para pessoa jurídica';

-- ============================================================================
-- VIEW: pessoa_view
-- View com campo cpf_cnpj calculado automaticamente
-- ============================================================================
CREATE OR REPLACE VIEW pessoa_view AS
SELECT
    p.*,
    get_cpf_cnpj(p.id) as cpf_cnpj,
    l.tipo_pessoa,
    l.cnpj,
    l.razao_social
FROM pessoa p
LEFT JOIN locador l ON l.pessoa_id = p.id
WHERE p.deleted_at IS NULL;

-- Comentário
COMMENT ON VIEW pessoa_view IS 'View de pessoa com campo cpf_cnpj calculado (CPF para PF, CNPJ para PJ)';

-- ============================================================================
-- GRANT permissions (se necessário para RLS)
-- ============================================================================
-- GRANT SELECT ON pessoa_view TO authenticated;
