# Sistema de Gestão Imobiliária

## 📋 Resumo do Projeto

Sistema completo de gestão imobiliária desenvolvido com Next.js 16, React 19, TypeScript, Tailwind CSS e Supabase (PostgreSQL), seguindo as melhores práticas de desenvolvimento e design profissional.

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 16.0, React 19.2, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui (Radix UI)
- **Backend/Database**: Supabase (PostgreSQL 15+)
- **State Management**: React Query (TanStack Query 5), Zustand
- **Forms**: React Hook Form 7 + Zod 4
- **Testes**: Vitest, Playwright, Testing Library

## 📊 Estrutura do Banco de Dados

### Entidades Principais

1. **pessoa** - Pessoas físicas do sistema
2. **endereco** - Endereços completos
3. **profissao** - Catálogo de profissões
4. **locador** - Proprietários que alugam imóveis
5. **locatario** - Inquilinos que alugam imóveis
6. **fiador** - Fiadores de contratos
7. **tipo_imovel** - Tipos de imóveis (Apartamento, Casa, etc.)
8. **imovel** - Imóveis disponíveis para locação
9. **tipo_locacao** - Tipos de locação (Residencial, Comercial, etc.)
10. **contrato_locacao** - Contratos de locação
11. **historico_reajuste** - Histórico de reajustes de contratos
12. **empresa_cliente** - Empresas clientes do sistema

### Correções Implementadas

✅ **Corrigido**: PK de `contrato_locacao` agora é apenas `id` (antes era PRIMARY(id, valor))

✅ **Corrigido**: Relacionamento `tipo_imovel` → `imovel` (FK movida para `imovel.tipo_imovel_id`)

✅ **Corrigido**: FK `empresa_cliente.imovel_id` → `imovel.id` criada

✅ **Implementado**: Todas as validações CHECK (valores monetários >= 0, formatos de CPF/CNPJ/CEP)

✅ **Implementado**: Soft delete com campo `deleted_at` em todas as tabelas

✅ **Implementado**: Auditoria com `created_at` e `updated_at` (com trigger automático)

## 🗂️ Estrutura de Arquivos Criados

```
user-management-system/
├── supabase/
│   └── migrations/
│       ├── 20250101000000_create_base_tables.sql
│       ├── 20250101000001_create_pessoa_tables.sql
│       ├── 20250101000002_create_imovel_empresa_tables.sql
│       ├── 20250101000003_create_contrato_locacao_table.sql
│       ├── 20250101000004_seed_reference_data.sql
│       └── 20250101000005_enable_rls_policies.sql
│
├── src/
│   ├── types/
│   │   └── imobiliaria.ts (65+ types e interfaces)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── imobiliaria.ts (operações CRUD completas)
│   │   ├── utils/
│   │   │   └── formatters.ts (formatação e validação)
│   │   └── validations/
│   │       └── imobiliaria.ts (schemas Zod)
│   │
│   └── hooks/
│       └── useImobiliaria.ts (React Query hooks)
```

## 📦 Migrations Criadas

### Migration 1: Base Tables
- **profissao**: Catálogo de profissões
- **tipo_locacao**: Tipos de locação
- **tipo_imovel**: Tipos de imóveis
- **endereco**: Endereços com validação de CEP

### Migration 2: Pessoa Tables
- **pessoa**: Dados pessoais completos
- **locador**: Com suporte a PF e PJ
- **locatario**: Com dados financeiros
- **fiador**: Com patrimônio estimado
- Funções auxiliares: `format_cpf`, `validate_cpf`, `normalize_cpf`

### Migration 3: Imovel & Empresa Tables
- **imovel**: Propriedades completas com características
- **empresa_cliente**: Empresas com CNPJcompleto
- Funções auxiliares: `format_cnpj`, `format_cep`, `generate_codigo_imovel`
- Views: `view_imoveis_completos`

