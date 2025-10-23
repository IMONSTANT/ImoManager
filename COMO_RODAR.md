# 🚀 Como Rodar o Sistema Imobiliário

## 📋 Pré-requisitos

- Node.js 20+ instalado
- Conta no Supabase (ou PostgreSQL local)
- Git

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
cd user-management-system
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais do Supabase:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
```

### 3. Aplicar Migrations do Banco de Dados

#### Opção A: Usando Supabase CLI (Recomendado)

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login no Supabase
supabase login

# Linkar com seu projeto
supabase link --project-ref seu_project_id

# Aplicar migrations
supabase db push
```

#### Opção B: Manualmente via Dashboard do Supabase

1. Acesse o [Dashboard do Supabase](https://app.supabase.com)
2. Vá em **SQL Editor**
3. Copie e execute cada migration na ordem:
   - `supabase/migrations/20250101000000_create_base_tables.sql`
   - `supabase/migrations/20250101000001_create_pessoa_tables.sql`
   - `supabase/migrations/20250101000002_create_imovel_empresa_tables.sql`
   - `supabase/migrations/20250101000003_create_contrato_locacao_table.sql`
   - `supabase/migrations/20250101000004_seed_reference_data.sql`
   - `supabase/migrations/20250101000005_enable_rls_policies.sql`

### 4. Verificar Instalação do Banco

Execute no SQL Editor do Supabase:

```sql
-- Deve retornar 20 tipos de imóveis
SELECT COUNT(*) FROM tipo_imovel;

-- Deve retornar 10 tipos de locação
SELECT COUNT(*) FROM tipo_locacao;

-- Deve retornar 65+ profissões
SELECT COUNT(*) FROM profissao;

-- Listar todas as tabelas criadas
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

Você deve ver as seguintes tabelas:
- `contrato_locacao`
- `empresa_cliente`
- `endereco`
- `fiador`
- `historico_reajuste`
- `imovel`
- `locador`
- `locatario`
- `pessoa`
- `profissao`
- `tipo_imovel`
- `tipo_locacao`

## 🏃 Rodar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Modo Produção

```bash
npm run build
npm start
```

## 🎯 Acessar o Sistema Imobiliário

1. **Cadastre-se / Login**
   - Vá para `/login` ou `/register`
   - Crie uma conta ou faça login

2. **Acesse o Dashboard Imobiliário**
   - Após login, vá para `/dashboard/imobiliaria`
   - Você verá o dashboard com KPIs e estatísticas

3. **Páginas Disponíveis**
   - **Dashboard**: `/dashboard/imobiliaria`
   - **Imóveis**: `/dashboard/imobiliaria/imoveis`
   - **Contratos**: `/dashboard/imobiliaria/contratos` (em desenvolvimento)
   - **Pessoas**: `/dashboard/imobiliaria/pessoas` (em desenvolvimento)
   - **Empresas**: `/dashboard/imobiliaria/empresas` (em desenvolvimento)

## 📊 Estrutura de Dados

### Fluxo de Cadastro Recomendado

1. **Endereços**
   - Cadastre endereços que serão usados por pessoas e imóveis

2. **Pessoas**
   - Cadastre pessoas físicas (nome, CPF, contato, etc.)

3. **Locadores**
   - Vincule pessoas ao papel de locador
   - Pode ser PF ou PJ (CNPJ)

4. **Imóveis**
   - Cadastre imóveis vinculando:
     - Endereço
     - Locador (proprietário)
     - Tipo de imóvel
     - Características (quartos, banheiros, área, etc.)
     - Valores (aluguel, condomínio, IPTU)

5. **Locatários**
   - Vincule pessoas ao papel de locatário
   - Adicione renda mensal e referências

6. **Fiadores** (Opcional)
   - Vincule pessoas ao papel de fiador
   - Adicione patrimônio estimado

7. **Contratos**
   - Crie contratos vinculando:
     - Imóvel
     - Locatário
     - Fiador (opcional)
     - Datas e valores
     - Tipo de locação

## 🧪 Testar com Dados de Exemplo

### Criar Dados de Teste via SQL

```sql
-- 1. Criar endereço
INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, uf)
VALUES ('60000000', 'Rua Exemplo', '100', 'Centro', 'Fortaleza', 'CE')
RETURNING id;

