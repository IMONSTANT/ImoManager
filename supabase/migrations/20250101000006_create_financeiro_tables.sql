-- =====================================================
-- MIGRATION: MÓDULO FINANCEIRO
-- Descrição: Cria tabelas de parcelas, cobranças e notificações
-- Baseado no SRS - Seção 6.5 (Financeiro)
-- Data: 2025-01-01
-- =====================================================

-- Enum para status de parcela
CREATE TYPE parcela_status_enum AS ENUM (
  'pendente',      -- Parcela criada mas boleto ainda não emitido
  'emitido',       -- Boleto/PIX emitido
  'pago',          -- Pagamento confirmado
  'vencido',       -- Vencimento passou e não foi pago
  'cancelado',     -- Parcela cancelada
  'estornado'      -- Pagamento estornado
);

-- Enum para status de cobrança
CREATE TYPE cobranca_status_enum AS ENUM (
  'criada',        -- Cobrança criada no sistema
  'emitida',       -- Enviada para gateway
  'paga',          -- Confirmada como paga
  'vencida',       -- Venceu sem pagamento
  'cancelada',     -- Cancelada antes do pagamento
  'estornada'      -- Pagamento estornado
);

-- Enum para canal de notificação
CREATE TYPE notificacao_canal_enum AS ENUM (
  'email',
  'whatsapp',
  'sms',
  'push',
  'outro'
);

-- =====================================================
-- TABELA: parcela
-- Propósito: Controlar competências mensais e valores devidos
-- Regras: RN-3 (Cobrança, Multas e Inadimplência)
-- =====================================================
CREATE TABLE parcela (
  id BIGSERIAL PRIMARY KEY,
  contrato_id BIGINT NOT NULL REFERENCES contrato_locacao(id) ON DELETE CASCADE,

  -- Competência e vencimento
  competencia DATE NOT NULL,  -- Ex: 2025-03-01 (sempre primeiro dia do mês)
  vencimento DATE NOT NULL,   -- Data efetiva de vencimento

  -- Valores monetários
  principal NUMERIC(14,2) NOT NULL CHECK (principal >= 0),
  multa NUMERIC(14,2) DEFAULT 0 CHECK (multa >= 0),
  juros NUMERIC(14,2) DEFAULT 0 CHECK (juros >= 0),
  desconto NUMERIC(14,2) DEFAULT 0 CHECK (desconto >= 0),
  valor_pago NUMERIC(14,2) DEFAULT 0 CHECK (valor_pago >= 0),

  -- Status e controle
  status parcela_status_enum NOT NULL DEFAULT 'pendente',
  data_pagamento TIMESTAMPTZ,

  -- Metadados
  observacoes TEXT,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_competencia_por_contrato UNIQUE (contrato_id, competencia),
  CONSTRAINT valor_pago_nao_excede_total CHECK (
    valor_pago <= (principal - desconto + multa + juros)
  )
);

-- Índices para performance
CREATE INDEX idx_parcela_contrato ON parcela(contrato_id);
CREATE INDEX idx_parcela_vencimento ON parcela(vencimento) WHERE status IN ('pendente', 'emitido');
CREATE INDEX idx_parcela_status ON parcela(status);
CREATE INDEX idx_parcela_vencidas ON parcela(vencimento, status) WHERE status = 'emitido';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_parcela_updated_at
  BEFORE UPDATE ON parcela
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE parcela IS 'Competências mensais de contratos de locação com cálculo de multas e juros';
COMMENT ON COLUMN parcela.competencia IS 'Primeiro dia do mês referente (ex: 2025-03-01)';
COMMENT ON COLUMN parcela.principal IS 'Valor base do aluguel';
COMMENT ON COLUMN parcela.multa IS 'Multa calculada: 2% sobre principal em D+1 (padrão)';
COMMENT ON COLUMN parcela.juros IS 'Juros de mora: 0,033% ao dia sobre principal (padrão)';
COMMENT ON COLUMN parcela.desconto IS 'Desconto aplicado (quando houver)';
COMMENT ON COLUMN parcela.valor_pago IS 'Valor efetivamente pago (para pagamentos parciais)';

-- =====================================================
-- TABELA: cobranca
-- Propósito: Títulos de cobrança (boletos/PIX) gerados para parcelas
-- Integração: Com gateways de pagamento (Asaas, Gerencianet, etc)
-- =====================================================
CREATE TABLE cobranca (
  id BIGSERIAL PRIMARY KEY,
  parcela_id BIGINT NOT NULL REFERENCES parcela(id) ON DELETE CASCADE,

  -- Identificação do gateway
  gateway VARCHAR(50) NOT NULL,  -- Ex: 'asaas', 'gerencianet', 'iugu'
  nosso_numero VARCHAR(100),     -- Identificador do gateway
  txid VARCHAR(100),             -- Transaction ID (PIX)

  -- Dados do boleto/PIX
  linha_digitavel TEXT,
  qr_code TEXT,
  qr_code_image_url TEXT,
  url_boleto TEXT,

  -- Status e conciliação
  status cobranca_status_enum NOT NULL DEFAULT 'criada',
  payload_webhook JSONB,  -- Espelho do retorno do provedor

  -- Metadados
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT valid_gateway CHECK (gateway IN ('asaas', 'gerencianet', 'iugu', 'pagseguro', 'mercadopago'))
);

