# 🗺️ ROADMAP - Sistema de Gerenciamento Imobiliário

> **Documento de Planejamento Técnico**
> **Projeto**: Sistema de Gestão Imobiliária (Locação + Venda)
> **Cliente**: Imobiliária XYZ
> **Data**: 2025-01-23
> **Versão**: 1.0

---

## 📊 STATUS GERAL DO PROJETO

| Categoria | Concluído | Pendente | Total | % |
|-----------|-----------|----------|-------|---|
| **Backend (Migrations)** | 6 | 4 | 10 | 60% |
| **Services (Lógica)** | 1 | 5 | 6 | 17% |
| **Frontend (Componentes)** | 15 | 10 | 25 | 60% |
| **Integrações** | 0 | 4 | 4 | 0% |
| **Testes** | 220 | ~300 | ~520 | 42% |
| **Documentação** | 2 | 8 | 10 | 20% |
| **TOTAL GERAL** | - | - | - | **45%** |

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### 1. Banco de Dados (Supabase)
- ✅ `20240101000000_initial_schema.sql` - Schema inicial
- ✅ `20240101000001_rls_policies.sql` - Políticas RLS básicas
- ✅ `20240101000002_create_profile_trigger.sql` - Trigger de perfil
- ✅ `20250101000000_create_base_tables.sql` - Tabelas base (profissao, tipo_locacao, tipo_imovel, endereco)
- ✅ `20250101000001_create_pessoa_tables.sql` - Tabelas de pessoas (pessoa, locador, locatario, fiador)
- ✅ `20250101000002_create_imovel_empresa_tables.sql` - Tabelas de imóveis (imovel, empresa_cliente)
- ✅ `20250101000003_create_contrato_locacao_table.sql` - Contratos de locação
- ✅ `20250101000004_seed_reference_data.sql` - Dados de referência
- ✅ `20250101000005_enable_rls_policies.sql` - RLS policies habilitadas
- ✅ `20250101000006_create_financeiro_tables.sql` - **Módulo Financeiro completo** (parcela, cobranca, notificacao, regua)

### 2. Services (Lógica de Negócio)
- ✅ **FinanceiroService** (100% testado)
  - Cálculo de multa (2%)
  - Cálculo de juros (0,033% ao dia)
  - Pagamento parcial (ordem: juros → multa → principal)
  - Reajuste anual (IGPM/IPCA)
  - 28 testes unitários passando

### 3. Frontend React/Next.js
- ✅ Componentes UI (shadcn/ui) - 15 componentes
- ✅ Forms com React Hook Form
- ✅ Validações Zod (100% schemas validados)
- ✅ Dashboard básico
- ✅ Autenticação (login/logout)

### 4. Testes
- ✅ 220 testes unitários passando (100%)
- ✅ Coverage de schemas: 100%
- ✅ Coverage de FinanceiroService: 100%

---

## 🚧 O QUE FALTA IMPLEMENTAR

### FASE 1: MÓDULO DE DOCUMENTOS (CRÍTICO) 🔴
**Prioridade**: MÁXIMA
**Tempo Estimado**: 12-16 horas
**Dependências**: Migration financeiro (✅ pronta)

#### 1.1 Migration SQL
**Arquivo**: `20250101000007_create_documentos_tables.sql`

```sql
-- Tabelas necessárias:
- documento_modelo (templates versionados)
- documento_instancia (documentos gerados)
- assinatura (rastreamento de assinaturas)
- arquivo_anexo (storage de PDFs)
- template_variavel (placeholders disponíveis)
```

**Checklist**:
- [ ] Criar ENUM `documento_tipo_enum` (D1-D10)
- [ ] Criar ENUM `documento_status_enum` (rascunho, enviado, assinado, arquivado)
- [ ] Tabela `documento_modelo` com versionamento
- [ ] Tabela `documento_instancia` com payload JSONB
- [ ] Tabela `assinatura` com status por signatário
- [ ] Tabela `arquivo_anexo` com hash SHA-256
- [ ] Índices para performance
- [ ] RLS policies por tenant
- [ ] Function: `gerar_numero_documento(tipo, ano)`
- [ ] Function: `validar_placeholders(template, payload)`

