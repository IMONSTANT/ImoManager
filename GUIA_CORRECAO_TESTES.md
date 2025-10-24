# GUIA DE CORREÇÃO DOS TESTES FALHANDO

**Objetivo:** Levar os testes de 76% → 90%+ de aprovação

---

## PROBLEMA 1: Radix UI PointerCapture

### Erro
```
TypeError: target.hasPointerCapture is not a function
```

### Causa
O jsdom (ambiente de teste do Vitest) não implementa a API PointerCapture necessária para componentes Radix UI como Select e RadioGroup.

### Solução

**1. Editar arquivo de setup:**
```bash
vim /home/jonker/Documents/beeing-rich-poc/user-management-system/tests/setup.ts
```

**2. Adicionar polyfills:**
```typescript
// Adicionar ao final do arquivo tests/setup.ts

// Polyfill para Radix UI PointerCapture
if (typeof Element !== 'undefined') {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = function() { return false; };
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function() {};
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function() {};
  }
}

// Polyfill para scrollIntoView
if (typeof Element !== 'undefined') {
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = function() {};
  }
}

// Mock de ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

**3. Executar testes novamente:**
```bash
npm test -- tests/unit/components/locacao/DadosFinanceirosForm.test.tsx
```

**Impacto esperado:** +30 testes passando

---

## PROBLEMA 2: Mocks do Supabase Incompletos

### Erro
```
Cannot read properties of undefined (reading 'eq')
```

### Causa
Os mocks do Supabase não cobrem todos os cenários de queries usados nos componentes.

### Solução

**1. Criar arquivo de mock centralizado:**
```bash
mkdir -p /home/jonker/Documents/beeing-rich-poc/user-management-system/tests/mocks
vim /home/jonker/Documents/beeing-rich-poc/user-management-system/tests/mocks/supabase.ts
```

**2. Implementar mock completo:**
```typescript
import { vi } from 'vitest';

// Dados mockados
const MOCK_IMOVEIS = [
  {
    id: 'imovel-1',
    codigo_interno: 'AP001',
    tipo_imovel: 'apartamento',
    endereco: {
      logradouro: 'Rua Teste',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01000-000',
    },
    valor_aluguel: 1500,
    caracteristicas: {
      quartos: 2,
      banheiros: 1,
      vagas: 1,
      area: 60,
    },
  },
  // Adicionar mais imóveis conforme necessário
];

const MOCK_PESSOAS = [
  {
    id: 'pessoa-1',
    tipo_pessoa: 'fisica',
    nome: 'João Silva',
    cpf_cnpj: '123.456.789-00',
    email: 'joao@email.com',
    telefone: '(11) 98765-4321',
  },
];

// Mock factory
export function createSupabaseMock() {
  return {
    from: vi.fn((table: string) => {
      const mockData = {
        imovel: MOCK_IMOVEIS,
        pessoa: MOCK_PESSOAS,
        contrato_locacao: [],
        endereco: [],
      }[table] || [];

      return {
        select: vi.fn((columns?: string) => ({
          eq: vi.fn((column: string, value: any) => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: mockData.find((item: any) => item[column] === value) || null,
                error: null
              })
            ),
            then: vi.fn((resolve) =>
              resolve({
                data: mockData.filter((item: any) => item[column] === value),
                error: null
              })
            ),
          })),
          neq: vi.fn((column: string, value: any) => ({
            then: vi.fn((resolve) =>
              resolve({
                data: mockData.filter((item: any) => item[column] !== value),
                error: null
              })
            ),
          })),
          in: vi.fn((column: string, values: any[]) => ({
            then: vi.fn((resolve) =>
              resolve({
                data: mockData.filter((item: any) => values.includes(item[column])),
                error: null
              })
            ),
          })),
          single: vi.fn(() =>
            Promise.resolve({ data: mockData[0] || null, error: null })
          ),
          then: vi.fn((resolve) =>
            resolve({ data: mockData, error: null })
          ),
        })),
        insert: vi.fn((data: any) => ({
          select: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: { ...data, id: `generated-${Math.random()}` },
                error: null
              })
            ),
          })),
          then: vi.fn((resolve) =>
            resolve({
              data: { ...data, id: `generated-${Math.random()}` },
              error: null
            })
          ),
        })),
        update: vi.fn((data: any) => ({
          eq: vi.fn(() => ({
            then: vi.fn((resolve) =>
              resolve({ data, error: null })
            ),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => ({
            then: vi.fn((resolve) =>
              resolve({ data: null, error: null })
            ),
          })),
        })),
      };
    }),
  };
}

// Mock do módulo
export function mockSupabase() {
  vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => createSupabaseMock()),
  }));
}
```

**3. Usar nos testes:**
```typescript
import { mockSupabase } from '@/tests/mocks/supabase';

mockSupabase();

