-- ============================================================================
-- Migration: Create Contrato Locacao Table
-- Description: Creates contract table with all relationships
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- ============================================================================
-- ENUM: Status do Contrato
-- ============================================================================
CREATE TYPE status_contrato AS ENUM (
    'ativo',
    'pendente',
    'encerrado',
    'cancelado',
    'renovado'
);

-- ============================================================================
-- TABLE: contrato_locacao
-- Description: Contratos de locação de imóveis
-- ============================================================================
CREATE TABLE contrato_locacao (
    id BIGSERIAL PRIMARY KEY,
    numero_contrato VARCHAR(50) UNIQUE,
    imovel_id BIGINT NOT NULL,
    locatario_id BIGINT NOT NULL,
    fiador_id BIGINT,
    tipo_locacao_id BIGINT NOT NULL,

    -- Valores financeiros
    valor DECIMAL(12,2) NOT NULL,
    caucao DECIMAL(12,2),
    valor_iptu DECIMAL(12,2),
    valor_condominio DECIMAL(12,2),

    -- Datas do contrato
    data_inicio_contrato DATE NOT NULL,
    data_fim_contrato DATE NOT NULL,
    data_vencimento_aluguel INTEGER NOT NULL DEFAULT 10,

    -- Reajustes
    indice_reajuste VARCHAR(20) DEFAULT 'IGPM',
    periodicidade_reajuste INTEGER DEFAULT 12,
    data_ultimo_reajuste DATE,

    -- Status e observações
    status status_contrato NOT NULL DEFAULT 'pendente',
    dia_vencimento INTEGER NOT NULL DEFAULT 10,
    observacoes TEXT,
    clausulas_especiais TEXT,

    -- Documentação
    contrato_assinado BOOLEAN DEFAULT FALSE,
    data_assinatura DATE,
    arquivo_contrato_url TEXT,

    -- Auditoria
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_contrato_imovel FOREIGN KEY (imovel_id)
        REFERENCES imovel(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_locatario FOREIGN KEY (locatario_id)
        REFERENCES locatario(id) ON DELETE RESTRICT,
    CONSTRAINT fk_contrato_fiador FOREIGN KEY (fiador_id)
        REFERENCES fiador(id) ON DELETE SET NULL,
    CONSTRAINT fk_contrato_tipo_locacao FOREIGN KEY (tipo_locacao_id)
        REFERENCES tipo_locacao(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT contrato_valor_positive CHECK (valor >= 0),
    CONSTRAINT contrato_caucao_positive CHECK (caucao IS NULL OR caucao >= 0),
    CONSTRAINT contrato_valor_iptu_positive CHECK (valor_iptu IS NULL OR valor_iptu >= 0),
    CONSTRAINT contrato_valor_condominio_positive CHECK (valor_condominio IS NULL OR valor_condominio >= 0),
    CONSTRAINT contrato_data_fim_after_inicio CHECK (data_fim_contrato > data_inicio_contrato),
    CONSTRAINT contrato_dia_vencimento_valid CHECK (dia_vencimento BETWEEN 1 AND 31),
    CONSTRAINT contrato_periodicidade_reajuste_valid CHECK (periodicidade_reajuste > 0),
    CONSTRAINT contrato_data_assinatura_valid CHECK (
        data_assinatura IS NULL OR data_assinatura <= data_inicio_contrato
    )
);

-- Índices
CREATE UNIQUE INDEX idx_contrato_numero_unique ON contrato_locacao(numero_contrato)
    WHERE numero_contrato IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_contrato_imovel_id ON contrato_locacao(imovel_id);
CREATE INDEX idx_contrato_locatario_id ON contrato_locacao(locatario_id);
CREATE INDEX idx_contrato_fiador_id ON contrato_locacao(fiador_id);
CREATE INDEX idx_contrato_tipo_locacao_id ON contrato_locacao(tipo_locacao_id);
CREATE INDEX idx_contrato_status ON contrato_locacao(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_contrato_data_inicio ON contrato_locacao(data_inicio_contrato);
CREATE INDEX idx_contrato_data_fim ON contrato_locacao(data_fim_contrato);
CREATE INDEX idx_contrato_deleted_at ON contrato_locacao(deleted_at) WHERE deleted_at IS NULL;

-- Índices compostos para queries complexas
CREATE INDEX idx_contrato_imovel_datas ON contrato_locacao(imovel_id, data_inicio_contrato, data_fim_contrato)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_contrato_status_datas ON contrato_locacao(status, data_inicio_contrato, data_fim_contrato)
    WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE contrato_locacao IS 'Contratos de locação de imóveis';
COMMENT ON COLUMN contrato_locacao.numero_contrato IS 'Número único do contrato';
COMMENT ON COLUMN contrato_locacao.valor IS 'Valor mensal do aluguel';
COMMENT ON COLUMN contrato_locacao.caucao IS 'Valor de caução/depósito (antigo campo calcao)';
COMMENT ON COLUMN contrato_locacao.data_vencimento_aluguel IS 'Dia do mês para vencimento do aluguel (1-31)';
COMMENT ON COLUMN contrato_locacao.indice_reajuste IS 'Índice de reajuste (IGPM, IPCA, etc.)';
COMMENT ON COLUMN contrato_locacao.periodicidade_reajuste IS 'Periodicidade de reajuste em meses';
COMMENT ON COLUMN contrato_locacao.status IS 'Status atual do contrato';

-- ============================================================================
-- TABLE: historico_reajuste
-- Description: Histórico de reajustes de contratos
-- ============================================================================
CREATE TABLE historico_reajuste (
    id BIGSERIAL PRIMARY KEY,
    contrato_locacao_id BIGINT NOT NULL,
    data_reajuste DATE NOT NULL,
    valor_anterior DECIMAL(12,2) NOT NULL,
    valor_novo DECIMAL(12,2) NOT NULL,
    percentual_reajuste DECIMAL(5,2) NOT NULL,
    indice_utilizado VARCHAR(20) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign Keys
    CONSTRAINT fk_historico_reajuste_contrato FOREIGN KEY (contrato_locacao_id)
        REFERENCES contrato_locacao(id) ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT historico_reajuste_valor_anterior_positive CHECK (valor_anterior >= 0),
    CONSTRAINT historico_reajuste_valor_novo_positive CHECK (valor_novo >= 0),
    CONSTRAINT historico_reajuste_valores_different CHECK (valor_novo != valor_anterior)
);

-- Índices
CREATE INDEX idx_historico_reajuste_contrato ON historico_reajuste(contrato_locacao_id);
CREATE INDEX idx_historico_reajuste_data ON historico_reajuste(data_reajuste);

COMMENT ON TABLE historico_reajuste IS 'Histórico de reajustes de valores de contratos';

-- ============================================================================
-- TRIGGERS: updated_at automation
-- ============================================================================
CREATE TRIGGER update_contrato_locacao_updated_at BEFORE UPDATE ON contrato_locacao
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Business logic for contracts
-- ============================================================================

-- Function to generate numero_contrato automatically
CREATE OR REPLACE FUNCTION generate_numero_contrato()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_contrato IS NULL THEN
        NEW.numero_contrato := 'CTR' || TO_CHAR(NEW.data_inicio_contrato, 'YYYY') ||
                               LPAD(NEW.id::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_contrato_numero BEFORE INSERT ON contrato_locacao
    FOR EACH ROW EXECUTE FUNCTION generate_numero_contrato();

-- Function to validate contract overlap for same property
CREATE OR REPLACE FUNCTION validate_contract_overlap()
RETURNS TRIGGER AS $$
DECLARE
    v_overlapping_contracts INTEGER;
BEGIN
    -- Check for overlapping active contracts on the same property
    SELECT COUNT(*)
    INTO v_overlapping_contracts
    FROM contrato_locacao
    WHERE imovel_id = NEW.imovel_id
      AND id != COALESCE(NEW.id, 0)
      AND status IN ('ativo', 'pendente')
      AND deleted_at IS NULL
      AND (
          (NEW.data_inicio_contrato BETWEEN data_inicio_contrato AND data_fim_contrato)
          OR (NEW.data_fim_contrato BETWEEN data_inicio_contrato AND data_fim_contrato)
          OR (data_inicio_contrato BETWEEN NEW.data_inicio_contrato AND NEW.data_fim_contrato)
      );

    IF v_overlapping_contracts > 0 THEN
        RAISE EXCEPTION 'Já existe um contrato ativo para este imóvel no período selecionado';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_contrato_overlap BEFORE INSERT OR UPDATE ON contrato_locacao
    FOR EACH ROW EXECUTE FUNCTION validate_contract_overlap();

-- Function to update imovel availability when contract status changes
CREATE OR REPLACE FUNCTION update_imovel_availability_on_contract()
RETURNS TRIGGER AS $$
BEGIN
    -- If contract becomes active, mark property as unavailable
    IF NEW.status = 'ativo' AND (TG_OP = 'INSERT' OR OLD.status != 'ativo') THEN
        UPDATE imovel
        SET disponivel = FALSE,
            data_disponibilidade = NEW.data_fim_contrato
        WHERE id = NEW.imovel_id;
    END IF;

    -- If contract ends or is cancelled, check if property should be available
    IF NEW.status IN ('encerrado', 'cancelado') AND (TG_OP = 'UPDATE' AND OLD.status = 'ativo') THEN
        -- Check if there are other active contracts
        IF NOT EXISTS (
            SELECT 1 FROM contrato_locacao
            WHERE imovel_id = NEW.imovel_id
              AND id != NEW.id
              AND status = 'ativo'
              AND deleted_at IS NULL
        ) THEN
            UPDATE imovel
            SET disponivel = TRUE,
                data_disponibilidade = CURRENT_DATE
            WHERE id = NEW.imovel_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_imovel_availability AFTER INSERT OR UPDATE ON contrato_locacao
    FOR EACH ROW EXECUTE FUNCTION update_imovel_availability_on_contract();

-- Function to automatically update contract status based on dates
CREATE OR REPLACE FUNCTION auto_update_contract_status()
RETURNS void AS $$
BEGIN
    -- Activate pending contracts whose start date has arrived
    UPDATE contrato_locacao
    SET status = 'ativo'
    WHERE status = 'pendente'
      AND data_inicio_contrato <= CURRENT_DATE
      AND deleted_at IS NULL;

    -- End contracts whose end date has passed
    UPDATE contrato_locacao
    SET status = 'encerrado'
    WHERE status = 'ativo'
      AND data_fim_contrato < CURRENT_DATE
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_update_contract_status IS 'Atualiza automaticamente o status dos contratos baseado nas datas';

-- ============================================================================
-- VIEWS: Useful views for contract queries
-- ============================================================================

-- View: Active contracts with complete information
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

-- View: Contracts expiring soon (next 60 days)
CREATE OR REPLACE VIEW view_contratos_vencendo AS
SELECT
    c.id,
    c.numero_contrato,
    c.data_fim_contrato,
    (c.data_fim_contrato - CURRENT_DATE) AS dias_restantes,
    i.codigo_imovel,
    ploc.nome AS locatario_nome,
    ploc.telefone AS locatario_telefone,
    c.valor
FROM contrato_locacao c
INNER JOIN imovel i ON c.imovel_id = i.id
INNER JOIN locatario locatario ON c.locatario_id = locatario.id
INNER JOIN pessoa ploc ON locatario.pessoa_id = ploc.id
WHERE c.status = 'ativo'
  AND c.data_fim_contrato BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
  AND c.deleted_at IS NULL
ORDER BY c.data_fim_contrato;

COMMENT ON VIEW view_contratos_vencendo IS 'Contratos que vencem nos próximos 60 dias';
