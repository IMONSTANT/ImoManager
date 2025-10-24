-- =====================================================
-- MIGRATION: MÓDULO DE DOCUMENTOS (D1-D10)
-- =====================================================
-- Tabelas para geração, versionamento e assinatura de documentos
-- Requisitos: SRS Seção 7.7 (Módulo de Documentos)
-- =====================================================

-- Enums
CREATE TYPE documento_tipo_enum AS ENUM (
  'D1',  -- Ficha Cadastro Locatário
  'D2',  -- Ficha Cadastro Fiador
  'D3',  -- Contrato Locação
  'D4',  -- Termo Vistoria Entrada
  'D5',  -- Termo Vistoria Saída
  'D6',  -- Autorização Débito Automático
  'D7',  -- Termo Entrega Chaves
  'D8',  -- Notificação Atraso
  'D9',  -- Notificação Rescisão
  'D10'  -- Recibo Pagamento
);

CREATE TYPE documento_status_enum AS ENUM (
  'rascunho',      -- Documento criado mas não finalizado
  'gerado',        -- PDF gerado, aguardando assinaturas
  'enviado',       -- Enviado para assinatura eletrônica
  'parcialmente_assinado',  -- Algumas assinaturas coletadas
  'assinado',      -- Todas assinaturas coletadas
  'cancelado',     -- Documento cancelado
  'expirado'       -- Prazo para assinatura expirado
);

CREATE TYPE assinatura_status_enum AS ENUM (
  'pendente',      -- Aguardando assinatura
  'assinado',      -- Assinado com sucesso
  'recusado',      -- Signatário recusou
  'expirado'       -- Prazo expirou
);

-- =====================================================
-- TABELA: documento_modelo
-- =====================================================
-- Armazena templates versionados de documentos
-- Usa Handlebars para interpolação de variáveis
-- =====================================================
CREATE TABLE documento_modelo (
  id BIGSERIAL PRIMARY KEY,
  tipo documento_tipo_enum NOT NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,

  -- Template em HTML/Handlebars
  template TEXT NOT NULL,

  -- Variáveis esperadas no template (JSON array)
  -- Ex: ["locatario.nome", "imovel.endereco", "contrato.valor"]
  variaveis_esperadas JSONB DEFAULT '[]'::jsonb,

  -- Versionamento
  versao INTEGER NOT NULL DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT true,
  data_vigencia_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vigencia_fim DATE,

  -- Metadados
  criado_por UUID REFERENCES auth.users(id),
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  UNIQUE(tipo, versao),
  CHECK (versao > 0),
  CHECK (data_vigencia_fim IS NULL OR data_vigencia_fim > data_vigencia_inicio)
);

-- =====================================================
-- TABELA: documento_instancia
-- =====================================================
-- Documentos gerados a partir de templates
-- Armazena o PDF final e metadados
-- =====================================================
CREATE TABLE documento_instancia (
  id BIGSERIAL PRIMARY KEY,
  modelo_id BIGINT NOT NULL REFERENCES documento_modelo(id) ON DELETE RESTRICT,

  -- Número único do documento (ex: "D3-2025-00042")
  numero_documento VARCHAR(50) NOT NULL UNIQUE,

  -- Tipo (denormalizado para performance)
  tipo documento_tipo_enum NOT NULL,
  status documento_status_enum NOT NULL DEFAULT 'rascunho',

  -- Relacionamentos opcionais (depende do tipo de documento)
  contrato_id BIGINT REFERENCES contrato_locacao(id) ON DELETE CASCADE,
  parcela_id BIGINT REFERENCES parcela(id) ON DELETE SET NULL,
  locatario_id BIGINT REFERENCES locatario(id) ON DELETE SET NULL,
  fiador_id BIGINT REFERENCES fiador(id) ON DELETE SET NULL,
  imovel_id BIGINT REFERENCES imovel(id) ON DELETE SET NULL,

  -- Dados interpolados no template (snapshot dos dados no momento da geração)
  dados_documento JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- HTML gerado após interpolação
  conteudo_html TEXT,

  -- PDF armazenado no Supabase Storage
  pdf_url TEXT,
  pdf_storage_path TEXT,

  -- Assinatura eletrônica
  requer_assinatura BOOLEAN NOT NULL DEFAULT false,
  prazo_assinatura_dias INTEGER DEFAULT 30,
  data_limite_assinatura DATE,

  -- Provider de assinatura (clicksign, docusign, etc)
  assinatura_provider VARCHAR(50),
  assinatura_provider_id VARCHAR(200),  -- ID no sistema do provider

  -- Observações
  observacoes TEXT,

  -- Auditoria
  gerado_por UUID REFERENCES auth.users(id),
  gerado_em TIMESTAMPTZ,
  enviado_em TIMESTAMPTZ,
  assinado_em TIMESTAMPTZ,
  cancelado_em TIMESTAMPTZ,
  cancelado_por UUID REFERENCES auth.users(id),
  motivo_cancelamento TEXT,

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (prazo_assinatura_dias > 0),
  CHECK (
    (status = 'cancelado' AND cancelado_em IS NOT NULL AND cancelado_por IS NOT NULL)
    OR status != 'cancelado'
  ),
  CHECK (
    (requer_assinatura = false) OR
    (requer_assinatura = true AND assinatura_provider IS NOT NULL)
  )
);