#### 1.2 Service: DocumentoService
**Arquivo**: `src/lib/services/DocumentoService.ts`

**Métodos necessários**:
```typescript
- gerarDocumento(tipo, contratoId, payload): Promise<DocumentoInstancia>
- preencherTemplate(template, variaveis): string
- enviarParaAssinatura(documentoId, signatarios): Promise<void>
- verificarStatusAssinatura(documentoId): Promise<Status>
- downloadPDF(documentoId): Promise<Blob>
- validarDocumentoCompleto(documentoId): boolean
```

**Checklist**:
- [ ] TDD: 30+ testes para geração de documentos
- [ ] Implementar engine de templates (Handlebars ou Mustache)
- [ ] Integração com biblioteca de PDF (@react-pdf/renderer)
- [ ] Numeração automática por tipo/ano
- [ ] Validação de campos obrigatórios por tipo
- [ ] Cache de templates compilados
- [ ] Versionamento de templates

#### 1.3 Templates dos 10 Documentos Obrigatórios
**Diretório**: `src/templates/documentos/`

**Documentos (conforme SRS - RN-0)**:
- [ ] **D1**: Contrato de Locação (Caução) - `contrato_locacao_caucao.hbs`
- [ ] **D2**: Contrato de Locação (Fiador) - `contrato_locacao_fiador.hbs`
- [ ] **D3**: Declaração de Entrega de Contrato - `declaracao_entrega_contrato.hbs`
- [ ] **D4**: Declaração de Entrega com Reconhecimento - `declaracao_entrega_reconhecimento.hbs`
- [ ] **D5**: Declaração Pós-Entrada - `declaracao_pos_entrada.hbs`
- [ ] **D6**: Declaração de Entrega Provisória de Chaves - `declaracao_entrega_provisoria_chaves.hbs`
- [ ] **D7**: Declaração de Devolução de Chaves com Pendências - `declaracao_devolucao_chaves.hbs`
- [ ] **D8**: Aviso/Reaviso de Inadimplência - `aviso_inadimplencia.hbs`
- [ ] **D9**: Acordo de Rescisão - `acordo_rescisao.hbs`
- [ ] **D10**: Declaração de Recebimento da Rescisão - `declaracao_recebimento_rescisao.hbs`

**Variáveis comuns** (ver SRS - Anexo 10.1):
```
contrato.*
imovel.*
locador.*
locatario.*
fiador.*
rescisao.*
chaves.*
```

#### 1.4 Integração Clicksign/DocuSign
**Arquivo**: `src/lib/integrations/AssinaturaProvider.ts`

**Checklist**:
- [ ] Interface abstrata `IAssinaturaProvider`
- [ ] Implementação `ClicksignProvider`
- [ ] Implementação `DocusignProvider`
- [ ] Webhook handler para status de assinatura
- [ ] Validação HMAC de webhooks
- [ ] Retry automático em falhas
- [ ] Logs de auditoria de assinaturas

---

### FASE 2: RÉGUA DE COBRANÇA AUTOMATIZADA (CRÍTICO) 🔴
**Prioridade**: ALTA
**Tempo Estimado**: 8-10 horas
**Dependências**: FinanceiroService (✅), Notificações (parcial)

#### 2.1 Service: ReguaCobrancaService
**Arquivo**: `src/lib/services/ReguaCobrancaService.ts`

**Métodos necessários**:
```typescript
- verificarParcelasParaNotificar(): Promise<Parcela[]>
- enviarLembrete(parcelaId, diasAntes): Promise<void>
- enviarAvisoAtraso(parcelaId, diasApos): Promise<void>
- enviarReaviso(parcelaId, numeroReaviso): Promise<void>
- enviarPropostaNegociacao(parcelaId): Promise<void>
- marcarParaJuridico(parcelaId): Promise<void>
- executarReguaDiaria(): Promise<ReguaResult>
```

