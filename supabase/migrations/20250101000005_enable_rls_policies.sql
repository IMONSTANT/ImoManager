-- ============================================================================
-- Migration: Enable RLS and Create Policies
-- Description: Row Level Security policies for multi-tenancy and access control
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- ============================================================================
-- ENABLE RLS on all tables
-- ============================================================================
ALTER TABLE profissao ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipo_locacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipo_imovel ENABLE ROW LEVEL SECURITY;
ALTER TABLE endereco ENABLE ROW LEVEL SECURITY;
ALTER TABLE pessoa ENABLE ROW LEVEL SECURITY;
ALTER TABLE locador ENABLE ROW LEVEL SECURITY;
ALTER TABLE locatario ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiador ENABLE ROW LEVEL SECURITY;
ALTER TABLE imovel ENABLE ROW LEVEL SECURITY;
ALTER TABLE empresa_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE contrato_locacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_reajuste ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: Reference Tables (Read-only for authenticated users)
-- ============================================================================

-- profissao: Everyone can read
CREATE POLICY "profissao_select_policy" ON profissao
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "profissao_all_policy" ON profissao
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- tipo_locacao: Everyone can read
CREATE POLICY "tipo_locacao_select_policy" ON tipo_locacao
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "tipo_locacao_all_policy" ON tipo_locacao
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- tipo_imovel: Everyone can read
CREATE POLICY "tipo_imovel_select_policy" ON tipo_imovel
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "tipo_imovel_all_policy" ON tipo_imovel
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- ============================================================================
-- POLICIES: endereco
-- ============================================================================
CREATE POLICY "endereco_select_policy" ON endereco
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "endereco_insert_policy" ON endereco
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "endereco_update_policy" ON endereco
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "endereco_delete_policy" ON endereco
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: pessoa
-- ============================================================================
CREATE POLICY "pessoa_select_policy" ON pessoa
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "pessoa_insert_policy" ON pessoa
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "pessoa_update_policy" ON pessoa
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "pessoa_delete_policy" ON pessoa
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: locador
-- ============================================================================
CREATE POLICY "locador_select_policy" ON locador
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "locador_insert_policy" ON locador
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "locador_update_policy" ON locador
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "locador_delete_policy" ON locador
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: locatario
-- ============================================================================
CREATE POLICY "locatario_select_policy" ON locatario
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "locatario_insert_policy" ON locatario
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "locatario_update_policy" ON locatario
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "locatario_delete_policy" ON locatario
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: fiador
-- ============================================================================
CREATE POLICY "fiador_select_policy" ON fiador
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "fiador_insert_policy" ON fiador
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "fiador_update_policy" ON fiador
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "fiador_delete_policy" ON fiador
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: imovel
-- ============================================================================
CREATE POLICY "imovel_select_policy" ON imovel
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "imovel_insert_policy" ON imovel
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "imovel_update_policy" ON imovel
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "imovel_delete_policy" ON imovel
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: empresa_cliente
-- ============================================================================
CREATE POLICY "empresa_cliente_select_policy" ON empresa_cliente
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "empresa_cliente_insert_policy" ON empresa_cliente
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "empresa_cliente_update_policy" ON empresa_cliente
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "empresa_cliente_delete_policy" ON empresa_cliente
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: contrato_locacao
-- ============================================================================
CREATE POLICY "contrato_locacao_select_policy" ON contrato_locacao
    FOR SELECT TO authenticated
    USING (deleted_at IS NULL);

CREATE POLICY "contrato_locacao_insert_policy" ON contrato_locacao
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "contrato_locacao_update_policy" ON contrato_locacao
    FOR UPDATE TO authenticated
    USING (deleted_at IS NULL)
    WITH CHECK (true);

CREATE POLICY "contrato_locacao_delete_policy" ON contrato_locacao
    FOR DELETE TO authenticated
    USING (true);

-- ============================================================================
-- POLICIES: historico_reajuste
-- ============================================================================
CREATE POLICY "historico_reajuste_select_policy" ON historico_reajuste
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "historico_reajuste_insert_policy" ON historico_reajuste
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- ============================================================================
-- GRANT permissions to authenticated users
-- ============================================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON POLICY "profissao_select_policy" ON profissao IS 'Allow all authenticated users to read profissoes';
COMMENT ON POLICY "pessoa_select_policy" ON pessoa IS 'Allow all authenticated users to read pessoas';
COMMENT ON POLICY "imovel_select_policy" ON imovel IS 'Allow all authenticated users to read imoveis';
COMMENT ON POLICY "contrato_locacao_select_policy" ON contrato_locacao IS 'Allow all authenticated users to read contratos';