### Migration 4: Contrato Locacao
- **contrato_locacao**: Contratos completos com todas as regras
- **historico_reajuste**: Histórico de reajustes
- Enum `status_contrato`
- Triggers: validação de sobreposição, atualização de disponibilidade
- Views: `view_contratos_ativos`, `view_contratos_vencendo`

### Migration 5: Seeds
- 20 tipos de imóveis
- 10 tipos de locação
- 65+ profissões

### Migration 6: RLS Policies
- Políticas de segurança para todas as tabelas
- Acesso controlado para usuários autenticados

## 🎨 Features Implementadas (Backend)

### Validações
- ✅ CPF (validação de algoritmo + formatação)
- ✅ CNPJ (validação de algoritmo + formatação)
- ✅ CEP (formato e validação)
- ✅ E-mail (formato)
- ✅ Telefone (10 ou 11 dígitos)
- ✅ Valores monetários (não negativos)
- ✅ Datas (consistência entre início e fim de contrato)

### Formatadores
- ✅ CPF: `123.456.789-01`
- ✅ CNPJ: `12.345.678/0001-90`
- ✅ CEP: `12345-678`
- ✅ Telefone: `(85) 98765-4321`
- ✅ Moeda: `R$ 1.234,56`
- ✅ Data: `22/10/2025`
- ✅ Área: `120,50 m²`
- ✅ Percentual: `15,5%`

### Operações CRUD
Implementadas para todas as entidades:
- ✅ Pessoa (com busca por nome/CPF/email)
- ✅ Locador / Locatário / Fiador
- ✅ Endereço (com busca por CEP)
- ✅ Imóvel (com filtros avançados)
- ✅ Empresa Cliente
- ✅ Contrato de Locação (com regras de negócio)

### React Query Hooks
Hooks customizados para:
- ✅ Queries (busca de dados)
- ✅ Mutations (criação, atualização, deleção)
- ✅ Cache management automático
- ✅ Refetch inteligente

### Business Logic
- ✅ Validação de sobreposição de contratos no mesmo imóvel
- ✅ Atualização automática de disponibilidade de imóveis
- ✅ Cálculo de status de contrato baseado em datas
- ✅ Geração automática de códigos (imóveis, contratos)
- ✅ Soft delete em todas as entidades

## 📱 Próximos Passos (Frontend)

### Componentes a Criar

1. **Dashboard Principal**
   - KPIs (imóveis, contratos, receita)
   - Gráficos (ocupação, tipos de imóveis)
   - Alertas (contratos vencendo)

2. **CRUD Pessoas**
   - Listagem com busca e filtros
   - Formulário de cadastro/edição
   - Visualização detalhada
   - Criação de locador/locatário/fiador

3. **CRUD Imóveis**
   - Listagem em cards ou tabela
   - Filtros avançados (tipo, valor, quartos, bairro)
   - Formulário com upload de fotos
   - Visualização com galeria

4. **CRUD Contratos**
   - Listagem com status visual
   - Filtros por status, data, imóvel
   - Formulário de criação de contrato
   - Timeline de contrato
   - Gestão de reajustes

5. **CRUD Empresas Cliente**
   - Listagem e busca
   - Formulário de cadastro
   - Vinculação com imóveis

6. **Relatórios**
   - Receita mensal
   - Contratos por status
   - Imóveis por tipo
   - Exportação PDF/Excel

## 🎯 Padrões e Boas Práticas Seguidos

### Banco de Dados
✅ MySQL 8.0+ padrões (InnoDB, utf8mb4)
✅ Nomenclatura consistente (snake_case)
✅ PKs BIGINT AUTO_INCREMENT
✅ Índices estratégicos para performance
✅ Foreign Keys com ON DELETE/UPDATE apropriadas
✅ CHECK constraints para validações básicas
✅ Triggers para automação (updated_at, normalização)
✅ Views para queries complexas
✅ Funções utilitárias em PL/pgSQL

