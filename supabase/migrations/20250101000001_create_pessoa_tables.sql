-- ============================================================================
-- Migration: Create Pessoa and Related Tables
-- Description: Creates pessoa and role tables (locador, locatario, fiador)
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- ============================================================================
-- TABLE: pessoa
-- Description: Pessoas físicas (podem ser locadores, locatários ou fiadores)
-- ============================================================================
CREATE TABLE pessoa (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    data_nascimento DATE,
    cpf CHAR(11) UNIQUE,
    rg VARCHAR(20),
    profissao_id BIGINT,
    endereco_id BIGINT,
    email VARCHAR(255),
    telefone VARCHAR(20),
    data_registro DATE NOT NULL DEFAULT CURRENT_DATE,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_pessoa_profissao FOREIGN KEY (profissao_id)
        REFERENCES profissao(id) ON DELETE RESTRICT,
    CONSTRAINT fk_pessoa_endereco FOREIGN KEY (endereco_id)
        REFERENCES endereco(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT pessoa_nome_not_empty CHECK (LENGTH(TRIM(nome)) > 0),
    CONSTRAINT pessoa_cpf_format CHECK (cpf IS NULL OR cpf ~ '^[0-9]{11}$'),
    CONSTRAINT pessoa_email_format CHECK (email IS NULL OR email ~ '^[^@]+@[^@]+\.[^@]+$'),
    CONSTRAINT pessoa_data_nascimento_valid CHECK (
        data_nascimento IS NULL OR
        (data_nascimento <= CURRENT_DATE AND data_nascimento >= '1900-01-01')
    ),
    CONSTRAINT pessoa_data_registro_valid CHECK (data_registro >= '2000-01-01')
);

-- Índices
CREATE UNIQUE INDEX idx_pessoa_cpf_unique ON pessoa(cpf) WHERE cpf IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_pessoa_nome ON pessoa(nome);
CREATE INDEX idx_pessoa_email ON pessoa(email);
CREATE INDEX idx_pessoa_telefone ON pessoa(telefone);
CREATE INDEX idx_pessoa_profissao_id ON pessoa(profissao_id);
CREATE INDEX idx_pessoa_endereco_id ON pessoa(endereco_id);
CREATE INDEX idx_pessoa_deleted_at ON pessoa(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE pessoa IS 'Pessoas físicas do sistema (base para locadores, locatários e fiadores)';
COMMENT ON COLUMN pessoa.cpf IS 'CPF sem máscara (11 dígitos), único e opcional';
COMMENT ON COLUMN pessoa.rg IS 'RG com máscara variável por UF';
COMMENT ON COLUMN pessoa.telefone IS 'Telefone com DDD (formato E.164)';
COMMENT ON COLUMN pessoa.data_registro IS 'Data de registro da pessoa no sistema';

-- ============================================================================
-- TABLE: locador
-- Description: Pessoas que alugam imóveis (proprietários)
-- ============================================================================
CREATE TABLE locador (
    id BIGSERIAL PRIMARY KEY,
    pessoa_id BIGINT NOT NULL UNIQUE,
    tipo_pessoa VARCHAR(20) NOT NULL DEFAULT 'fisica',
    cnpj CHAR(14),
    razao_social VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_locador_pessoa FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT locador_tipo_pessoa_valid CHECK (tipo_pessoa IN ('fisica', 'juridica')),
    CONSTRAINT locador_cnpj_format CHECK (cnpj IS NULL OR cnpj ~ '^[0-9]{14}$'),
    CONSTRAINT locador_cnpj_required_when_juridica CHECK (
        tipo_pessoa = 'fisica' OR (tipo_pessoa = 'juridica' AND cnpj IS NOT NULL)
    )
);

-- Índices
CREATE INDEX idx_locador_pessoa_id ON locador(pessoa_id);
CREATE INDEX idx_locador_cnpj ON locador(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX idx_locador_deleted_at ON locador(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE locador IS 'Locadores (proprietários que alugam imóveis)';
COMMENT ON COLUMN locador.tipo_pessoa IS 'Tipo: fisica ou juridica';
COMMENT ON COLUMN locador.cnpj IS 'CNPJ sem máscara (14 dígitos), obrigatório para pessoa jurídica';

-- ============================================================================
-- TABLE: locatario
-- Description: Pessoas que alugam imóveis (inquilinos)
-- ============================================================================
CREATE TABLE locatario (
    id BIGSERIAL PRIMARY KEY,
    pessoa_id BIGINT NOT NULL UNIQUE,
    referencias TEXT,
    renda_mensal DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_locatario_pessoa FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT locatario_renda_mensal_positive CHECK (renda_mensal IS NULL OR renda_mensal >= 0)
);

-- Índices
CREATE INDEX idx_locatario_pessoa_id ON locatario(pessoa_id);
CREATE INDEX idx_locatario_deleted_at ON locatario(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE locatario IS 'Locatários (inquilinos que alugam imóveis)';
COMMENT ON COLUMN locatario.referencias IS 'Referências pessoais ou profissionais';
COMMENT ON COLUMN locatario.renda_mensal IS 'Renda mensal declarada';

-- ============================================================================
-- TABLE: fiador
-- Description: Pessoas que são fiadoras em contratos
-- ============================================================================
CREATE TABLE fiador (
    id BIGSERIAL PRIMARY KEY,
    pessoa_id BIGINT NOT NULL UNIQUE,
    patrimonio_estimado DECIMAL(12,2),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Foreign Keys
    CONSTRAINT fk_fiador_pessoa FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id) ON DELETE RESTRICT,

    -- Constraints
    CONSTRAINT fiador_patrimonio_positive CHECK (patrimonio_estimado IS NULL OR patrimonio_estimado >= 0)
);

-- Índices
CREATE INDEX idx_fiador_pessoa_id ON fiador(pessoa_id);
CREATE INDEX idx_fiador_deleted_at ON fiador(deleted_at) WHERE deleted_at IS NULL;

-- Comentários
COMMENT ON TABLE fiador IS 'Fiadores de contratos de locação';
COMMENT ON COLUMN fiador.patrimonio_estimado IS 'Patrimônio estimado do fiador';

-- ============================================================================
-- TRIGGERS: updated_at automation
-- ============================================================================
CREATE TRIGGER update_pessoa_updated_at BEFORE UPDATE ON pessoa
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locador_updated_at BEFORE UPDATE ON locador
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locatario_updated_at BEFORE UPDATE ON locatario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fiador_updated_at BEFORE UPDATE ON fiador
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS: Helper functions for pessoa
-- ============================================================================

-- Function to normalize CPF (remove formatting)
CREATE OR REPLACE FUNCTION normalize_cpf()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cpf IS NOT NULL THEN
        NEW.cpf = REGEXP_REPLACE(NEW.cpf, '[^0-9]', '', 'g');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_pessoa_cpf BEFORE INSERT OR UPDATE ON pessoa
    FOR EACH ROW EXECUTE FUNCTION normalize_cpf();

-- Function to format CPF for display
CREATE OR REPLACE FUNCTION format_cpf(cpf_input CHAR(11))
RETURNS VARCHAR(14) AS $$
BEGIN
    IF cpf_input IS NULL OR LENGTH(cpf_input) != 11 THEN
        RETURN cpf_input;
    END IF;
    RETURN SUBSTRING(cpf_input FROM 1 FOR 3) || '.' ||
           SUBSTRING(cpf_input FROM 4 FOR 3) || '.' ||
           SUBSTRING(cpf_input FROM 7 FOR 3) || '-' ||
           SUBSTRING(cpf_input FROM 10 FOR 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate CPF algorithm
CREATE OR REPLACE FUNCTION validate_cpf(cpf_input CHAR(11))
RETURNS BOOLEAN AS $$
DECLARE
    v_cpf VARCHAR(11);
    v_sum INTEGER;
    v_digit1 INTEGER;
    v_digit2 INTEGER;
    i INTEGER;
BEGIN
    -- Normalize input
    v_cpf := REGEXP_REPLACE(cpf_input, '[^0-9]', '', 'g');

    -- Check length
    IF LENGTH(v_cpf) != 11 THEN
        RETURN FALSE;
    END IF;

    -- Check for known invalid patterns
    IF v_cpf ~ '^(.)\1{10}$' THEN
        RETURN FALSE;
    END IF;

    -- Calculate first digit
    v_sum := 0;
    FOR i IN 1..9 LOOP
        v_sum := v_sum + (SUBSTRING(v_cpf FROM i FOR 1)::INTEGER * (11 - i));
    END LOOP;
    v_digit1 := 11 - (v_sum % 11);
    IF v_digit1 >= 10 THEN
        v_digit1 := 0;
    END IF;

    -- Calculate second digit
    v_sum := 0;
    FOR i IN 1..10 LOOP
        v_sum := v_sum + (SUBSTRING(v_cpf FROM i FOR 1)::INTEGER * (12 - i));
    END LOOP;
    v_digit2 := 11 - (v_sum % 11);
    IF v_digit2 >= 10 THEN
        v_digit2 := 0;
    END IF;

    -- Validate
    RETURN (SUBSTRING(v_cpf FROM 10 FOR 1)::INTEGER = v_digit1) AND
           (SUBSTRING(v_cpf FROM 11 FOR 1)::INTEGER = v_digit2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