**Checklist TDD**:
- [ ] Teste: Lembrete D-3 (3 dias antes do vencimento)
- [ ] Teste: Aviso D+1 (1 dia após vencimento)
- [ ] Teste: Reaviso D+7
- [ ] Teste: Negociação D+15
- [ ] Teste: Jurídico D+30
- [ ] Teste: Não enviar duplicados
- [ ] Teste: Respeitar preferência de canal (email/whatsapp)
- [ ] Teste: Fallback de canal em falhas

#### 2.2 Edge Function: Scheduler da Régua
**Arquivo**: `supabase/functions/regua-cobranca-diaria/index.ts`

**Checklist**:
- [ ] Executar diariamente às 6h (cron: `0 6 * * *`)
- [ ] Chamar `ReguaCobrancaService.executarReguaDiaria()`
- [ ] Atualizar parcelas vencidas com multa/juros
- [ ] Enviar notificações agendadas
- [ ] Registrar logs de execução
- [ ] Alertar admin em caso de falhas
- [ ] Métricas: parcelas processadas, notificações enviadas

#### 2.3 Templates de Mensagens
**Arquivo**: `src/templates/mensagens/`

**WhatsApp** (ver SRS - Anexo 10.2):
- [ ] `whatsapp_lembrete_vencimento.hbs`
- [ ] `whatsapp_aviso_atraso.hbs`
- [ ] `whatsapp_primeiro_reaviso.hbs`
- [ ] `whatsapp_confirmacao_pagamento.hbs`
- [ ] `whatsapp_reajuste.hbs`
- [ ] `whatsapp_assinatura_pendente.hbs`

**Email**:
- [ ] `email_lembrete_vencimento.hbs`
- [ ] `email_aviso_atraso.hbs`
- [ ] `email_primeiro_reaviso.hbs`
- [ ] `email_reajuste.hbs`
- [ ] `email_contrato_assinado.hbs`
- [ ] `email_acordo_rescisao.hbs`

---

### FASE 3: CONTROLE OPERACIONAL (ALTA) 🟡
**Prioridade**: ALTA
**Tempo Estimado**: 6-8 horas
**Dependências**: Documentos (FASE 1)

#### 3.1 Migration SQL
**Arquivo**: `20250101000008_create_controle_operacional_tables.sql`

**Tabelas**:
```sql
- rescisao (motivo, multa, data_desocupacao, status)
- chave_mov (tipo: entrega_provisoria | entrega_final | devolucao)
- vistoria (tipo: entrada | saida, itens_verificados JSONB)
- pendencia (tipo, descricao, prazo, status, valor_estimado)
```

**Checklist**:
- [ ] ENUM `rescisao_status_enum`
- [ ] ENUM `chave_mov_tipo_enum`
- [ ] ENUM `vistoria_tipo_enum`
- [ ] Constraints de integridade
- [ ] RLS policies
- [ ] Triggers de auditoria

#### 3.2 Service: RescisaoService
**Arquivo**: `src/lib/services/RescisaoService.ts`

**Métodos**:
```typescript
- iniciarRescisao(contratoId, motivo): Promise<Rescisao>
- calcularValoresRescisao(contratoId): Promise<CalculoRescisao>
- gerarAcordoRescisao(rescisaoId): Promise<Documento>
- registrarDevolucaoChaves(rescisaoId, pendencias): Promise<void>
- anexarQuitacoes(rescisaoId, arquivos): Promise<void>
- finalizarRescisao(rescisaoId): Promise<void>
```

---

### FASE 4: INTEGRAÇÕES EXTERNAS (MÉDIA) 🟡
**Prioridade**: MÉDIA
**Tempo Estimado**: 12-16 horas

#### 4.1 Gateway de Pagamentos
**Arquivo**: `src/lib/integrations/PagamentoProvider.ts`

**Providers a implementar**:
- [ ] Asaas (boleto + PIX)
- [ ] Gerencianet (boleto + PIX)
- [ ] Abstração: `IPagamentoProvider`

**Métodos**:
```typescript
- criarCobranca(parcela): Promise<Cobranca>
- cancelarCobranca(cobrancaId): Promise<void>
- consultarStatus(cobrancaId): Promise<Status>
- processarWebhook(payload, signature): Promise<void>
- gerarSegundaVia(parcelaId, novoVencimento): Promise<Cobranca>
```

