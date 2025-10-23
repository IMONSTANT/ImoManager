-- ============================================================================
-- Migration: Create Imovel and Empresa Cliente Tables
-- Description: Creates tables for properties and client companies
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- ============================================================================
-- TABLE: imovel
-- Description: Imóveis disponíveis para locação
-- ============================================================================
CREATE TABLE imovel (
    id BIGSERIAL PRIMARY KEY,
    endereco_id BIGINT NOT NULL,
    locador_id BIGINT NOT NULL,
    tipo_imovel_id BIGINT NOT NULL,
    codigo_imovel VARCHAR(50) UNIQUE,
    descricao TEXT,
    area_total DECIMAL(10,2),
    area_construida DECIMAL(10,2),
    quartos INTEGER,
    banheiros INTEGER,
    vagas_garagem INTEGER,
    valor_aluguel DECIMAL(12,2) NOT NULL,
    valor_condominio DECIMAL(12,2),
    iptu DECIMAL(12,2),
    disponivel BOOLEAN NOT NULL DEFAULT TRUE,
    data_disponibilidade DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_imovel_endereco FOREIGN KEY (endereco_id)
        REFERENCES endereco(id) ON DELETE RESTRICT,
    CONSTRAINT fk_imovel_locador FOREIGN KEY (locador_id)
        REFERENCES locador(id) ON DELETE RESTRICT,
    CONSTRAINT fk_imovel_tipo_imovel FOREIGN KEY (tipo_imovel_id)
        REFERENCES tipo_imovel(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT imovel_valor_aluguel_positive CHECK (valor_aluguel >= 0),
    CONSTRAINT imovel_valor_condominio_positive CHECK (valor_condominio IS NULL OR valor_condominio >= 0),
    CONSTRAINT imovel_iptu_positive CHECK (iptu IS NULL OR iptu >= 0),
    CONSTRAINT imovel_area_total_positive CHECK (area_total IS NULL OR area_total > 0),
    CONSTRAINT imovel_area_construida_positive CHECK (area_construida IS NULL OR area_construida > 0),
    CONSTRAINT imovel_area_construida_lte_total CHECK (
        area_total IS NULL OR area_construida IS NULL OR area_construida <= area_total
    ),
    CONSTRAINT imovel_quartos_positive CHECK (quartos IS NULL OR quartos >= 0),
    CONSTRAINT imovel_banheiros_positive CHECK (banheiros IS NULL OR banheiros >= 0),
    CONSTRAINT imovel_vagas_garagem_positive CHECK (vagas_garagem IS NULL OR vagas_garagem >= 0)
);

-- Índices
CREATE UNIQUE INDEX idx_imovel_codigo_unique ON imovel(codigo_imovel) WHERE codigo_imovel IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_imovel_locador_id ON imovel(locador_id);
CREATE INDEX idx_imovel_tipo_imovel_id ON imovel(tipo_imovel_id);
CREATE INDEX idx_imovel_endereco_id ON imovel(endereco_id);
CREATE INDEX idx_imovel_valor_aluguel ON imovel(valor_aluguel);
CREATE INDEX idx_imovel_disponivel ON imovel(disponivel) WHERE disponivel = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_imovel_deleted_at ON imovel(deleted_at) WHERE deleted_at IS NULL;

-- Índices compostos para buscas complexas
CREATE INDEX idx_imovel_tipo_disponivel ON imovel(tipo_imovel_id, disponivel) WHERE deleted_at IS NULL;
CREATE INDEX idx_imovel_valor_quartos ON imovel(valor_aluguel, quartos) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE imovel IS 'Imóveis disponíveis para locação';
COMMENT ON COLUMN imovel.codigo_imovel IS 'Código único do imóvel para referência';
COMMENT ON COLUMN imovel.area_total IS 'Área total do terreno em m²';
COMMENT ON COLUMN imovel.area_construida IS 'Área construída em m²';
COMMENT ON COLUMN imovel.valor_aluguel IS 'Valor mensal do aluguel';
COMMENT ON COLUMN imovel.valor_condominio IS 'Valor mensal do condomínio (se aplicável)';
COMMENT ON COLUMN imovel.iptu IS 'Valor anual ou mensal do IPTU';
COMMENT ON COLUMN imovel.disponivel IS 'Indica se o imóvel está disponível para locação';

-- ============================================================================
-- TABLE: empresa_cliente
-- Description: Empresas clientes do sistema imobiliário
-- ============================================================================
CREATE TABLE empresa_cliente (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL,
    razao_social VARCHAR(255),
    nome_fantasia VARCHAR(255),
    cnpj CHAR(14) UNIQUE,
    inscricao_estadual VARCHAR(30),
    inscricao_municipal VARCHAR(30),
    endereco_id BIGINT NOT NULL,
    imovel_id BIGINT,
    email VARCHAR(255),
    telefone VARCHAR(20),
    contato_principal VARCHAR(120),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_empresa_cliente_endereco FOREIGN KEY (endereco_id)
        REFERENCES endereco(id) ON DELETE RESTRICT,
    CONSTRAINT fk_empresa_cliente_imovel FOREIGN KEY (imovel_id)
        REFERENCES imovel(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT empresa_cliente_descricao_not_empty CHECK (LENGTH(TRIM(descricao)) > 0),
    CONSTRAINT empresa_cliente_cnpj_format CHECK (cnpj IS NULL OR cnpj ~ '^[0-9]{14}$'),
    CONSTRAINT empresa_cliente_email_format CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$')
);

-- Índices
CREATE UNIQUE INDEX idx_empresa_cliente_cnpj_unique ON empresa_cliente(cnpj) WHERE cnpj IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_empresa_cliente_razao_social ON empresa_cliente(razao_social);
CREATE INDEX idx_empresa_cliente_nome_fantasia ON empresa_cliente(nome_fantasia);
CREATE INDEX idx_empresa_cliente_endereco_id ON empresa_cliente(endereco_id);
CREATE INDEX idx_empresa_cliente_imovel_id ON empresa_cliente(imovel_id);
CREATE INDEX idx_empresa_cliente_deleted_at ON empresa_cliente(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE empresa_cliente IS 'Empresas clientes do sistema imobiliário';
COMMENT ON COLUMN empresa_cliente.descricao IS 'Descrição ou nome de referência da empresa';
COMMENT ON COLUMN empresa_cliente.cnpj IS 'CNPJ sem máscara (14 dígitos)';
COMMENT ON COLUMN empresa_cliente.imovel_id IS 'Imóvel associado à empresa (opcional)';

-- ============================================================================
-- TRIGGERS: updated_at automation
-- ============================================================================
CREATE TRIGGER update_imovel_updated_at BEFORE UPDATE ON imovel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empresa_cliente_updated_at BEFORE UPDATE ON empresa_cliente
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Helper functions for imovel
-- ============================================================================

-- Function to generate codigo_imovel automatically
CREATE OR REPLACE FUNCTION generate_codigo_imovel()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo_imovel IS NULL THEN
        NEW.codigo_imovel := 'IMV' || LPAD(NEW.id::TEXT, 8, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_imovel_codigo BEFORE INSERT ON imovel
    FOR EACH ROW EXECUTE FUNCTION generate_codigo_imovel();

-- Function to update disponibilidade based on contracts
CREATE OR REPLACE FUNCTION update_imovel_disponibilidade()
RETURNS TRIGGER AS $$
BEGIN
    -- This will be implemented after contrato_locacao table is created
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to normalize CNPJ (remove formatting)
CREATE OR REPLACE FUNCTION normalize_cnpj()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cnpj IS NOT NULL THEN
        NEW.cnpj = REGEXP_REPLACE(NEW.cnpj, '[^0-9]', '', 'g');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_empresa_cliente_cnpj BEFORE INSERT OR UPDATE ON empresa_cliente
    FOR EACH ROW EXECUTE FUNCTION normalize_cnpj();

CREATE TRIGGER normalize_locador_cnpj BEFORE INSERT OR UPDATE ON locador
    FOR EACH ROW EXECUTE FUNCTION normalize_cnpj();

-- Function to format CNPJ for display
CREATE OR REPLACE FUNCTION format_cnpj(cnpj_input CHAR(14))
RETURNS VARCHAR(18) AS $$
BEGIN
    IF cnpj_input IS NULL OR LENGTH(cnpj_input) != 14 THEN
        RETURN cnpj_input;
    END IF;
    RETURN SUBSTRING(cnpj_input FROM 1 FOR 2) || '.' ||
           SUBSTRING(cnpj_input FROM 3 FOR 3) || '.' ||
           SUBSTRING(cnpj_input FROM 6 FOR 3) || '/' ||
           SUBSTRING(cnpj_input FROM 9 FOR 4) || '-' ||
           SUBSTRING(cnpj_input FROM 13 FOR 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to format CEP for display
CREATE OR REPLACE FUNCTION format_cep(cep_input CHAR(8))
RETURNS VARCHAR(10) AS $$
BEGIN
    IF cep_input IS NULL OR LENGTH(cep_input) != 8 THEN
        RETURN cep_input;
    END IF;
    RETURN SUBSTRING(cep_input FROM 1 FOR 5) || '-' ||
           SUBSTRING(cep_input FROM 6 FOR 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to normalize CEP (remove formatting)
CREATE OR REPLACE FUNCTION normalize_cep()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cep IS NOT NULL THEN
        NEW.cep = REGEXP_REPLACE(NEW.cep, '[^0-9]', '', 'g');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_endereco_cep BEFORE INSERT OR UPDATE ON endereco
    FOR EACH ROW EXECUTE FUNCTION normalize_cep();

-- ============================================================================
-- VIEWS: Useful views for queries
-- ============================================================================

-- View: Complete property information
CREATE OR REPLACE VIEW view_imoveis_completos AS
SELECT
    i.id,
    i.codigo_imovel,
    i.descricao,
    i.area_total,
    i.area_construida,
    i.quartos,
    i.banheiros,
    i.vagas_garagem,
    i.valor_aluguel,
    i.valor_condominio,
    i.iptu,
    i.disponivel,
    i.data_disponibilidade,
    -- Tipo do imóvel
    ti.descricao AS tipo_imovel,
    -- Endereço completo
    format_cep(e.cep) AS cep,
    e.logradouro,
    e.numero,
    e.complemento,
    e.bairro,
    e.cidade,
    e.uf,
    e.pais,
    -- Locador
    l.id AS locador_id,
    p.nome AS locador_nome,
    format_cpf(p.cpf) AS locador_cpf,
    p.telefone AS locador_telefone,
    p.email AS locador_email,
    -- Timestamps
    i.created_at,
    i.updated_at
FROM imovel i
INNER JOIN tipo_imovel ti ON i.tipo_imovel_id = ti.id
INNER JOIN endereco e ON i.endereco_id = e.id
INNER JOIN locador l ON i.locador_id = l.id
INNER JOIN pessoa p ON l.pessoa_id = p.id
WHERE i.deleted_at IS NULL
  AND ti.deleted_at IS NULL
  AND e.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND p.deleted_at IS NULL;

COMMENT ON VIEW view_imoveis_completos IS 'View com informações completas dos imóveis';
