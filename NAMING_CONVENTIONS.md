# Convenções de Nomenclatura do Banco de Dados

## ⚠️ IMPORTANTE: Campos de Timestamp

Atualmente, o projeto tem uma **inconsistência intencional** nos nomes dos campos de timestamp:

### Tabelas com `created_at` e `updated_at`:
- `pessoa`
- `endereco`
- `imovel`
- `empresa_cliente`
- `locador`
- `locatario`
- `fiador`
- `profissao`
- `tipo_imovel`
- `tipo_locacao`
- E todas as outras tabelas base

### Tabelas com `criado_em` e `atualizado_em`:
- ✅ **APENAS** `contrato_locacao`

## Como Evitar Erros

### 1. Ao escrever queries Supabase:

```typescript
// ❌ ERRADO - para a maioria das tabelas
.order('criado_em', { ascending: false })

// ✅ CORRETO - para a maioria das tabelas
.order('created_at', { ascending: false })

// ✅ CORRETO - apenas para contrato_locacao
.order('criado_em', { ascending: false })
```

### 2. Sempre use os tipos gerados:

```typescript
import { Database } from '@/types/supabase'

// Os tipos TypeScript vão te avisar se usar o campo errado
const { data } = await supabase
  .from('imovel')
  .select('*')
  .order('created_at') // TypeScript valida isso ✅
```

### 3. Regenerar tipos após mudanças no banco:

```bash
# Quando mudar o schema do banco, sempre regenere os tipos:
npx supabase gen types typescript --linked > temp.ts
# Remove a primeira linha "Initialising login role..."
tail -n +2 temp.ts > src/types/supabase.ts
rm temp.ts
```

### 4. Sempre verifique o build:

```bash
npm run build
```

O TypeScript vai detectar erros de tipos durante o build.

## Por que essa inconsistência?

A tabela `contrato_locacao` foi migrada mais recentemente para usar nomes em português (`criado_em`/`atualizado_em`), mas as tabelas base mantiveram os nomes em inglês (`created_at`/`updated_at`) por compatibilidade e para evitar breaking changes.

## Plano Futuro

Eventualmente, todas as tabelas serão migradas para usar `criado_em`/`atualizado_em` de forma consistente. Até lá, **consulte esta documentação** antes de escrever queries!

## Checklist para PRs

Antes de fazer commit:

- [ ] Verifiquei se estou usando o campo correto (`created_at` vs `criado_em`)
- [ ] Rodei `npm run build` com sucesso
- [ ] Os tipos TypeScript estão validando corretamente
- [ ] Testei as queries no ambiente de desenvolvimento