**Checklist**:
- [ ] Idempotência (Idempotency-Key)
- [ ] Validação HMAC de webhooks
- [ ] Retry com backoff exponencial
- [ ] Circuit breaker
- [ ] Logs detalhados
- [ ] Testes de integração (sandbox)

#### 4.2 WhatsApp Business API
**Arquivo**: `src/lib/integrations/WhatsAppProvider.ts`

**Checklist**:
- [ ] Integração com BSP (Business Solution Provider)
- [ ] Criação de templates no Meta Business
- [ ] Envio de mensagens com variáveis
- [ ] Webhook de status (entregue, lido, respondido)
- [ ] Fallback para email em falhas
- [ ] Rate limiting

#### 4.3 Email Transacional
**Arquivo**: `src/lib/integrations/EmailProvider.ts`

**Providers**:
- [ ] SendGrid
- [ ] Amazon SES
- [ ] Abstração: `IEmailProvider`

**Checklist**:
- [ ] Templates HTML responsivos
- [ ] Tracking de opens/clicks
- [ ] Bounce handling
- [ ] Unsubscribe automático

---

### FASE 5: TESTES E2E (MÉDIA) 🟡
**Prioridade**: MÉDIA
**Tempo Estimado**: 8-12 horas

#### 5.1 Fluxo UC-01: Criar Nova Locação
**Arquivo**: `tests/e2e/fluxos/criar-locacao.spec.ts`

**Cenário**:
1. Login como atendente
2. Cadastrar locatário (se novo)
3. Selecionar imóvel disponível
4. Escolher garantia (caução ou fiador)
5. Preencher dados do contrato
6. Gerar contrato (D1 ou D2)
7. Enviar para assinatura
8. Verificar status "aguardando assinatura"

**Asserções**:
- [ ] Contrato criado com status correto
- [ ] Documento gerado (D1 ou D2)
- [ ] Signatários registrados
- [ ] Notificação enviada

#### 5.2 Fluxo UC-04: Geração de Parcelas e Boletos
**Arquivo**: `tests/e2e/fluxos/gerar-parcelas-boletos.spec.ts`

**Cenário**:
1. Contrato vigente
2. Sistema gera parcela mensal
3. Sistema emite boleto via gateway
4. Sistema envia notificação
5. Simular webhook de pagamento
6. Verificar status "pago"

**Asserções**:
- [ ] Parcela criada corretamente
- [ ] Boleto emitido (nosso_numero retornado)
- [ ] Notificação registrada
- [ ] Conciliação automática funciona

#### 5.3 Fluxo UC-10: Rescisão
**Arquivo**: `tests/e2e/fluxos/rescisao-contrato.spec.ts`

**Cenário**:
1. Solicitar rescisão
2. Calcular saldos/multas
3. Gerar acordo (D9)
4. Assinar acordo
5. Registrar devolução de chaves (D7)
6. Anexar quitações
7. Finalizar contrato

**Asserções**:
- [ ] Rescisão criada
- [ ] Valores calculados corretos
- [ ] Documentos D7 e D9 gerados
- [ ] Status final: "rescindido"

---

### FASE 6: DASHBOARD AVANÇADO (BAIXA) 🟢
**Prioridade**: BAIXA
**Tempo Estimado**: 6-8 horas

#### 6.1 Componentes de Visualização
- [ ] Gráfico de inadimplência (mês a mês)
- [ ] Taxa de ocupação de imóveis
- [ ] Receita recorrente mensal (MRR)
- [ ] Contratos próximos ao vencimento (timeline)
- [ ] Mapa de calor de atrasos

#### 6.2 Relatórios Exportáveis
- [ ] Relatório de repasses (PDF)
- [ ] Extrato de parcelas (Excel)
- [ ] Contratos ativos (CSV)
- [ ] Inadimplência detalhada (PDF)

---

### FASE 7: MÓDULO DE VENDA (OPCIONAL) 🔵
**Prioridade**: BAIXA (Pós-MVP)
**Tempo Estimado**: 16-20 horas