-- =====================================================
-- TABELA: assinatura
-- =====================================================
-- Rastreamento de assinaturas de documentos
-- Suporta múltiplos signatários por documento
-- =====================================================
CREATE TABLE assinatura (
  id BIGSERIAL PRIMARY KEY,
  documento_id BIGINT NOT NULL REFERENCES documento_instancia(id) ON DELETE CASCADE,

  -- Signatário
  pessoa_id BIGINT REFERENCES pessoa(id) ON DELETE CASCADE,
  nome_signatario VARCHAR(200) NOT NULL,
  email_signatario VARCHAR(200) NOT NULL,
  cpf_signatario VARCHAR(14),

  -- Tipo de participação
  tipo_signatario VARCHAR(50) NOT NULL,  -- 'locatario', 'fiador', 'proprietario', 'testemunha', 'imobiliaria'
  ordem_assinatura INTEGER NOT NULL DEFAULT 1,  -- Ordem de assinatura (sequencial ou paralelo)

  -- Status
  status assinatura_status_enum NOT NULL DEFAULT 'pendente',

  -- Dados da assinatura
  assinado_em TIMESTAMPTZ,
  ip_assinatura VARCHAR(45),
  token_assinatura VARCHAR(500),  -- Token do provider
  certificado_digital TEXT,  -- Hash ou certificado ICP-Brasil se aplicável

  -- Notificações
  notificado_em TIMESTAMPTZ,
  lembrete_enviado_em TIMESTAMPTZ,

  -- Recusa
  recusado_em TIMESTAMPTZ,
  motivo_recusa TEXT,

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (ordem_assinatura > 0),
  CHECK (
    (status = 'assinado' AND assinado_em IS NOT NULL) OR
    (status != 'assinado')
  ),
  CHECK (
    (status = 'recusado' AND recusado_em IS NOT NULL) OR
    (status != 'recusado')
  )
);

-- =====================================================
-- TABELA: arquivo_anexo
-- =====================================================
-- Arquivos adicionais anexados a documentos ou contratos
-- Ex: Comprovantes de renda, RG, CNH, etc.
-- =====================================================
CREATE TABLE arquivo_anexo (
  id BIGSERIAL PRIMARY KEY,

  -- Relacionamentos opcionais
  documento_id BIGINT REFERENCES documento_instancia(id) ON DELETE CASCADE,
  contrato_id BIGINT REFERENCES contrato_locacao(id) ON DELETE CASCADE,
  locatario_id BIGINT REFERENCES locatario(id) ON DELETE CASCADE,
  fiador_id BIGINT REFERENCES fiador(id) ON DELETE CASCADE,

  -- Metadados do arquivo
  nome_arquivo VARCHAR(255) NOT NULL,
  tipo_arquivo VARCHAR(100) NOT NULL,  -- 'RG', 'CPF', 'Comprovante_Renda', 'Comprovante_Residencia', etc.
  mime_type VARCHAR(100),
  tamanho_bytes BIGINT,

  -- Storage
  storage_path TEXT NOT NULL,
  url_publica TEXT,

  -- Metadados
  descricao TEXT,
  uploadado_por UUID REFERENCES auth.users(id),
  uploadado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Validação de documentos
  validado BOOLEAN DEFAULT false,
  validado_por UUID REFERENCES auth.users(id),
  validado_em TIMESTAMPTZ,
  observacoes_validacao TEXT,

  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CHECK (tamanho_bytes > 0),
  CHECK (
    documento_id IS NOT NULL OR
    contrato_id IS NOT NULL OR
    locatario_id IS NOT NULL OR
    fiador_id IS NOT NULL
  )
);

