-- =====================================================
-- MIGRATION: CONTROLE OPERACIONAL
-- =====================================================
-- Tables: rescisao, vistoria, chave_movimentacao, pendencia
-- Correct order: vistoria first, then rescisao
-- =====================================================

-- Enums
CREATE TYPE rescisao_tipo_enum AS ENUM (
  'normal',
  'antecipada_locador',
  'antecipada_locatario',
  'judicial'
);

CREATE TYPE rescisao_status_enum AS ENUM (
  'solicitada',
  'em_analise',
  'aprovada',
  'concluida',
  'cancelada'
);

CREATE TYPE vistoria_tipo_enum AS ENUM (
  'entrada',
  'saida',
  'periodica',
  'manutencao'
);

CREATE TYPE vistoria_status_enum AS ENUM (
  'agendada',
  'realizada',
  'aprovada',
  'reprovada',
  'cancelada'
);

CREATE TYPE chave_movimentacao_tipo_enum AS ENUM (
  'entrega',
  'devolucao',
  'copia',
  'perda',
  'reposicao'
);

CREATE TYPE pendencia_tipo_enum AS ENUM (
  'financeira',
  'documental',
  'manutencao',
  'entrega',
  'contratual',
  'outro'
);

CREATE TYPE pendencia_status_enum AS ENUM (
  'aberta',
  'em_andamento',
  'resolvida',
  'cancelada'
);

-- =====================================================
-- TABLE: vistoria (FIRST - no dependencies)
-- =====================================================
CREATE TABLE vistoria (
  id BIGSERIAL PRIMARY KEY,
  contrato_id BIGINT NOT NULL REFERENCES contrato_locacao(id) ON DELETE RESTRICT,
  imovel_id BIGINT NOT NULL REFERENCES imovel(id) ON DELETE RESTRICT,

  tipo vistoria_tipo_enum NOT NULL,
  status vistoria_status_enum NOT NULL DEFAULT 'agendada',

  data_agendada TIMESTAMPTZ NOT NULL,
  data_realizada TIMESTAMPTZ,

  vistoriador_id UUID REFERENCES auth.users(id),
  vistoriador_nome VARCHAR(200),

  locatario_presente BOOLEAN DEFAULT false,
  locador_presente BOOLEAN DEFAULT false,

  observacoes_gerais TEXT,
  fotos JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,

  aprovada BOOLEAN,
  motivo_reprovacao TEXT,

  tem_pendencias BOOLEAN DEFAULT false,

  termo_vistoria_id BIGINT REFERENCES documento_instancia(id),

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (
    (status = 'realizada' AND data_realizada IS NOT NULL) OR
    status != 'realizada'
  )
);

-- =====================================================
-- TABLE: rescisao (SECOND - depends on vistoria)
-- =====================================================
CREATE TABLE rescisao (
  id BIGSERIAL PRIMARY KEY,
  contrato_id BIGINT NOT NULL REFERENCES contrato_locacao(id) ON DELETE RESTRICT,

  tipo rescisao_tipo_enum NOT NULL,
  status rescisao_status_enum NOT NULL DEFAULT 'solicitada',

  data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_desejada_saida DATE NOT NULL,
  data_efetiva_saida DATE,

  solicitado_por VARCHAR(50) NOT NULL,

  motivo TEXT NOT NULL,
  observacoes TEXT,

  tem_multa BOOLEAN NOT NULL DEFAULT false,
  valor_multa NUMERIC(14,2) DEFAULT 0 CHECK (valor_multa >= 0),
  multa_paga BOOLEAN DEFAULT false,

  vistoria_saida_id BIGINT REFERENCES vistoria(id),
  vistoria_aprovada BOOLEAN,

  chaves_devolvidas BOOLEAN DEFAULT false,
  data_devolucao_chaves DATE,

  tem_pendencias BOOLEAN DEFAULT false,
  pendencias_resolvidas BOOLEAN DEFAULT false,

  termo_rescisao_id BIGINT REFERENCES documento_instancia(id),

  responsavel_id UUID REFERENCES auth.users(id),

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  concluido_em TIMESTAMPTZ,

  CHECK (data_desejada_saida >= data_solicitacao),
  CHECK (
    (status = 'concluida' AND concluido_em IS NOT NULL) OR
    status != 'concluida'
  )
);

