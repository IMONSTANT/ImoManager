'# Diretrizes para Agentes AI - Beeing Rich POC

## 🎯 Filosofia de Desenvolvimento

Este projeto segue rigorosamente a metodologia **Test-Driven Development (TDD)** e práticas de desenvolvimento profissional.

---

## 📋 Workflow Obrigatório

### 1. **SEMPRE Escrever Testes Primeiro (TDD)**

Antes de implementar qualquer funcionalidade:

1. ✅ **Escrever os testes PRIMEIRO**
2. ✅ **Executar os testes** (devem falhar - Red)
3. ✅ **Implementar o código** até os testes passarem (Green)
4. ✅ **Refatorar** se necessário (Refactor)
5. ✅ **Executar os testes novamente** para garantir que continuam passando

**Comandos de Teste:**
```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes unitários
npm run test:unit
```

### 2. **SEMPRE Executar Build e Corrigir Erros**

Após os testes passarem:

1. ✅ **Executar o build** do projeto
2. ✅ **Corrigir todos os erros de TypeScript**
3. ✅ **Corrigir todos os erros de linting**
4. ✅ **Garantir que o build passe sem erros**

**Comandos de Build:**
```bash
# Build completo
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint automaticamente
npm run lint:fix
```

### 3. **Ciclo Completo de Desenvolvimento**

```
┌─────────────────────────────────────────────────┐
│  1. Escrever Testes (Red)                       │
├─────────────────────────────────────────────────┤
│  2. Executar: npm test                          │
│     ❌ Testes devem falhar                      │
├─────────────────────────────────────────────────┤
│  3. Implementar Código (Green)                  │
├─────────────────────────────────────────────────┤
│  4. Executar: npm test                          │
│     ✅ Testes devem passar                      │
├─────────────────────────────────────────────────┤
│  5. Executar: npm run build                     │
│     ✅ Build deve passar                        │
├─────────────────────────────────────────────────┤
│  6. Refatorar (se necessário)                   │
├─────────────────────────────────────────────────┤
│  7. Executar: npm test && npm run build         │
│     ✅ Tudo deve passar                         │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Especialização CSS/Tailwind

### Usar Agente Especializado para CSS

**SEMPRE** que trabalhar com estilização, UI/UX, ou componentes visuais:

- ✅ **Usar o agente `tailwind-refactor-specialist`**
- ✅ Seguir padrões do **Tailwind 4**
- ✅ Seguir padrões do **shadcn/ui**
- ✅ Implementar design patterns profissionais
- ✅ Garantir responsividade (mobile-first)
- ✅ Garantir acessibilidade (WCAG)

**Quando invocar:**
- Criando novos componentes de UI
- Refatorando estilos existentes
- Melhorando design visual
- Implementando dark mode
- Ajustando responsividade

---

## 🗄️ Banco de Dados e Migrations

### ⚠️ IMPORTANTE: Este projeto usa Supabase REMOTO

**NÃO há instância local do Supabase neste projeto.**

Todas as operações de banco de dados são feitas diretamente no Supabase remoto (produção/staging).

### Workflow de Migrations

Quando criar ou modificar migrations do Supabase:

1. ✅ **Criar a migration**
2. ✅ **Aplicar no banco remoto**
3. ✅ **Commit a migration**
4. ✅ **PUSH IMEDIATAMENTE para o repositório remoto**

```bash
# Criar nova migration
supabase migration new nome_da_migration

# Editar o arquivo SQL gerado em supabase/migrations/

# Aplicar migration no banco REMOTO (via Supabase Dashboard ou CLI)
# ⚠️ CUIDADO: Isso afeta o banco de produção/staging