-- =====================================================
-- ÍNDICES
-- =====================================================

-- documento_modelo
CREATE INDEX idx_documento_modelo_tipo ON documento_modelo(tipo);
CREATE INDEX idx_documento_modelo_ativo ON documento_modelo(ativo) WHERE ativo = true;
CREATE INDEX idx_documento_modelo_vigencia ON documento_modelo(data_vigencia_inicio, data_vigencia_fim);

-- documento_instancia
CREATE INDEX idx_documento_instancia_tipo ON documento_instancia(tipo);
CREATE INDEX idx_documento_instancia_status ON documento_instancia(status);
CREATE INDEX idx_documento_instancia_numero ON documento_instancia(numero_documento);
CREATE INDEX idx_documento_instancia_contrato ON documento_instancia(contrato_id);
CREATE INDEX idx_documento_instancia_locatario ON documento_instancia(locatario_id);
CREATE INDEX idx_documento_instancia_gerado_em ON documento_instancia(gerado_em);
CREATE INDEX idx_documento_instancia_pendente_assinatura ON documento_instancia(status, data_limite_assinatura)
  WHERE status IN ('enviado', 'parcialmente_assinado');

-- assinatura
CREATE INDEX idx_assinatura_documento ON assinatura(documento_id);
CREATE INDEX idx_assinatura_pessoa ON assinatura(pessoa_id);
CREATE INDEX idx_assinatura_status ON assinatura(status);
CREATE INDEX idx_assinatura_pendente ON assinatura(status, ordem_assinatura)
  WHERE status = 'pendente';

-- arquivo_anexo
CREATE INDEX idx_arquivo_contrato ON arquivo_anexo(contrato_id);
CREATE INDEX idx_arquivo_locatario ON arquivo_anexo(locatario_id);
CREATE INDEX idx_arquivo_tipo ON arquivo_anexo(tipo_arquivo);
CREATE INDEX idx_arquivo_validado ON arquivo_anexo(validado);

-- =====================================================
-- FUNÇÕES E TRIGGERS
-- =====================================================

-- Função: Atualizar timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER update_documento_modelo_updated_at
  BEFORE UPDATE ON documento_modelo
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documento_instancia_updated_at
  BEFORE UPDATE ON documento_instancia
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assinatura_updated_at
  BEFORE UPDATE ON assinatura
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Função: Gerar número de documento
-- =====================================================
-- Formato: {TIPO}-{ANO}-{SEQUENCIAL}
-- Ex: D3-2025-00042
-- =====================================================
CREATE OR REPLACE FUNCTION gerar_numero_documento(p_tipo documento_tipo_enum)
RETURNS VARCHAR(50) AS $$
DECLARE
  v_ano VARCHAR(4);
  v_sequencial INTEGER;
  v_numero VARCHAR(50);
BEGIN
  v_ano := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;

  -- Busca o próximo sequencial para o tipo e ano
  SELECT COALESCE(MAX(
    SUBSTRING(numero_documento FROM '\d{4}$')::INTEGER
  ), 0) + 1
  INTO v_sequencial
  FROM documento_instancia
  WHERE tipo = p_tipo
    AND numero_documento LIKE p_tipo || '-' || v_ano || '-%';

  -- Formata o número
  v_numero := p_tipo || '-' || v_ano || '-' || LPAD(v_sequencial::VARCHAR, 5, '0');

  RETURN v_numero;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Função: Atualizar status do documento baseado nas assinaturas
