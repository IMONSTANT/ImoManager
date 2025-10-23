-- ============================================================================
-- Migration: Complete Fix for Contrato Triggers
-- Description: Remove ALL triggers and recreate properly
-- Date: 2025-10-24
-- ============================================================================

-- 1. DIAGNÓSTICO: Listar todos os triggers antes de remover
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    RAISE NOTICE 'Triggers existentes em contrato_locacao:';
    FOR trigger_rec IN
        SELECT trigger_name, action_statement
        FROM information_schema.triggers
        WHERE event_object_table = 'contrato_locacao'
    LOOP
        RAISE NOTICE 'Trigger: %, Action: %', trigger_rec.trigger_name, trigger_rec.action_statement;
    END LOOP;
END $$;

-- 2. REMOVER TODOS os triggers da tabela contrato_locacao
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    FOR trigger_rec IN
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_table = 'contrato_locacao'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_rec.trigger_name || ' ON contrato_locacao';
        RAISE NOTICE 'Removido trigger: %', trigger_rec.trigger_name;
    END LOOP;
END $$;

-- 3. Criar função NOVA específica para contrato_locacao
-- (com nome único para evitar conflitos)
DROP FUNCTION IF EXISTS update_contrato_locacao_timestamp() CASCADE;
DROP FUNCTION IF EXISTS contrato_locacao_update_timestamp() CASCADE;

CREATE OR REPLACE FUNCTION contrato_locacao_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Explicitamente atualiza o campo atualizado_em
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Criar APENAS o trigger de atualização de timestamp
CREATE TRIGGER contrato_locacao_timestamp_trigger
    BEFORE UPDATE ON contrato_locacao
    FOR EACH ROW
    EXECUTE FUNCTION contrato_locacao_update_timestamp();

-- 5. Verificar e recriar outros triggers importantes
-- Generate numero_contrato
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

-- 6. Validação final
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers
    WHERE event_object_table = 'contrato_locacao';

    RAISE NOTICE 'Total de triggers em contrato_locacao após correção: %', trigger_count;

    -- Verificar se as colunas corretas existem
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'contrato_locacao'
        AND column_name = 'atualizado_em'
    ) THEN
        RAISE NOTICE 'Coluna atualizado_em existe ✓';
    ELSE
        RAISE WARNING 'Coluna atualizado_em NÃO existe!';
    END IF;
END $$;

COMMENT ON FUNCTION contrato_locacao_update_timestamp IS 'Função específica para atualizar timestamp em contrato_locacao - corrige o erro de campo atualizado_em';