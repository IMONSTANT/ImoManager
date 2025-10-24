-- ============================================================================
-- Migration: Revert Contrato Column Names to English
-- Description: Revert criado_em/atualizado_em back to created_at/updated_at
--              for consistency with all other tables in the system
-- Date: 2025-01-24
-- ============================================================================

DO $$
BEGIN
  -- Rename criado_em back to created_at
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'criado_em'
  ) THEN
    ALTER TABLE contrato_locacao RENAME COLUMN criado_em TO created_at;
  END IF;

  -- Rename atualizado_em back to updated_at
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'atualizado_em'
  ) THEN
    ALTER TABLE contrato_locacao RENAME COLUMN atualizado_em TO updated_at;
  END IF;
END $$;

-- Update comments
COMMENT ON COLUMN contrato_locacao.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN contrato_locacao.updated_at IS 'Data e hora da última atualização do registro';

-- Update the view to use English column names
DROP VIEW IF EXISTS view_contratos_ativos;

CREATE OR REPLACE VIEW view_contratos_ativos AS
SELECT
    c.id,
    c.numero_contrato,
    c.valor,
    c.caucao,
    c.data_inicio_contrato,
    c.data_fim_contrato,
    c.dia_vencimento,
    c.status,
    -- Imóvel
    i.codigo_imovel,
    i.descricao AS imovel_descricao,
    ti.descricao AS tipo_imovel,
    format_cep(e.cep) AS imovel_cep,
    e.logradouro || ', ' || e.numero || ' - ' || e.bairro AS imovel_endereco_completo,
    e.cidade AS imovel_cidade,
    -- Locatário
    ploc.nome AS locatario_nome,
    format_cpf(ploc.cpf) AS locatario_cpf,
    ploc.telefone AS locatario_telefone,
    ploc.email AS locatario_email,
    -- Locador
    plocador.nome AS locador_nome,
    format_cpf(plocador.cpf) AS locador_cpf,
    plocador.telefone AS locador_telefone,
    -- Fiador (opcional)
    pfiador.nome AS fiador_nome,
    format_cpf(pfiador.cpf) AS fiador_cpf,
    pfiador.telefone AS fiador_telefone,
    -- Tipo locação
    tl.descricao AS tipo_locacao,
    -- Timestamps (English names for consistency)
    c.created_at,
    c.updated_at
FROM contrato_locacao c
INNER JOIN imovel i ON c.imovel_id = i.id
INNER JOIN tipo_imovel ti ON i.tipo_imovel_id = ti.id
INNER JOIN endereco e ON i.endereco_id = e.id
INNER JOIN locador locador ON i.locador_id = locador.id
INNER JOIN pessoa plocador ON locador.pessoa_id = plocador.id
INNER JOIN locatario locatario ON c.locatario_id = locatario.id
INNER JOIN pessoa ploc ON locatario.pessoa_id = ploc.id
INNER JOIN tipo_locacao tl ON c.tipo_locacao_id = tl.id
LEFT JOIN fiador fiador ON c.fiador_id = fiador.id
LEFT JOIN pessoa pfiador ON fiador.pessoa_id = pfiador.id
WHERE c.status IN ('ativo', 'pendente')
  AND c.deleted_at IS NULL
  AND i.deleted_at IS NULL
  AND plocador.deleted_at IS NULL
  AND ploc.deleted_at IS NULL;

COMMENT ON VIEW view_contratos_ativos IS 'View com informações completas dos contratos ativos e pendentes';