-- =====================================================
CREATE OR REPLACE FUNCTION atualizar_status_documento_por_assinaturas()
RETURNS TRIGGER AS $$
DECLARE
  v_total_assinaturas INTEGER;
  v_assinaturas_concluidas INTEGER;
  v_novo_status documento_status_enum;
BEGIN
  -- Conta total de assinaturas necessárias
  SELECT COUNT(*) INTO v_total_assinaturas
  FROM assinatura
  WHERE documento_id = NEW.documento_id;

  -- Conta assinaturas concluídas
  SELECT COUNT(*) INTO v_assinaturas_concluidas
  FROM assinatura
  WHERE documento_id = NEW.documento_id
    AND status = 'assinado';

  -- Determina o novo status
  IF v_assinaturas_concluidas = 0 THEN
    v_novo_status := 'enviado';
  ELSIF v_assinaturas_concluidas = v_total_assinaturas THEN
    v_novo_status := 'assinado';
  ELSE
    v_novo_status := 'parcialmente_assinado';
  END IF;

  -- Atualiza o documento
  UPDATE documento_instancia
  SET
    status = v_novo_status,
    assinado_em = CASE
      WHEN v_novo_status = 'assinado' THEN NOW()
      ELSE assinado_em
    END
  WHERE id = NEW.documento_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Atualizar status do documento quando assinatura muda
CREATE TRIGGER trigger_atualizar_status_documento
  AFTER INSERT OR UPDATE OF status ON assinatura
  FOR EACH ROW
  WHEN (NEW.status IN ('assinado', 'recusado'))
  EXECUTE FUNCTION atualizar_status_documento_por_assinaturas();

-- =====================================================
-- Função: Verificar documentos expirados
-- =====================================================
-- Deve ser executada por um cron job diariamente
-- =====================================================
CREATE OR REPLACE FUNCTION marcar_documentos_expirados()
RETURNS TABLE(documentos_expirados BIGINT) AS $$
DECLARE
  v_count BIGINT;
BEGIN
  -- Marca documentos expirados
  UPDATE documento_instancia
  SET status = 'expirado'
  WHERE status IN ('enviado', 'parcialmente_assinado')
    AND data_limite_assinatura < CURRENT_DATE;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Marca assinaturas pendentes como expiradas
  UPDATE assinatura
  SET status = 'expirado'
  WHERE status = 'pendente'
    AND documento_id IN (
      SELECT id FROM documento_instancia WHERE status = 'expirado'
    );

  RETURN QUERY SELECT v_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE documento_modelo ENABLE ROW LEVEL SECURITY;
ALTER TABLE documento_instancia ENABLE ROW LEVEL SECURITY;
ALTER TABLE assinatura ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivo_anexo ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar conforme regras de negócio)
CREATE POLICY "Usuários autenticados podem ler modelos ativos"
  ON documento_modelo FOR SELECT
  TO authenticated
  USING (ativo = true);

CREATE POLICY "Usuários autenticados podem ler documentos"
  ON documento_instancia FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar documentos"
  ON documento_instancia FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar seus documentos"
  ON documento_instancia FOR UPDATE
  TO authenticated
  USING (gerado_por = auth.uid());

CREATE POLICY "Usuários autenticados podem ler assinaturas"
  ON assinatura FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar assinaturas"
  ON assinatura FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem ler anexos"
  ON arquivo_anexo FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar anexos"
  ON arquivo_anexo FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE documento_modelo IS 'Templates versionados de documentos com interpolação Handlebars';
COMMENT ON TABLE documento_instancia IS 'Documentos gerados a partir de templates';
COMMENT ON TABLE assinatura IS 'Rastreamento de assinaturas eletrônicas';
COMMENT ON TABLE arquivo_anexo IS 'Arquivos anexados a documentos, contratos ou cadastros';

COMMENT ON FUNCTION gerar_numero_documento IS 'Gera número único de documento no formato {TIPO}-{ANO}-{SEQUENCIAL}';
COMMENT ON FUNCTION atualizar_status_documento_por_assinaturas IS 'Atualiza status do documento conforme assinaturas são coletadas';
COMMENT ON FUNCTION marcar_documentos_expirados IS 'Marca documentos como expirados quando prazo de assinatura vence';
