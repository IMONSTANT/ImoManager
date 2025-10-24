-- ============================================================================
-- Migration: Fix Pessoa Table Triggers
-- Description: Corrige triggers da tabela pessoa para usar updated_at correto
-- Date: 2025-01-24
-- ============================================================================

-- Remove todos os triggers da tabela pessoa
DROP TRIGGER IF EXISTS update_pessoa_updated_at ON pessoa;
DROP TRIGGER IF EXISTS normalize_pessoa_cpf ON pessoa;

-- Recria a função update_updated_at_column se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recria o trigger de updated_at para pessoa
CREATE TRIGGER update_pessoa_updated_at
    BEFORE UPDATE ON pessoa
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recria o trigger de normalização de CPF
CREATE OR REPLACE FUNCTION normalize_cpf()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cpf IS NOT NULL THEN
        NEW.cpf = REGEXP_REPLACE(NEW.cpf, '[^0-9]', '', 'g');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER normalize_pessoa_cpf
    BEFORE INSERT OR UPDATE ON pessoa
    FOR EACH ROW
    EXECUTE FUNCTION normalize_cpf();

COMMENT ON TRIGGER update_pessoa_updated_at ON pessoa IS 'Atualiza automaticamente o campo updated_at';
COMMENT ON TRIGGER normalize_pessoa_cpf ON pessoa IS 'Remove formatação do CPF antes de salvar';
