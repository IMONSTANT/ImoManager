-- ============================================================================
-- Migration: Seed Reference Data
-- Description: Populates reference tables with initial data
-- Author: Sistema de Gestão Imobiliária
-- Date: 2025-01-01
-- ============================================================================

-- ============================================================================
-- SEED: tipo_imovel
-- ============================================================================
INSERT INTO tipo_imovel (descricao) VALUES
    ('Apartamento'),
    ('Casa'),
    ('Sobrado'),
    ('Cobertura'),
    ('Kitnet'),
    ('Studio'),
    ('Loft'),
    ('Sala Comercial'),
    ('Loja'),
    ('Galpão'),
    ('Terreno'),
    ('Chácara'),
    ('Sítio'),
    ('Fazenda'),
    ('Ponto Comercial'),
    ('Prédio Comercial'),
    ('Flat'),
    ('Edifício Comercial'),
    ('Barracão'),
    ('Box/Garagem')
ON CONFLICT (descricao) DO NOTHING;

-- ============================================================================
-- SEED: tipo_locacao
-- ============================================================================
INSERT INTO tipo_locacao (descricao) VALUES
    ('Residencial'),
    ('Comercial'),
    ('Industrial'),
    ('Temporada'),
    ('Co-working'),
    ('Misto (Comercial e Residencial)'),
    ('Depósito'),
    ('Estacionamento'),
    ('Rural'),
    ('Institucional')
ON CONFLICT (descricao) DO NOTHING;

-- ============================================================================
-- SEED: profissao
-- ============================================================================
INSERT INTO profissao (descricao) VALUES
    ('Advogado(a)'),
    ('Médico(a)'),
    ('Engenheiro(a)'),
    ('Arquiteto(a)'),
    ('Professor(a)'),
    ('Contador(a)'),
    ('Administrador(a)'),
    ('Empresário(a)'),
    ('Comerciante'),
    ('Autônomo(a)'),
    ('Funcionário Público'),
    ('Aposentado(a)'),
    ('Estudante'),
    ('Desenvolvedor(a)'),
    ('Designer'),
    ('Analista de Sistemas'),
    ('Vendedor(a)'),
    ('Gerente'),
    ('Diretor(a)'),
    ('Consultor(a)'),
    ('Farmacêutico(a)'),
    ('Dentista'),
    ('Enfermeiro(a)'),
    ('Fisioterapeuta'),
    ('Nutricionista'),
    ('Psicólogo(a)'),
    ('Veterinário(a)'),
    ('Jornalista'),
    ('Publicitário(a)'),
    ('Marketing'),
    ('Economista'),
    ('Mecânico(a)'),
    ('Eletricista'),
    ('Encanador(a)'),
    ('Pedreiro(a)'),
    ('Carpinteiro(a)'),
    ('Motorista'),
    ('Caminhoneiro(a)'),
    ('Taxista'),
    ('Uber/App'),
    ('Cozinheiro(a)'),
    ('Chef'),
    ('Garçom/Garçonete'),
    ('Recepcionista'),
    ('Secretário(a)'),
    ('Assistente Administrativo'),
    ('Auxiliar de Serviços Gerais'),
    ('Segurança'),
    ('Bombeiro(a)'),
    ('Policial'),
    ('Militar'),
    ('Do Lar'),
    ('Agricultor(a)'),
    ('Pecuarista'),
    ('Artista'),
    ('Músico(a)'),
    ('Ator/Atriz'),
    ('Atleta'),
    ('Personal Trainer'),
    ('Corretor(a) de Imóveis'),
    ('Corretor(a) de Seguros'),
    ('Bancário(a)'),
    ('Investidor(a)'),
    ('Outro')
ON CONFLICT (descricao) DO NOTHING;

-- ============================================================================
-- UPDATE: Sequence values to prevent conflicts
-- ============================================================================
-- Ensure sequences are set correctly after inserts
SELECT setval('tipo_imovel_id_seq', (SELECT MAX(id) FROM tipo_imovel));
SELECT setval('tipo_locacao_id_seq', (SELECT MAX(id) FROM tipo_locacao));
SELECT setval('profissao_id_seq', (SELECT MAX(id) FROM profissao));

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE tipo_imovel IS 'Seed completo com 20 tipos comuns de imóveis';
COMMENT ON TABLE tipo_locacao IS 'Seed com 10 tipos principais de locação';
COMMENT ON TABLE profissao IS 'Seed com 65+ profissões comuns no Brasil';
