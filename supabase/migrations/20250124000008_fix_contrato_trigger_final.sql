-- ============================================================================
-- Migration: Fix Contrato Trigger to use updated_at
-- Description: Remove all triggers using atualizado_em and use updated_at
-- Date: 2025-01-24
-- ============================================================================

-- Drop all existing triggers on contrato_locacao
DROP TRIGGER IF EXISTS contrato_locacao_timestamp_trigger ON contrato_locacao;
DROP TRIGGER IF EXISTS update_contrato_locacao_updated_at ON contrato_locacao;
DROP TRIGGER IF EXISTS generate_contrato_numero ON contrato_locacao;

-- Drop old functions
DROP FUNCTION IF EXISTS contrato_locacao_update_timestamp() CASCADE;
DROP FUNCTION IF EXISTS update_contrato_locacao_timestamp() CASCADE;

-- Recreate the trigger using the standard update_updated_at_column function
CREATE TRIGGER update_contrato_locacao_updated_at
    BEFORE UPDATE ON contrato_locacao
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recreate numero generation trigger
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

CREATE TRIGGER generate_contrato_numero
    BEFORE INSERT ON contrato_locacao
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_contrato();

COMMENT ON TRIGGER update_contrato_locacao_updated_at ON contrato_locacao IS 'Atualiza automaticamente o campo updated_at';
COMMENT ON TRIGGER generate_contrato_numero ON contrato_locacao IS 'Gera automaticamente o numero_contrato';
