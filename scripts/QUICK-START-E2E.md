# Quick Start Guide - E2E Tests

## 🚀 Começar em 3 Passos

### 1. Configurar Variáveis de Ambiente

Certifique-se de que `.env.local` contém:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...seu-service-role-key
```

### 2. Executar seu Primeiro Teste

```bash
# Teste POC: Pessoas (11+ testes)
npm run test:e2e:pessoas
```

Isso irá:
- Criar/ler/atualizar/deletar registros de Pessoas
- Testar validações
- Testar filtros
- Gerar relatório HTML
- Abrir relatório no navegador automaticamente

### 3. Ver Resultados

O relatório será gerado em:
```
scripts/reports/test-pessoas.html
```

## 📊 Comandos Essenciais

```bash
# Executar TODOS os testes (Master)
npm run test:e2e:all

# Testes individuais (rápido)
npm run test:e2e:pessoas
npm run test:e2e:locadores
npm run test:e2e:imoveis
npm run test:e2e:contratos

# Apenas cadastros básicos
npm run test:e2e:cadastros

# Ver relatório master
open scripts/reports/master-e2e-report.html
```

## ✅ Checklist Pré-Execução

- [ ] Supabase está rodando (local ou cloud)
- [ ] Variáveis de ambiente configuradas
- [ ] Tabelas existem no banco de dados
- [ ] Service role key tem permissões corretas

## 📁 Estrutura Rápida

```
scripts/
├── lib/
│   ├── test-framework.ts          # Framework reutilizável
│   └── mock-data-generator.ts     # Gera dados de teste
├── tests/
│   ├── cadastros/                 # Testes básicos
│   ├── imoveis/                   # Testes com relacionamentos
│   └── contratos/                 # Workflow completo
├── reports/                       # Relatórios HTML
└── run-all-e2e-tests.ts          # Master runner
```

## 🎯 O que Esperar

### Console Output:
```
🚀 Iniciando testes E2E: Pessoas CRUD

📝 Teste 1: Criar Pessoa Física...
   ✅ Pessoa Física - CREATE (245ms)

📝 Teste 2: Listar Pessoas...
   ✅ Pessoas - LIST (123ms)

...

==========================================================
📊 RESUMO DOS TESTES
==========================================================
✅ Aprovados: 10/11
❌ Falharam: 1/11
⏱️  Tempo total: 2547ms
📈 Taxa de sucesso: 90.9%
==========================================================

✅ Relatório HTML gerado: scripts/reports/test-pessoas.html
🌐 Relatório aberto no navegador!
```

### Relatório HTML:
- Dashboard visual com métricas
- Cards coloridos por status (verde = sucesso, vermelho = falha)
- Detalhes de cada teste
- Tempos de execução
- Dados enviados/retornados
- Erros detalhados (quando aplicável)

## 🐛 Problemas Comuns

### "Supabase URL not defined"
```bash
# Adicione no .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### "Permission denied"
- Certifique-se de usar SERVICE_ROLE_KEY (não anon key)
- Service role bypassa RLS (Row Level Security)

### "Table not found"
```bash
# Certifique-se de que as migrations foram aplicadas:
supabase db push
```

## 🎓 Próximos Passos

1. ✅ Execute `npm run test:e2e:pessoas` (POC)
2. ✅ Veja o relatório HTML gerado
3. ✅ Execute outros testes individuais
4. ✅ Execute o master runner: `npm run test:e2e:all`
5. 📚 Leia `README-E2E-TESTS.md` para detalhes completos

## 💡 Dicas

- Use `test:e2e:all` para CI/CD
- Use testes individuais durante desenvolvimento
- Relatórios ficam em `scripts/reports/`
- Framework é reutilizável para novos módulos
- Mock data é realista e completo

## 📞 Help

- Veja exemplos em: `scripts/tests/cadastros/test-pessoas.ts`
- Padrão original: `scripts/test-templates.ts`
- Documentação completa: `scripts/README-E2E-TESTS.md`

---

**Comece agora**: `npm run test:e2e:pessoas` 🚀