-- Índices para performance
CREATE INDEX idx_cobranca_parcela ON cobranca(parcela_id);
CREATE INDEX idx_cobranca_status ON cobranca(status);
CREATE INDEX idx_cobranca_gateway_nosso_numero ON cobranca(gateway, nosso_numero);
CREATE INDEX idx_cobranca_txid ON cobranca(txid) WHERE txid IS NOT NULL;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_cobranca_updated_at
  BEFORE UPDATE ON cobranca
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE cobranca IS 'Títulos de cobrança (boletos/PIX) emitidos via gateways de pagamento';
COMMENT ON COLUMN cobranca.gateway IS 'Provedor de pagamento utilizado';
COMMENT ON COLUMN cobranca.nosso_numero IS 'Identificador único do título no gateway';
COMMENT ON COLUMN cobranca.txid IS 'Transaction ID para pagamentos PIX';
COMMENT ON COLUMN cobranca.payload_webhook IS 'Dados completos retornados pelo webhook do gateway';

-- =====================================================
-- TABELA: notificacao
-- Propósito: Registrar envios de comunicação (régua de cobrança)
-- Regras: RN-3.6 (Régua de Cobrança)
-- =====================================================
CREATE TABLE notificacao (
  id BIGSERIAL PRIMARY KEY,

  -- Relacionamentos (pelo menos um deve estar preenchido)
  pessoa_id BIGINT REFERENCES pessoa(id) ON DELETE SET NULL,
  contrato_id BIGINT REFERENCES contrato_locacao(id) ON DELETE SET NULL,
  parcela_id BIGINT REFERENCES parcela(id) ON DELETE SET NULL,
  documento_id BIGINT,  -- Será criado na próxima migration (documentos)

  -- Dados da notificação
  canal notificacao_canal_enum NOT NULL,
  template VARCHAR(100),  -- Nome do template usado
  assunto VARCHAR(255),
  mensagem TEXT NOT NULL,
  payload JSONB,  -- Variáveis usadas no template

  -- Controle de envio
  status VARCHAR(50) DEFAULT 'pendente',  -- pendente, enviada, entregue, lida, erro, cancelada
  tentativas INTEGER DEFAULT 0,
  erro_mensagem TEXT,

  -- Timestamps
  agendado_para TIMESTAMPTZ,
  enviado_em TIMESTAMPTZ,
  entregue_em TIMESTAMPTZ,
  lido_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Constraints
  CONSTRAINT pelo_menos_uma_referencia CHECK (
    pessoa_id IS NOT NULL OR
    contrato_id IS NOT NULL OR
    parcela_id IS NOT NULL OR
    documento_id IS NOT NULL
  )
);

-- Índices para performance
CREATE INDEX idx_notificacao_pessoa ON notificacao(pessoa_id) WHERE pessoa_id IS NOT NULL;
CREATE INDEX idx_notificacao_contrato ON notificacao(contrato_id) WHERE contrato_id IS NOT NULL;
CREATE INDEX idx_notificacao_parcela ON notificacao(parcela_id) WHERE parcela_id IS NOT NULL;
CREATE INDEX idx_notificacao_status ON notificacao(status);
CREATE INDEX idx_notificacao_canal ON notificacao(canal);
CREATE INDEX idx_notificacao_agendadas ON notificacao(agendado_para, status) WHERE status = 'pendente';

-- Comentários
COMMENT ON TABLE notificacao IS 'Log de notificações enviadas via email, WhatsApp, SMS, etc';
COMMENT ON COLUMN notificacao.template IS 'Identificador do template usado (ex: LEMBRETE_VENCIMENTO, AVISO_ATRASO)';
COMMENT ON COLUMN notificacao.payload IS 'Dados usados para preencher o template';
COMMENT ON COLUMN notificacao.tentativas IS 'Número de tentativas de envio (com retries)';