# Commitar a migration
git add supabase/migrations/*
git commit -m "feat: add migration for [feature]"

# PUSH OBRIGATÓRIO - Sincronizar com o time
git push origin [branch-name]
```

### Geração de Types do Supabase

Após aplicar migrations no banco remoto, atualizar os types TypeScript:

```bash
# Gerar types a partir do banco REMOTO
npx supabase gen types typescript --project-id [PROJECT_ID] > src/types/supabase.ts

# OU usando a conexão configurada
npx supabase gen types typescript --linked > src/types/supabase.ts

# Commitar os types atualizados
git add src/types/supabase.ts
git commit -m "chore: update supabase types"
git push
```

**⚠️ CRÍTICO:**
- Migrations devem ser versionadas e compartilhadas imediatamente
- NUNCA aplicar migrations destrutivas sem backup
- SEMPRE testar migrations em ambiente de staging primeiro
- Coordenar com o time antes de aplicar migrations que afetam dados existentes

---

## 📁 Estrutura de Testes

### Localização dos Testes

```
tests/
├── unit/                    # Testes unitários
│   ├── components/          # Testes de componentes React
│   ├── hooks/              # Testes de custom hooks
│   ├── lib/                # Testes de utilitários
│   └── validations/        # Testes de schemas Zod
├── integration/            # Testes de integração
└── e2e/                    # Testes end-to-end (Playwright)
```

### Padrão de Nomenclatura

```
[ComponentName].test.tsx
[hookName].test.ts
[functionName].test.ts
```

### Exemplo de Teste de Componente

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { EnderecoForm } from './endereco-form'

describe('EnderecoForm', () => {
  it('deve renderizar todos os campos obrigatórios', () => {
    render(<EnderecoForm />)

    expect(screen.getByLabelText(/cep/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/logradouro/i)).toBeInTheDocument()
    // ... mais assertions
  })

  it('deve validar CEP inválido', async () => {
    render(<EnderecoForm />)

    const cepInput = screen.getByLabelText(/cep/i)
    fireEvent.change(cepInput, { target: { value: '12345' } })
    fireEvent.submit(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByText(/cep inválido/i)).toBeInTheDocument()
  })
})
```

---

## 🔄 Workflow com Git

### Commits Semânticos

Seguir [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: adiciona CRUD de endereços
fix: corrige validação de CEP
test: adiciona testes para EnderecoForm
refactor: melhora performance do hook useEnderecos
docs: atualiza documentação de migrations
style: ajusta espaçamento no formulário
chore: atualiza dependências
```

### Antes de Commit

```bash
# 1. Executar testes
npm test

# 2. Executar build
npm run build

# 3. Executar linting
npm run lint

# 4. Se tudo passar, commitar
git add .
git commit -m "feat: [descrição]"
git push
```

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **UI:** React + shadcn/ui
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod
- **State:** React Query (TanStack Query)
- **Database:** Supabase (PostgreSQL)
- **Testing:** Vitest + Testing Library
- **E2E:** Playwright

---

## ✅ Checklist para Features

Antes de considerar uma feature completa:

- [ ] Testes unitários escritos e passando
- [ ] Testes de integração (se aplicável)
- [ ] Build passando sem erros
- [ ] Type checking sem erros
- [ ] Linting sem erros
- [ ] UI revisada por `tailwind-refactor-specialist`
- [ ] Responsividade testada (mobile, tablet, desktop)
- [ ] Acessibilidade verificada
- [ ] Migrations commitadas e pushadas (se aplicável)
- [ ] Documentação atualizada
- [ ] Code review realizado

---

## 🚫 NÃO Fazer

- ❌ **NUNCA** implementar código sem testes primeiro
- ❌ **NUNCA** commitar código com testes falhando
- ❌ **NUNCA** commitar código com erros de build
- ❌ **NUNCA** criar migrations sem dar push
- ❌ **NUNCA** ignorar warnings de TypeScript
- ❌ **NUNCA** usar `any` sem justificativa
- ❌ **NUNCA** fazer styling complexo sem o agente especializado

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [React Hook Form Docs](https://react-hook-form.com)
- [Zod Docs](https://zod.dev)
- [Vitest Docs](https://vitest.dev)
- [Testing Library Docs](https://testing-library.com)
- [Supabase Docs](https://supabase.com/docs)

---

## 🎯 Lembre-se

> **"Se não está testado, não funciona."**
>
> **"Se o build falha, não está pronto."**
>
> **"Se a migration não foi pushada, não existe."**

**Qualidade acima de velocidade. Sempre.**
