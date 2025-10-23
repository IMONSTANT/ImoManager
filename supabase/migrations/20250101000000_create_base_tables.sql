-- ============================================================================
-- Migration: Create Base Tables for Sistema Imobiliário
-- Description: Creates foundational tables (profissao, tipo_locacao, tipo_imovel, endereco)
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profissao
-- Description: Catálogo de profissões
-- ============================================================================
CREATE TABLE profissao (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT profissao_descricao_not_empty CHECK (LENGTH(TRIM(descricao)) > 0)
);

-- Índices
CREATE INDEX idx_profissao_descricao ON profissao(descricao);
CREATE INDEX idx_profissao_deleted_at ON profissao(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE profissao IS 'Catálogo de profissões para registro de pessoas';
COMMENT ON COLUMN profissao.descricao IS 'Nome da profissão';

-- ============================================================================
-- TABLE: tipo_locacao
-- Description: Tipos de locação (Residencial, Comercial, etc.)
-- ============================================================================
CREATE TABLE tipo_locacao (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(60) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT tipo_locacao_descricao_not_empty CHECK (LENGTH(TRIM(descricao)) > 0)
);

-- Índices
CREATE INDEX idx_tipo_locacao_descricao ON tipo_locacao(descricao);
CREATE INDEX idx_tipo_locacao_deleted_at ON tipo_locacao(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE tipo_locacao IS 'Tipos de locação disponíveis no sistema';
COMMENT ON COLUMN tipo_locacao.descricao IS 'Nome do tipo de locação';

-- ============================================================================
-- TABLE: tipo_imovel
-- Description: Tipos de imóveis (Apartamento, Casa, Sala Comercial, etc.)
-- ============================================================================
CREATE TABLE tipo_imovel (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(60) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT tipo_imovel_descricao_not_empty CHECK (LENGTH(TRIM(descricao)) > 0)
);

-- Índices
CREATE INDEX idx_tipo_imovel_descricao ON tipo_imovel(descricao);
CREATE INDEX idx_tipo_imovel_deleted_at ON tipo_imovel(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE tipo_imovel IS 'Tipos de imóveis disponíveis no sistema';
COMMENT ON COLUMN tipo_imovel.descricao IS 'Nome do tipo de imóvel';

-- ============================================================================
-- TABLE: endereco
-- Description: Endereços completos
-- ============================================================================
CREATE TABLE endereco (
    id BIGSERIAL PRIMARY KEY,
    cep CHAR(8) NOT NULL,
    logradouro VARCHAR(120) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(60),
    bairro VARCHAR(80) NOT NULL,
    cidade VARCHAR(80) NOT NULL DEFAULT 'Fortaleza',
    uf CHAR(2) NOT NULL DEFAULT 'CE',
    pais VARCHAR(60) NOT NULL DEFAULT 'Brasil',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT endereco_cep_format CHECK (cep ~ '^[0-9]{8}$'),
    CONSTRAINT endereco_uf_format CHECK (uf ~ '^[A-Z]{2}$'),
    CONSTRAINT endereco_logradouro_not_empty CHECK (LENGTH(TRIM(logradouro)) > 0),
    CONSTRAINT endereco_bairro_not_empty CHECK (LENGTH(TRIM(bairro)) > 0),
    CONSTRAINT endereco_cidade_not_empty CHECK (LENGTH(TRIM(cidade)) > 0)
);

-- Índices
CREATE INDEX idx_endereco_cep ON endereco(cep);
CREATE INDEX idx_endereco_cidade_uf ON endereco(cidade, uf);
CREATE INDEX idx_endereco_bairro ON endereco(bairro);
CREATE INDEX idx_endereco_deleted_at ON endereco(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE endereco IS 'Endereços completos utilizados por pessoas, imóveis e empresas';
COMMENT ON COLUMN endereco.cep IS 'CEP sem máscara (8 dígitos)';
COMMENT ON COLUMN endereco.numero IS 'Número do endereço (aceita valores como S/N, frações)';
COMMENT ON COLUMN endereco.uf IS 'Unidade Federativa (2 letras maiúsculas)';

-- ============================================================================
-- TRIGGER: updated_at automation
-- Description: Automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_profissao_updated_at BEFORE UPDATE ON profissao
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipo_locacao_updated_at BEFORE UPDATE ON tipo_locacao
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tipo_imovel_updated_at BEFORE UPDATE ON tipo_imovel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_endereco_updated_at BEFORE UPDATE ON endereco
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
