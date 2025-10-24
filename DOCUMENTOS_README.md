# Módulo de Geração Dinâmica de Documentos

Sistema completo de geração dinâmica de documentos para gestão imobiliária com templates Handlebars, interpolação de dados e geração de PDFs.

## Estrutura Implementada

### 1. Templates Handlebars (10 Documentos)

Todos os templates estão em `src/lib/templates/`:

- **D1** - Declaração de Entrega de Contrato (com reconhecimento de firma)
- **D2** - Ficha Cadastral de Fiador
- **D3** - Contrato de Locação Completo
- **D4** - Termo de Vistoria de Entrada
- **D5** - Termo de Vistoria de Saída
- **D6** - Autorização de Débito Automático
- **D7** - Termo de Entrega de Chaves (provisória/definitiva)
- **D8** - Notificação de Atraso de Pagamento
- **D9** - Acordo de Rescisão de Contrato
- **D10** - Recibo de Pagamento

Cada template possui:
- HTML profissional com CSS inline (otimizado para PDF)
- Variáveis Handlebars dinâmicas
- Helpers customizados (formatMoney, formatDate, formatCPF, formatCNPJ, formatCEP)

### 2. API Routes

#### POST /api/documentos/gerar
Gera documento a partir de dados do banco ou dados customizados.

**Payload:**
```json
{
  "tipo": "D3",
  "contrato_id": 1,
  "locatario_id": 5,
  "fiador_id": 2,
  "imovel_id": 10,
  "parcela_id": 100,
  "dados_customizados": {},
  "requer_assinatura": false,
  "prazo_assinatura_dias": 30,
  "assinatura_provider": "manual"
}
```

**Resposta:**
```json
{
  "success": true,
  "documento": {
    "id": 42,
    "numero_documento": "D3-2025-00042",
    "tipo": "D3",
    "status": "gerado",
    "conteudo_html": "...",
    ...
  }
}
```

#### GET /api/documentos/templates
Lista todos os templates disponíveis.

#### GET /api/documentos
Lista documentos gerados com filtros opcionais.

**Query params:**
- `tipo` - Filtro por tipo (D1-D10)
- `status` - Filtro por status
- `contrato_id` - Filtro por contrato
- `locatario_id` - Filtro por locatário
- `limit` - Limite de resultados (padrão: 50)
- `offset` - Offset para paginação

#### GET /api/documentos/[id]
Busca documento específico por ID com todos os relacionamentos.

#### PATCH /api/documentos/[id]
Atualiza status, observações ou URL do PDF.

#### DELETE /api/documentos/[id]
Cancela documento (soft delete).

#### GET /api/documentos/[id]/pdf
Visualiza PDF inline no navegador.

#### POST /api/documentos/[id]/pdf
Baixa PDF como arquivo.

### 3. Frontend

#### /documentos
Página de listagem com:
- Tabela de documentos gerados
- Filtros por tipo e status
- Ações: visualizar, baixar PDF
- Paginação

#### /documentos/gerar
Wizard de geração em 3 etapas:
1. **Selecionar Tipo** - Grid com todos os 10 tipos
2. **Informações** - Selecionar contrato, locatário, etc.
3. **Preview e Download** - Visualizar e baixar PDF

### 4. Banco de Dados

Migração já aplicada em:
`supabase/migrations/20250101000007_create_documentos_tables.sql`

**Tabelas:**
- `documento_modelo` - Templates versionados
- `documento_instancia` - Documentos gerados
- `assinatura` - Rastreamento de assinaturas
- `arquivo_anexo` - Anexos relacionados

**Funções:**
- `gerar_numero_documento(p_tipo)` - Gera número sequencial
- `marcar_documentos_expirados()` - Marca documentos expirados

### 5. Services

#### DocumentoService (`src/lib/services/DocumentoService.ts`)

Métodos principais:
- `gerarNumeroDocumento(tipo, ano, sequencial)` - Gera número único
- `interpolarTemplate(template, data)` - Interpola Handlebars
- `validarTemplate(template, variaveisEsperadas)` - Valida sintaxe
- `gerarDocumento(input, modelo)` - Gera documento completo
- `htmlParaPdf(html, options)` - Converte HTML para PDF com Puppeteer
- `obterProximoNumero(tipo)` - Obtém próximo número sequencial

Helpers Handlebars registrados:
- `formatMoney` - Formata moeda (R$ 1.234,56)
- `formatDate` - Formata data (dd/MM/yyyy)
- `formatCPF` - Formata CPF (123.456.789-01)
- `formatCNPJ` - Formata CNPJ (12.345.678/0001-90)
- `formatCEP` - Formata CEP (12345-678)

## Como Usar

### 1. Popular Templates no Banco

Execute o script de seed:

```bash
# Opção 1: TypeScript
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-templates.ts

# Opção 2: JavaScript
node scripts/seed-templates.js
```

Isso irá:
- Conectar no Supabase
- Inserir os 10 templates na tabela `documento_modelo`
- Marcar todos como ativos (versão 1)

### 2. Gerar Documento via API

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "tipo": "D3",
    "contrato_id": 1
  }'
```

### 3. Gerar Documento via Interface

1. Acesse `/documentos/gerar`
2. Selecione o tipo de documento (D1-D10)
3. Escolha o contrato (dados são preenchidos automaticamente)
4. Clique em "Gerar Documento"
5. Visualize ou baixe o PDF

### 4. Listar Documentos

```bash
# Todos os documentos
GET /api/documentos

# Filtrar por tipo
GET /api/documentos?tipo=D3