describe('ImovelSelector', () => {
  // seus testes aqui
});
```

**Impacto esperado:** +40 testes passando

---

## PROBLEMA 3: Dados de Teste Incompletos

### Erro
```
Unable to find element with testid="imovel-card"
```

### Causa
Componentes esperam dados específicos que não estão sendo retornados pelos mocks.

### Solução

**1. Atualizar cada teste de componente:**

**ImovelSelector.test.tsx:**
```typescript
import { mockSupabase } from '@/tests/mocks/supabase';

mockSupabase();

describe('ImovelSelector', () => {
  it('deve listar imóveis disponíveis', async () => {
    render(<ImovelSelector onSelect={vi.fn()} />);

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    });

    // Verificar que imóveis foram renderizados
    expect(screen.getAllByTestId('imovel-card')).toHaveLength(1);
  });
});
```

**2. Adicionar loading states nos componentes:**
```typescript
// No ImovelSelector.tsx
if (isLoading) return <div>Carregando...</div>;
if (error) return <div>Erro ao carregar imóveis</div>;
if (!imoveis || imoveis.length === 0) return <div>Nenhum imóvel disponível</div>;
```

**Impacto esperado:** +20 testes passando

---

## PROBLEMA 4: Next.js Router não mockado em todos os testes

### Solução Rápida

**Criar mock global no setup.ts:**
```typescript
// Adicionar ao tests/setup.ts

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/locacoes/nova',
    query: {},
  }),
  usePathname: () => '/locacoes/nova',
  useSearchParams: () => new URLSearchParams(),
}));
```

**Impacto esperado:** +6 testes passando

---

## CHECKLIST DE CORREÇÕES

### Fase 1: Setup Global (15 minutos)

- [ ] Adicionar polyfills de PointerCapture ao `tests/setup.ts`
- [ ] Adicionar mock do Next.js Router ao `tests/setup.ts`
- [ ] Adicionar ResizeObserver mock ao `tests/setup.ts`
- [ ] Executar testes: `npm test -- tests/unit/components/locacao/ --run`

**Resultado esperado:** ~40 testes adicionais passando

### Fase 2: Mocks do Supabase (30 minutos)

- [ ] Criar `tests/mocks/supabase.ts`
- [ ] Implementar mock completo com dados realistas
- [ ] Adicionar mock ao `ImovelSelector.test.tsx`
- [ ] Adicionar mock ao `LocatarioForm.test.tsx`
- [ ] Adicionar mock ao `GarantiaSelector.test.tsx`
- [ ] Executar testes: `npm test -- tests/unit/components/locacao/ --run`

**Resultado esperado:** ~40 testes adicionais passando

### Fase 3: Ajuste de Expectativas (15 minutos)

- [ ] Revisar `data-testid` em componentes
- [ ] Adicionar loading states onde necessário
- [ ] Ajustar timeouts de `waitFor` para queries assíncronas
- [ ] Executar testes: `npm test -- tests/unit/components/locacao/ --run`

**Resultado esperado:** ~16 testes adicionais passando

---

## VERIFICAÇÃO FINAL

**Após aplicar todas as correções:**

```bash
# 1. Executar todos os testes
npm test -- tests/unit/ --run

# 2. Verificar cobertura
npm test -- tests/unit/ --run --coverage

# 3. Gerar relatório
npm test -- tests/unit/ --run --reporter=html

# 4. Visualizar relatório
open coverage/index.html
```

**Meta:** 90%+ de testes passando (360/400 testes)

---

## ESTIMATIVA DE TEMPO

```
Fase 1 (Setup Global):        15 min  →  +40 testes ✅
Fase 2 (Mocks Supabase):       30 min  →  +40 testes ✅
Fase 3 (Ajuste Expectativas):  15 min  →  +16 testes ✅
                              --------
Total:                         60 min  →  +96 testes ✅
                                          ============
                                          400 testes (100%) ✅
```

---

## SCRIPTS ÚTEIS

**Executar testes em modo watch:**
```bash
npm run test:watch -- tests/unit/components/locacao/
```

**Executar apenas testes falhando:**
```bash
npm test -- tests/unit/ --run --reporter=verbose | grep "FAIL"
```

**Ver cobertura de arquivo específico:**
```bash
npm test -- tests/unit/hooks/use-create-locacao.test.ts --coverage
```

---

## SUPORTE

**Documentação:**
- Vitest: https://vitest.dev
- Testing Library: https://testing-library.com
- Radix UI: https://radix-ui.com

**Issues Conhecidas:**
- Radix UI + jsdom: https://github.com/radix-ui/primitives/issues/420
- Next.js Router mocking: https://github.com/vercel/next.js/discussions/48937

---

**Criado por:** TDD Test Architect Agent
**Data:** 2025-10-23
**Última atualização:** 2025-10-23
