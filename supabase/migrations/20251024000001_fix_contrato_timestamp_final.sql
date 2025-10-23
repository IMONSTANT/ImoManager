-- ============================================================================
-- Migration: Fix Contrato Timestamp Fields - FINAL
-- Description: Corrige campos de timestamp de forma robusta
-- Date: 2025-10-24
-- ============================================================================

DO $$
BEGIN
  -- Remove o trigger antigo
  DROP TRIGGER IF EXISTS update_contrato_locacao_updated_at ON contrato_locacao;

  -- Verifica se a coluna created_at existe e renomeia para criado_em
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'created_at'
  ) THEN
    -- Se criado_em já existe, remove created_at
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'contrato_locacao'
        AND column_name = 'criado_em'
    ) THEN
      ALTER TABLE contrato_locacao DROP COLUMN created_at;
    ELSE
      ALTER TABLE contrato_locacao RENAME COLUMN created_at TO criado_em;
    END IF;
  END IF;

  -- Verifica se a coluna updated_at existe e renomeia para atualizado_em
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'updated_at'
  ) THEN
    -- Se atualizado_em já existe, remove updated_at
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'contrato_locacao'
        AND column_name = 'atualizado_em'
    ) THEN
      ALTER TABLE contrato_locacao DROP COLUMN updated_at;
    ELSE
      ALTER TABLE contrato_locacao RENAME COLUMN updated_at TO atualizado_em;
    END IF;
  END IF;

  -- Adiciona as colunas se não existirem
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'criado_em'
  ) THEN
    ALTER TABLE contrato_locacao ADD COLUMN criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'contrato_locacao'
      AND column_name = 'atualizado_em'
  ) THEN
    ALTER TABLE contrato_locacao ADD COLUMN atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL;
  END IF;

END $$;

-- Recria o trigger com a função correta
CREATE TRIGGER update_contrato_locacao_updated_at
  BEFORE UPDATE ON contrato_locacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Atualiza comentários
COMMENT ON COLUMN contrato_locacao.criado_em IS 'Data e hora de criação do registro';
COMMENT ON COLUMN contrato_locacao.atualizado_em IS 'Data e hora da última atualização do registro';

-- Atualiza a view view_contratos_ativos
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
    -- Timestamps
    c.criado_em,
    c.atualizado_em
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