-- 2. Criar pessoa
INSERT INTO pessoa (nome, cpf, email, telefone, endereco_id)
VALUES ('João Silva', '12345678901', 'joao@email.com', '85999999999', 1)
RETURNING id;

-- 3. Criar locador
INSERT INTO locador (pessoa_id, tipo_pessoa)
VALUES (1, 'fisica')
RETURNING id;

-- 4. Criar imóvel
INSERT INTO imovel (
  endereco_id, locador_id, tipo_imovel_id,
  valor_aluguel, quartos, banheiros, disponivel
)
VALUES (1, 1, 1, 1500.00, 3, 2, true)
RETURNING id;
```

## 🔍 Troubleshooting

### Erro: "relation does not exist"

- Verifique se todas as migrations foram aplicadas corretamente
- Execute as migrations na ordem correta

### Erro: "insufficient_privilege" ou "permission denied"

- Verifique as RLS policies no Supabase
- Certifique-se de estar autenticado
- Verifique se o usuário tem permissões necessárias

### Erro de CORS no Supabase

- Verifique se a URL do projeto está correta no `.env.local`
- Adicione `localhost:3000` nas configurações de URL permitidas no Supabase

### Dashboard não carrega dados

1. Verifique o console do browser para erros
2. Verifique se há dados no banco:
   ```sql
   SELECT COUNT(*) FROM imovel;
   SELECT COUNT(*) FROM contrato_locacao;
   ```
3. Verifique se as RLS policies estão corretas

## 📝 Funcionalidades Implementadas

### ✅ Backend Completo

- [x] 6 Migrations do banco de dados
- [x] 12 Tabelas relacionadas
- [x] Seeds com dados de referência
- [x] Funções PostgreSQL (validação CPF, formatação, etc.)
- [x] Views para queries complexas
- [x] Triggers automáticos (updated_at, normalizações)
- [x] RLS Policies de segurança

### ✅ Types & Validações

- [x] 65+ Types TypeScript
- [x] Schemas Zod para todos os formulários
- [x] Formatadores (CPF, CNPJ, CEP, moeda, data)
- [x] Validadores (algoritmos de CPF/CNPJ)

### ✅ API Layer

- [x] Operações CRUD completas para todas as entidades
- [x] Queries otimizadas com joins
- [x] Filtros avançados
- [x] Paginação
- [x] Busca e pesquisa

### ✅ React Hooks

- [x] 40+ hooks React Query customizados
- [x] Cache management automático
- [x] Mutations com invalidação inteligente
- [x] Loading e error states

### ✅ UI Components

- [x] Dashboard com KPIs
- [x] Alertas de contratos vencendo
- [x] Tabela de imóveis com filtros
- [x] Cards de acesso rápido
- [x] Loading skeletons
- [x] Error handling
- [x] Design responsivo (mobile-friendly)

### 🚧 Em Desenvolvimento

- [ ] Formulários de cadastro completos
- [ ] Upload de imagens de imóveis
- [ ] Gestão de documentos (contratos PDF)
- [ ] Relatórios e exportação
- [ ] Sistema de notificações
- [ ] E-mails automatizados
- [ ] Páginas de detalhes completas

## 🎨 Tecnologias Usadas

- **Frontend**: Next.js 16, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Database**: Supabase (PostgreSQL 15+)
- **State**: React Query 5, Zustand
- **Forms**: React Hook Form 7, Zod 4
- **Icons**: Lucide React

## 📚 Documentação Adicional

- [README Principal](./SISTEMA_IMOBILIARIO_README.md)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do navegador (Console e Network)
2. Verifique os logs do Supabase
3. Consulte a documentação técnica

## 🔐 Segurança

- Todas as tabelas têm RLS habilitado
- Apenas usuários autenticados podem acessar dados
- Soft delete implementado (dados nunca são realmente apagados)
- Auditoria com timestamps em todas as tabelas

---

**Sistema desenvolvido com ❤️ usando Next.js, React, TypeScript e Supabase**