**Escopo**:
- Proposta de compra
- Negociação (contrapropostas)
- Contrato de venda
- Registro de pagamentos
- Comissão de corretores

**Status**: Definido no SRS mas não prioritário para MVP

---

## 📋 CHECKLIST PRÉ-PRODUÇÃO

### Banco de Dados
- [ ] Todas as 10 migrations aplicadas
- [ ] RLS habilitado em todas as tabelas
- [ ] Índices criados e verificados
- [ ] Backup automático configurado
- [ ] Retention policy definida

### Backend
- [ ] Edge Functions deployadas
- [ ] Cron jobs configurados
- [ ] Secrets no Supabase Vault
- [ ] Rate limiting ativo
- [ ] Monitoramento de erros (Sentry/Logtail)

### Frontend
- [ ] Build de produção sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] CSP headers configurados
- [ ] PWA (opcional) configurado
- [ ] Analytics (opcional) integrado

### Integrações
- [ ] Credenciais de produção dos gateways
- [ ] Webhooks registrados nos provedores
- [ ] WhatsApp templates aprovados
- [ ] Email sender verificado

### Testes
- [ ] Coverage > 80%
- [ ] Todos os E2E passando
- [ ] Smoke tests de produção
- [ ] Load testing (opcional)

### Documentação
- [ ] README.md completo
- [ ] Guia de deploy
- [ ] Manual do usuário
- [ ] API docs (OpenAPI)
- [ ] Runbook operacional

### Segurança
- [ ] Auditoria de dependências (npm audit)
- [ ] LGPD compliance verificada
- [ ] Política de retenção de dados
- [ ] Termo de uso e privacidade
- [ ] Plano de resposta a incidentes

---

## 🎯 ESTIMATIVAS DE TEMPO TOTAL

| Fase | Tempo | Prioridade |
|------|-------|-----------|
| FASE 1: Documentos | 12-16h | 🔴 CRÍTICO |
| FASE 2: Régua de Cobrança | 8-10h | 🔴 CRÍTICO |
| FASE 3: Controle Operacional | 6-8h | 🟡 ALTA |
| FASE 4: Integrações | 12-16h | 🟡 MÉDIA |
| FASE 5: Testes E2E | 8-12h | 🟡 MÉDIA |
| FASE 6: Dashboard Avançado | 6-8h | 🟢 BAIXA |
| FASE 7: Módulo Venda | 16-20h | 🔵 OPCIONAL |
| **TOTAL MVP** | **52-70h** | - |
| **TOTAL COMPLETO** | **68-90h** | - |

---

## 📞 PRÓXIMAS AÇÕES IMEDIATAS

### Semana 1 (CRÍTICO)
1. [ ] Implementar FASE 1 (Documentos) - 12-16h
2. [ ] Implementar FASE 2 (Régua) - 8-10h
3. [ ] Deploy de migrations no Supabase
4. [ ] Testes de integração

### Semana 2 (ALTA)
1. [ ] Implementar FASE 3 (Operacional) - 6-8h
2. [ ] Implementar FASE 4 (Integrações) - 12-16h
3. [ ] Configurar webhooks

### Semana 3 (MÉDIA)
1. [ ] Implementar FASE 5 (E2E) - 8-12h
2. [ ] Implementar FASE 6 (Dashboard) - 6-8h
3. [ ] Testes de aceitação com cliente

### Semana 4 (DEPLOY)
1. [ ] Revisão de segurança
2. [ ] Deploy produção
3. [ ] Treinamento usuários
4. [ ] Go-live

---

## 🔗 REFERÊNCIAS

- **SRS Completo**: Ver documento fornecido pelo cliente (57 páginas)
- **Regras de Negócio**: SRS Seção 8 (RN-0 a RN-8)
- **Modelagem de Dados**: SRS Seção 6
- **Casos de Uso**: SRS Seção 7
- **Requisitos de Integração**: SRS Seção 9
- **Segurança**: SRS Seção 10

---

**Última Atualização**: 2025-01-23 14:50
**Responsável**: Sistema de Gerenciamento Imobiliário - Equipe de Desenvolvimento