-- =====================================================
-- TABELA: configuracao_regua_cobranca
-- Propósito: Parametrizar a régua de cobrança automática
-- Regras: RN-3.6 (Régua de Cobrança)
-- =====================================================
CREATE TABLE configuracao_regua_cobranca (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,

  -- Parâmetros de multa e juros
  percentual_multa NUMERIC(5,2) DEFAULT 2.00,     -- 2%
  percentual_juros_dia NUMERIC(6,4) DEFAULT 0.0333,  -- 0,033% ao dia

  -- Dias para disparo (negativos = antes do vencimento)
  dia_lembrete INTEGER DEFAULT -3,        -- D-3: lembrete
  dia_aviso_atraso INTEGER DEFAULT 1,     -- D+1: aviso de atraso
  dia_primeiro_reaviso INTEGER DEFAULT 7, -- D+7: 1º reaviso
  dia_negociacao INTEGER DEFAULT 15,      -- D+15: proposta de negociação
  dia_juridico INTEGER DEFAULT 30,        -- D+30: encaminha para jurídico

  -- Templates de mensagem
  template_lembrete VARCHAR(100) DEFAULT 'LEMBRETE_VENCIMENTO',
  template_aviso_atraso VARCHAR(100) DEFAULT 'AVISO_ATRASO',
  template_reaviso VARCHAR(100) DEFAULT 'PRIMEIRO_REAVISO',
  template_negociacao VARCHAR(100) DEFAULT 'PROPOSTA_NEGOCIACAO',

  -- Canais habilitados
  usar_email BOOLEAN DEFAULT true,
  usar_whatsapp BOOLEAN DEFAULT true,
  usar_sms BOOLEAN DEFAULT false,

  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_configuracao_regua_updated_at
  BEFORE UPDATE ON configuracao_regua_cobranca
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir configuração padrão
INSERT INTO configuracao_regua_cobranca (nome, descricao)
VALUES (
  'Régua Padrão',
  'Configuração padrão da régua de cobrança conforme SRS - RN-3.6'
);

COMMENT ON TABLE configuracao_regua_cobranca IS 'Configurações da régua automática de cobrança';

-- =====================================================
-- FUNCTION: calcular_multa_juros
-- Propósito: Calcular multa e juros de acordo com RN-3.3
-- Uso: Chamada automaticamente ou manualmente para atualizar parcelas
-- =====================================================
CREATE OR REPLACE FUNCTION calcular_multa_juros(
  p_parcela_id BIGINT,
  p_data_referencia DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  nova_multa NUMERIC,
  novo_juros NUMERIC,
  dias_atraso INTEGER
) AS $$
DECLARE
  v_parcela RECORD;
  v_config RECORD;
  v_dias_atraso INTEGER;
  v_multa NUMERIC;
  v_juros NUMERIC;
BEGIN
  -- Buscar dados da parcela
  SELECT * INTO v_parcela
  FROM parcela
  WHERE id = p_parcela_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Parcela não encontrada: %', p_parcela_id;
  END IF;

  -- Buscar configuração da régua
  SELECT * INTO v_config
  FROM configuracao_regua_cobranca
  WHERE ativo = true
  LIMIT 1;

  -- Calcular dias de atraso
  v_dias_atraso := GREATEST(0, p_data_referencia - v_parcela.vencimento);

  -- Aplicar multa (apenas se houver atraso)
  IF v_dias_atraso > 0 THEN
    v_multa := v_parcela.principal * (v_config.percentual_multa / 100);
  ELSE
    v_multa := 0;
  END IF;

  -- Aplicar juros (proporcional aos dias)
  v_juros := v_parcela.principal * (v_config.percentual_juros_dia / 100) * v_dias_atraso;

  -- Arredondar para 2 casas decimais
  v_multa := ROUND(v_multa, 2);
  v_juros := ROUND(v_juros, 2);

  RETURN QUERY SELECT v_multa, v_juros, v_dias_atraso;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calcular_multa_juros IS 'Calcula multa (2%) e juros (0,033% ao dia) conforme RN-3.3';

-- =====================================================
-- FUNCTION: atualizar_parcelas_vencidas
-- Propósito: Atualizar status e valores de parcelas vencidas
-- Uso: Executada diariamente por scheduler/cron
-- =====================================================
CREATE OR REPLACE FUNCTION atualizar_parcelas_vencidas()
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
  v_parcela RECORD;
  v_calculo RECORD;
BEGIN
  -- Buscar parcelas vencidas que ainda estão como 'emitido'
  FOR v_parcela IN
    SELECT id, vencimento
    FROM parcela
    WHERE status = 'emitido'
      AND vencimento < CURRENT_DATE
  LOOP
    -- Calcular multa e juros
    SELECT * INTO v_calculo
    FROM calcular_multa_juros(v_parcela.id);

    -- Atualizar parcela
    UPDATE parcela
    SET
      status = 'vencido',
      multa = v_calculo.nova_multa,
      juros = v_calculo.novo_juros,
      atualizado_em = now()
    WHERE id = v_parcela.id;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION atualizar_parcelas_vencidas IS 'Atualiza status e recalcula multa/juros de parcelas vencidas';

-- =====================================================
-- Grants para autenticação
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON parcela TO authenticated;
GRANT SELECT, INSERT, UPDATE ON cobranca TO authenticated;
GRANT SELECT, INSERT, UPDATE ON notificacao TO authenticated;
GRANT SELECT ON configuracao_regua_cobranca TO authenticated;
GRANT UPDATE ON configuracao_regua_cobranca TO service_role;

-- =====================================================
-- Fim da migration
-- =====================================================