-- =====================================================
-- TABLE: chave_movimentacao (THIRD - independent)
-- =====================================================
CREATE TABLE chave_movimentacao (
  id BIGSERIAL PRIMARY KEY,
  contrato_id BIGINT NOT NULL REFERENCES contrato_locacao(id) ON DELETE RESTRICT,
  imovel_id BIGINT NOT NULL REFERENCES imovel(id) ON DELETE RESTRICT,

  tipo chave_movimentacao_tipo_enum NOT NULL,

  data_movimentacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  quantidade_chaves INTEGER NOT NULL DEFAULT 1 CHECK (quantidade_chaves > 0),

  descricao_chaves TEXT,
  numero_copia INTEGER,

  pessoa_nome VARCHAR(200) NOT NULL,
  pessoa_cpf VARCHAR(14),
  pessoa_tipo VARCHAR(50),

  comprovante_storage_path TEXT,
  assinatura_digital TEXT,

  observacoes TEXT,
  condicao_chaves TEXT,

  responsavel_id UUID REFERENCES auth.users(id),

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- TABLE: pendencia (FOURTH - depends on vistoria and rescisao)
-- =====================================================
CREATE TABLE pendencia (
  id BIGSERIAL PRIMARY KEY,

  contrato_id BIGINT REFERENCES contrato_locacao(id) ON DELETE CASCADE,
  imovel_id BIGINT REFERENCES imovel(id) ON DELETE CASCADE,
  vistoria_id BIGINT REFERENCES vistoria(id) ON DELETE CASCADE,
  rescisao_id BIGINT REFERENCES rescisao(id) ON DELETE CASCADE,

  tipo pendencia_tipo_enum NOT NULL,
  status pendencia_status_enum NOT NULL DEFAULT 'aberta',

  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,

  prioridade INTEGER NOT NULL DEFAULT 2 CHECK (prioridade BETWEEN 1 AND 5),

  data_limite DATE,

  valor_estimado NUMERIC(14,2) CHECK (valor_estimado >= 0),
  valor_real NUMERIC(14,2) CHECK (valor_real >= 0),

  responsavel_id UUID REFERENCES auth.users(id),

  data_resolucao TIMESTAMPTZ,
  solucao TEXT,
  comprovante_storage_path TEXT,

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (
    contrato_id IS NOT NULL OR
    imovel_id IS NOT NULL OR
    vistoria_id IS NOT NULL OR
    rescisao_id IS NOT NULL
  ),
  CHECK (
    (status = 'resolvida' AND data_resolucao IS NOT NULL) OR
    status != 'resolvida'
  )
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_vistoria_contrato ON vistoria(contrato_id);
CREATE INDEX idx_vistoria_imovel ON vistoria(imovel_id);
CREATE INDEX idx_vistoria_tipo ON vistoria(tipo);
CREATE INDEX idx_vistoria_status ON vistoria(status);
CREATE INDEX idx_vistoria_data_agendada ON vistoria(data_agendada);

CREATE INDEX idx_rescisao_contrato ON rescisao(contrato_id);
CREATE INDEX idx_rescisao_status ON rescisao(status);
CREATE INDEX idx_rescisao_tipo ON rescisao(tipo);
CREATE INDEX idx_rescisao_data_solicitacao ON rescisao(data_solicitacao);
CREATE INDEX idx_rescisao_pendentes ON rescisao(status, tem_pendencias)
  WHERE status IN ('solicitada', 'em_analise', 'aprovada');

CREATE INDEX idx_chave_contrato ON chave_movimentacao(contrato_id);
CREATE INDEX idx_chave_imovel ON chave_movimentacao(imovel_id);
CREATE INDEX idx_chave_tipo ON chave_movimentacao(tipo);
CREATE INDEX idx_chave_data ON chave_movimentacao(data_movimentacao);

CREATE INDEX idx_pendencia_contrato ON pendencia(contrato_id);
CREATE INDEX idx_pendencia_imovel ON pendencia(imovel_id);
CREATE INDEX idx_pendencia_vistoria ON pendencia(vistoria_id);
CREATE INDEX idx_pendencia_rescisao ON pendencia(rescisao_id);
CREATE INDEX idx_pendencia_status ON pendencia(status);
CREATE INDEX idx_pendencia_tipo ON pendencia(tipo);
CREATE INDEX idx_pendencia_prioridade ON pendencia(prioridade);
CREATE INDEX idx_pendencia_abertas ON pendencia(status, prioridade)
  WHERE status IN ('aberta', 'em_andamento');

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_rescisao_updated_at
  BEFORE UPDATE ON rescisao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vistoria_updated_at
  BEFORE UPDATE ON vistoria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pendencia_updated_at
  BEFORE UPDATE ON pendencia
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION validar_rescisao()
RETURNS TRIGGER AS $$
DECLARE
  v_status_contrato VARCHAR;
BEGIN
  SELECT status INTO v_status_contrato
  FROM contrato_locacao
  WHERE id = NEW.contrato_id;

  IF v_status_contrato = 'rescindido' THEN
    RAISE EXCEPTION 'Contrato ja esta rescindido';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_rescisao
  BEFORE INSERT ON rescisao
  FOR EACH ROW EXECUTE FUNCTION validar_rescisao();

CREATE OR REPLACE FUNCTION atualizar_contrato_ao_rescindir()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'concluida' AND OLD.status != 'concluida' THEN
    UPDATE contrato_locacao
    SET status = 'rescindido'
    WHERE id = NEW.contrato_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_contrato_rescisao
  AFTER UPDATE ON rescisao
  FOR EACH ROW
  WHEN (NEW.status = 'concluida')
  EXECUTE FUNCTION atualizar_contrato_ao_rescindir();

CREATE OR REPLACE FUNCTION criar_pendencias_vistoria()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.aprovada = false AND OLD.aprovada IS DISTINCT FROM false THEN
    UPDATE vistoria
    SET tem_pendencias = true
    WHERE id = NEW.id;

    IF NEW.motivo_reprovacao IS NOT NULL THEN
      INSERT INTO pendencia (
        vistoria_id,
        imovel_id,
        contrato_id,
        tipo,
        titulo,
        descricao,
        prioridade
      ) VALUES (
        NEW.id,
        NEW.imovel_id,
        NEW.contrato_id,
        'manutencao',
        'Pendencias da Vistoria',
        NEW.motivo_reprovacao,
        4
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_criar_pendencias_vistoria
  AFTER UPDATE ON vistoria
  FOR EACH ROW
  WHEN (NEW.aprovada = false)
  EXECUTE FUNCTION criar_pendencias_vistoria();

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE rescisao ENABLE ROW LEVEL SECURITY;
ALTER TABLE vistoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE chave_movimentacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendencia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios autenticados podem ler rescisoes"
  ON rescisao FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem criar rescisoes"
  ON rescisao FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados podem atualizar rescisoes"
  ON rescisao FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem ler vistorias"
  ON vistoria FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem criar vistorias"
  ON vistoria FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados podem atualizar vistorias"
  ON vistoria FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem ler movimentacoes de chaves"
  ON chave_movimentacao FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem registrar movimentacoes de chaves"
  ON chave_movimentacao FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados podem ler pendencias"
  ON pendencia FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuarios autenticados podem criar pendencias"
  ON pendencia FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados podem atualizar pendencias"
  ON pendencia FOR UPDATE
  TO authenticated
  USING (true);