### TypeScript
✅ Types completos para todas as entidades
✅ Interfaces segregadas (Input, Output, Completo)
✅ Enums para valores fixos
✅ Utility types para filtros e paginação

### React/Next.js
✅ Client components com 'use client'
✅ React Query para data fetching
✅ Hooks customizados reutilizáveis
✅ Validação com Zod
✅ Formatação consistente

### Segurança
✅ RLS (Row Level Security) habilitado
✅ Policies para authenticated users
✅ Soft delete para auditoria
✅ Validações em múltiplas camadas

## 📖 Como Usar

### 1. Aplicar as Migrations

```bash
cd user-management-system
# Certifique-se de que o Supabase está configurado
supabase db push
```

### 2. Verificar Seeds

```sql
-- Deve retornar 20 tipos de imóveis
SELECT COUNT(*) FROM tipo_imovel;

-- Deve retornar 10 tipos de locação
SELECT COUNT(*) FROM tipo_locacao;

-- Deve retornar 65+ profissões
SELECT COUNT(*) FROM profissao;
```

### 3. Testar Queries

```typescript
import { useImoveis, useContratos, useDashboardStats } from '@/hooks/useImobiliaria'

// Em um componente
function Dashboard() {
  const { data: stats } = useDashboardStats()
  const { data: imoveis } = useImoveis({ disponivel: true })
  const { data: contratos } = useContratos({ status: 'ativo' })

  return (
    // Seu JSX aqui
  )
}
```

## 🔧 Funcionalidades Especiais

### Busca de CEP
O sistema pode ser integrado com a API ViaCEP para busca automática de endereços:

```typescript
import { useSearchEnderecoByCEP } from '@/hooks/useImobiliaria'

const { data: endereco } = useSearchEnderecoByCEP('60000000')
```

### Dashboard Analytics
```typescript
const { data: stats } = useDashboardStats()

// Retorna:
// - total_imoveis
// - imoveis_disponiveis
// - imoveis_ocupados
// - total_contratos_ativos
// - contratos_vencendo_60_dias
// - receita_mensal_total
// - valor_medio_aluguel
// - taxa_ocupacao
```

### Filtros Avançados de Imóveis
```typescript
const filtros: ImovelFiltros = {
  tipo_imovel_id: 1,
  disponivel: true,
  valor_min: 1000,
  valor_max: 5000,
  quartos_min: 2,
  bairro: 'Meireles'
}

const { data } = useImoveis(filtros)
```

## 🎨 Tailwind CSS Classes Recomendadas

Para manter consistência visual profissional:

```tsx
// Cards
<div className="rounded-lg border bg-card text-card-foreground shadow-sm">

// Formulários
<input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />

// Botões
<button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">

// Badges de Status
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
```

## 📚 Documentação Adicional

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## ✅ Status do Projeto

### Concluído ✓
- [x] Arquitetura do banco de dados
- [x] Migrations completas
- [x] Seeds de dados de referência
- [x] Types TypeScript completos
- [x] Operações CRUD (API layer)
- [x] React Query hooks
- [x] Validações Zod
- [x] Formatadores e utilitários
- [x] RLS Policies

### Em Andamento 🚧
- [ ] Componentes UI (Dashboard, CRUD interfaces)
- [ ] Páginas Next.js
- [ ] Navegação e layout
- [ ] Upload de arquivos (fotos de imóveis, contratos)
- [ ] Relatórios e exportação

### Planejado 📋
- [ ] Integração com API ViaCEP
- [ ] Sistema de notificações
- [ ] E-mail automatizado (contratos vencendo)
- [ ] App mobile (React Native)
- [ ] Testes automatizados completos

## 🤝 Contribuindo

Este é um sistema em desenvolvimento ativo. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Sistema proprietário para gestão imobiliária.

---

**Desenvolvido com ❤️ usando Next.js, React, TypeScript e Supabase**
