# Guia de Testes - Módulo de Documentos

## Pré-requisitos

1. Aplicar a migration do banco:
```bash
# Verificar se a migration está aplicada
npx supabase db pull

# Se necessário, aplicar manualmente
psql -h <HOST> -U postgres -d postgres -f supabase/migrations/20250101000007_create_documentos_tables.sql
```

2. Popular os templates:
```bash
node scripts/seed-templates.js
```

3. Ter dados de teste no banco:
- Pelo menos 1 contrato ativo
- Locatário associado ao contrato
- Imóvel associado ao contrato
- Parcelas criadas (para D8 e D10)

## Teste 1: Gerar D3 - Contrato de Locação

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tipo": "D3",
    "contrato_id": 1
  }'
```

### Via Interface

1. Acesse `/documentos/gerar`
2. Clique no card "D3 - Contrato de Locação"
3. Selecione um contrato no dropdown
4. Clique em "Gerar Documento"
5. Aguarde a geração
6. Clique em "Visualizar PDF" ou "Baixar PDF"

### Resultado Esperado

```json
{
  "success": true,
  "documento": {
    "id": 1,
    "numero_documento": "D3-2025-00001",
    "tipo": "D3",
    "status": "gerado",
    "conteudo_html": "...",
    "modelo_id": 3,
    ...
  }
}
```

O PDF deve conter:
- Título "CONTRATO DE LOCAÇÃO"
- Todas as partes (Locador, Locatário, Fiador se houver)
- Endereço completo do imóvel
- Cláusulas completas
- Assinaturas formatadas

## Teste 2: Gerar D8 - Notificação de Atraso

### Pré-requisito
Ter uma parcela em atraso (status != 'pago')

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tipo": "D8",
    "contrato_id": 1,
    "parcela_id": 5
  }'
```

### Resultado Esperado

O PDF deve conter:
- Título "NOTIFICAÇÃO DE ATRASO DE PAGAMENTO"
- Nome e CPF do locatário
- Endereço do imóvel
- Competência e vencimento
- Dias de atraso calculados
- Valores: principal, multa, juros
- Valor total atualizado
- Avisos legais

## Teste 3: Gerar D1 - Declaração Entrega Contrato

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tipo": "D1",
    "contrato_id": 1
  }'
```

### Resultado Esperado

O PDF deve conter:
- Título "DECLARAÇÃO"
- Lista de locatários
- Itens recebidos (A, B, C)
- Data de devolução
- Assinaturas de todos os locatários

## Teste 4: Gerar D10 - Recibo de Pagamento

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tipo": "D10",
    "contrato_id": 1,
    "parcela_id": 5
  }'
```

### Resultado Esperado

O PDF deve conter:
- Título "RECIBO DE PAGAMENTO"
- Número do recibo
- Valor em destaque
- Dados do pagador
- Discriminação dos valores
- Segunda via destacável

## Teste 5: Listar Documentos

### Via cURL

```bash
# Todos os documentos
curl http://localhost:3000/api/documentos \
  -H "Cookie: YOUR_SESSION_COOKIE"

# Filtrar por tipo
curl "http://localhost:3000/api/documentos?tipo=D3" \
  -H "Cookie: YOUR_SESSION_COOKIE"

# Filtrar por status
curl "http://localhost:3000/api/documentos?status=gerado" \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

### Via Interface

1. Acesse `/documentos`
2. Use os filtros de tipo e status
3. Verifique a lista de documentos
4. Clique no ícone de olho para visualizar
5. Clique no ícone de download para baixar

## Teste 6: Buscar Templates Disponíveis

### Via cURL

```bash
curl http://localhost:3000/api/documentos/templates \
  -H "Cookie: YOUR_SESSION_COOKIE"
```

### Resultado Esperado

```json
{
  "success": true,
  "templates": [
    {
      "tipo": "D1",
      "nome": "Declaração de Entrega de Contrato",
      "descricao": "...",
      "variaveis_esperadas": [...],
      "template_id": 1,
      "versao": 1,
      "ativo": true
    },
    ...
  ]
}
```

## Teste 7: Visualizar PDF Inline

### Via Browser

1. Gere um documento
2. Copie o ID retornado (ex: 1)
3. Acesse: `http://localhost:3000/api/documentos/1/pdf`
4. O PDF deve abrir no navegador