# Filtrar por status
GET /api/documentos?status=gerado

# Filtrar por contrato
GET /api/documentos?contrato_id=1
```

## Exemplos de Payload

### D1 - Declaração Entrega Contrato

```json
{
  "tipo": "D1",
  "contrato_id": 1,
  "dados_customizados": {
    "locatarios": [
      {
        "nome": "João Silva",
        "cpf": "12345678901",
        "rg": "1234567",
        "nacionalidade": "Brasileiro",
        "estado_civil": "Solteiro",
        "profissao": "Enfermeiro"
      }
    ],
    "locador": {
      "nome": "Imonstant Gestão Imobiliária"
    },
    "contrato": {
      "numero": "CT-2025-00001",
      "valor_caucao": 2400.00,
      "data_vencimento_caucao": "2025-03-24",
      "data_devolucao_assinado": "2025-03-24"
    },
    "imovel": {
      "endereco": {
        "logradouro": "Rua das Flores",
        "numero": "123",
        "bairro": "Centro",
        "cidade": "Fortaleza",
        "estado": "CE",
        "cep": "60000000"
      }
    }
  }
}
```

### D3 - Contrato de Locação

```json
{
  "tipo": "D3",
  "contrato_id": 1
}
```

### D8 - Notificação de Atraso

```json
{
  "tipo": "D8",
  "contrato_id": 1,
  "parcela_id": 100
}
```

### D10 - Recibo de Pagamento

```json
{
  "tipo": "D10",
  "contrato_id": 1,
  "parcela_id": 100
}
```

## Busca Automática de Dados

Quando você fornece `contrato_id`, o sistema busca automaticamente:

1. **Dados do Contrato**
   - Número, datas, valor, vencimento
   - Índice de reajuste, tipo de garantia

2. **Dados do Imóvel**
   - Tipo, endereço completo
   - Dados do proprietário

3. **Dados do Locatário**
   - Nome, CPF, RG, contato
   - Nacionalidade, profissão, estado civil

4. **Dados do Fiador** (se houver)
   - Nome, CPF, RG, contato
   - Dados profissionais e de garantia

5. **Dados da Parcela** (para D8 e D10)
   - Competência, vencimento
   - Valores, multa, juros
   - Dias de atraso

## Arquivos Criados/Modificados

### Templates (novos)
- `src/lib/templates/d1_declaracao_entrega_contrato.ts`
- `src/lib/templates/d2_ficha_cadastro_fiador.ts`
- `src/lib/templates/d3_contrato_locacao.ts`
- `src/lib/templates/d4_termo_vistoria_entrada.ts`
- `src/lib/templates/d5_termo_vistoria_saida.ts`
- `src/lib/templates/d6_autorizacao_debito.ts`
- `src/lib/templates/d7_termo_entrega_chaves.ts`
- `src/lib/templates/d8_notificacao_atraso.ts`
- `src/lib/templates/d9_acordo_rescisao.ts`
- `src/lib/templates/d10_recibo_pagamento.ts`
- `src/lib/templates/index.ts`

### API Routes (novos)
- `src/app/api/documentos/route.ts`
- `src/app/api/documentos/gerar/route.ts`
- `src/app/api/documentos/templates/route.ts`
- `src/app/api/documentos/[id]/route.ts`
- `src/app/api/documentos/[id]/pdf/route.ts`

### Frontend (novos)
- `src/app/(dashboard)/documentos/gerar/page.tsx`

### Frontend (modificados)
- `src/app/(dashboard)/documentos/page.tsx` (já existia)

### Scripts (novos)
- `scripts/seed-templates.ts`
- `scripts/seed-templates.js`

### Tipos (modificados)
- `src/lib/types/documento.ts`

### Outros (existentes, não modificados)
- `src/lib/services/DocumentoService.ts`
- `supabase/migrations/20250101000007_create_documentos_tables.sql`

## Testes

### Testar Geração de PDF

1. Certifique-se que Puppeteer está instalado:
```bash
npm install puppeteer
```

2. Teste geração via API:
```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -d '{"tipo":"D3","contrato_id":1}'
```

3. Visualize o PDF:
```bash
# Copie o ID retornado e acesse:
http://localhost:3000/api/documentos/42/pdf
```

### Testar Interface

1. Acesse `http://localhost:3000/documentos`
2. Clique em "Gerar Novo Documento"
3. Selecione um tipo (ex: D3 - Contrato de Locação)
4. Escolha um contrato
5. Clique em "Gerar Documento"
6. Visualize o preview e baixe o PDF

## Troubleshooting

### Erro ao gerar PDF

Se você receber erro do Puppeteer:
```bash
# Instale dependências do Chrome no Linux
sudo apt-get install -y libgbm1 libnss3 libxss1 libasound2

# Ou use Chrome já instalado
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

### Templates não aparecem

Execute o seed novamente:
```bash
node scripts/seed-templates.js
```

### Dados não preenchidos

Verifique se:
1. O contrato existe no banco
2. O contrato tem locatário e imóvel associados
3. As tabelas relacionadas estão populadas

## Próximos Passos

1. ✅ Integração com Supabase Storage para armazenar PDFs
2. ✅ Sistema de assinaturas eletrônicas (ClickSign/DocuSign)
3. ✅ Notificações automáticas de documentos pendentes
4. ✅ Versionamento de templates
5. ✅ Histórico de alterações em documentos
6. ✅ Busca full-text em documentos

## Licença

Propriedade de Imonstant Tech - Todos os direitos reservados