## Teste 8: Baixar PDF

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/1/pdf \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -o documento.pdf
```

### Via Interface

1. Acesse `/documentos`
2. Clique no ícone de download
3. O arquivo deve ser baixado automaticamente

## Teste 9: Gerar Documento com Dados Customizados

### Via cURL

```bash
curl -X POST http://localhost:3000/api/documentos/gerar \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "tipo": "D1",
    "dados_customizados": {
      "locatarios": [
        {
          "nome": "Maria Silva",
          "cpf": "98765432100",
          "rg": "7654321",
          "nacionalidade": "Brasileira",
          "estado_civil": "Casada",
          "profissao": "Médica"
        }
      ],
      "locador": {
        "nome": "Imonstant Gestão"
      },
      "contrato": {
        "numero": "CT-TEST-001",
        "valor_caucao": 3000.00,
        "data_vencimento_caucao": "2025-12-31",
        "data_devolucao_assinado": "2025-12-31"
      },
      "imovel": {
        "endereco": {
          "logradouro": "Av. Teste",
          "numero": "999",
          "bairro": "Centro",
          "cidade": "Fortaleza",
          "estado": "CE",
          "cep": "60000000"
        }
      }
    }
  }'
```

## Teste 10: Testar Todos os 10 Tipos

Execute este script para gerar todos os 10 tipos de documentos:

```bash
#!/bin/bash

# Configurar
API_URL="http://localhost:3000/api/documentos/gerar"
COOKIE="YOUR_SESSION_COOKIE"
CONTRATO_ID=1
PARCELA_ID=5

# D1 - Declaração Entrega Contrato
echo "Gerando D1..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D1\",\"contrato_id\":$CONTRATO_ID}"

# D2 - Ficha Fiador
echo "Gerando D2..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D2\",\"contrato_id\":$CONTRATO_ID}"

# D3 - Contrato
echo "Gerando D3..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D3\",\"contrato_id\":$CONTRATO_ID}"

# D4 - Vistoria Entrada
echo "Gerando D4..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D4\",\"contrato_id\":$CONTRATO_ID}"

# D5 - Vistoria Saída
echo "Gerando D5..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D5\",\"contrato_id\":$CONTRATO_ID}"

# D6 - Débito Automático
echo "Gerando D6..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D6\",\"contrato_id\":$CONTRATO_ID}"

# D7 - Entrega Chaves
echo "Gerando D7..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D7\",\"contrato_id\":$CONTRATO_ID}"

# D8 - Notificação Atraso
echo "Gerando D8..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D8\",\"contrato_id\":$CONTRATO_ID,\"parcela_id\":$PARCELA_ID}"

# D9 - Acordo Rescisão
echo "Gerando D9..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D9\",\"contrato_id\":$CONTRATO_ID}"

# D10 - Recibo
echo "Gerando D10..."
curl -X POST "$API_URL" -H "Cookie: $COOKIE" -H "Content-Type: application/json" \
  -d "{\"tipo\":\"D10\",\"contrato_id\":$CONTRATO_ID,\"parcela_id\":$PARCELA_ID}"

echo "Concluído!"
```

## Checklist de Validação

### Templates
- [ ] Todos os 10 templates estão em `src/lib/templates/`
- [ ] Cada template exporta HTML e variáveis esperadas
- [ ] Index exporta configuração completa

### API
- [ ] POST /api/documentos/gerar funciona
- [ ] GET /api/documentos lista documentos
- [ ] GET /api/documentos/templates lista templates
- [ ] GET /api/documentos/[id] busca documento
- [ ] GET /api/documentos/[id]/pdf visualiza PDF
- [ ] POST /api/documentos/[id]/pdf baixa PDF

### Frontend
- [ ] /documentos lista documentos
- [ ] Filtros funcionam corretamente
- [ ] /documentos/gerar abre wizard
- [ ] Wizard completa 3 etapas
- [ ] Preview funciona
- [ ] Download funciona

### Banco de Dados
- [ ] Migration aplicada
- [ ] Templates populados (10 registros)
- [ ] Documentos sendo salvos
- [ ] Relacionamentos corretos

### Geração de PDF
- [ ] Puppeteer instalado
- [ ] PDFs sendo gerados
- [ ] CSS renderizado corretamente
- [ ] Fontes e formatação OK

## Problemas Comuns

### 1. Erro "Template não encontrado"
**Solução:** Execute `node scripts/seed-templates.js`

### 2. Erro do Puppeteer
**Solução:**
```bash
sudo apt-get install -y libgbm1 libnss3 libxss1 libasound2
```

### 3. Dados não preenchidos
**Solução:** Verifique se o contrato tem locatário e imóvel associados

### 4. PDF em branco
**Solução:** Verifique se o HTML foi interpolado corretamente

### 5. Erro de autenticação
**Solução:** Certifique-se de estar autenticado e com cookie de sessão válido

## Métricas de Sucesso

Após implementação completa, você deve conseguir:

1. ✅ Gerar os 10 tipos de documentos
2. ✅ Visualizar PDFs no navegador
3. ✅ Baixar PDFs formatados
4. ✅ Buscar documentos gerados
5. ✅ Filtrar por tipo e status
6. ✅ Ver dados interpolados corretamente
7. ✅ Templates versionados no banco
8. ✅ Numeração sequencial funcionando
9. ✅ Relacionamentos preservados
10. ✅ Interface intuitiva e responsiva
