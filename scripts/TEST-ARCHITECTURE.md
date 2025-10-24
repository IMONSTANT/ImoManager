# E2E Test Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         NPM SCRIPTS                             │
│  npm run test:e2e:all | test:e2e:pessoas | test:e2e:contratos  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   MASTER TEST RUNNER                            │
│                 run-all-e2e-tests.ts                            │
│  • Orchestrates all test suites                                │
│  • Tracks success/failure metrics                              │
│  • Generates consolidated master report                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEST SUITES (9+)                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Pessoas     │  │  Locadores   │  │  Locatarios  │        │
│  │  (POC 11+)   │  │   (5+ tests) │  │  (5+ tests)  │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                 │                  │                 │
│  ┌──────┴─────────────────┴──────────────────┴────────┐       │
│  │             TEST FRAMEWORK LAYER                     │       │
│  │           (lib/test-framework.ts)                    │       │
│  │                                                      │       │
│  │  ┌────────────────────────────────────────────┐    │       │
│  │  │    E2ETestRunner Class                     │    │       │
│  │  │                                             │    │       │
│  │  │  • testCreate()   → POST to Supabase      │    │       │
│  │  │  • testList()     → GET from Supabase     │    │       │
│  │  │  • testGet()      → GET single record     │    │       │
│  │  │  • testUpdate()   → PATCH to Supabase     │    │       │
│  │  │  • testDelete()   → Soft delete (PATCH)   │    │       │
│  │  │  • testCRUD()     → Full CRUD cycle       │    │       │
│  │  │  • generateHTMLReport() → Visual report   │    │       │
│  │  └────────────────────────────────────────────┘    │       │
│  │                                                      │       │
│  │  ┌────────────────────────────────────────────┐    │       │
│  │  │   MockDataGenerator Class                  │    │       │
│  │  │   (lib/mock-data-generator.ts)             │    │       │
│  │  │                                             │    │       │
│  │  │  • generatePessoa()    → PF/PJ data       │    │       │
│  │  │  • generateEndereco()  → Address data     │    │       │
│  │  │  • generateImovel()    → Property data    │    │       │
│  │  │  • generateContrato()  → Contract data    │    │       │
│  │  │  • generateCPF/CNPJ()  → Valid IDs        │    │       │
│  │  └────────────────────────────────────────────┘    │       │
│  └──────────────────────────┬───────────────────────────┘       │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE DATABASE                             │
│                 (Direct REST API Calls)                         │
│                                                                 │
│  • Uses service_role key (bypasses RLS)                        │
│  • Real database operations                                    │
│  • Automatic cleanup with soft deletes                         │
│                                                                 │
│  Tables:                                                        │
│  ├── pessoa                                                     │
│  ├── locador / locatario / fiador                              │
│  ├── endereco                                                   │
│  ├── imovel                                                     │
│  ├── contrato_locacao                                           │
│  └── ... (all system tables)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   HTML REPORTS (Visual Output)                  │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │   Master Report (master-e2e-report.html)          │        │
│  │   • Consolidated view of all suites               │        │
│  │   • Success rate dashboard                        │        │
│  │   • Links to individual reports                   │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │   Individual Reports (test-pessoas.html, etc.)    │        │
│  │   • Detailed test results                         │        │
│  │   • Execution times                               │        │
│  │   • Payloads and responses                        │        │
│  │   • Error details                                 │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Test Execution Flow

### Simple CRUD Test (e.g., Enderecos)

```
1. npm run test:e2e:enderecos
                │
                ▼
2. Load test-enderecos.ts
                │
                ▼
3. Initialize E2ETestRunner + MockDataGenerator
                │
                ▼
4. Generate mock Endereco data
   {
     logradouro: "Rua das Flores",
     numero: "123",
     cep: "12345-678",
     ...
   }
                │
                ▼
5. testCRUD() executes:
   ├─► testCreate()  → POST /rest/v1/endereco
   │                   ✅ Returns ID: 42
   │
   ├─► testList()    → GET /rest/v1/endereco?deleted_at=is.null
   │                   ✅ Returns array
   │
   ├─► testGet(42)   → GET /rest/v1/endereco?id=eq.42
   │                   ✅ Returns record
   │
   ├─► testUpdate(42) → PATCH /rest/v1/endereco?id=eq.42
   │                   ✅ Updates record
   │
   └─► testDelete(42) → PATCH /rest/v1/endereco?id=eq.42
                        ✅ Soft delete (deleted_at = now)
                │
                ▼
6. Generate HTML report
   scripts/reports/test-enderecos.html
                │
                ▼
7. Open in browser
   🌐 Visual dashboard displayed
```

### Complex Test with Dependencies (e.g., Contratos)

```
1. npm run test:e2e:contratos
                │
                ▼
2. Create prerequisite chain:
   ├─► Create Endereco         (ID: 1)
   ├─► Create Pessoa Locador   (ID: 2)
   ├─► Create Locador          (ID: 3, pessoa_id: 2)
   ├─► Create Tipo Imovel      (ID: 4)
   ├─► Create Imovel           (ID: 5, endereco: 1, locador: 3, tipo: 4)
   ├─► Create Pessoa Locatario (ID: 6)
   ├─► Create Locatario        (ID: 7, pessoa_id: 6)
   └─► Create Tipo Locacao     (ID: 8)
                │
                ▼
3. Test Contrato CRUD:
   Generate contrato with:
   - imovel_id: 5
   - locatario_id: 7
   - tipo_locacao_id: 8
                │
                ▼
4. Execute full CRUD cycle
                │
                ▼
5. Test business rules:
   - Filter by status: 'ativo'
   - Filter by imovel_id
                │
                ▼
6. Cleanup (reverse order):
   Delete Contrato → Locatario → Pessoa Locatario
   → Imovel → Locador → Pessoa Locador
   → Endereco → Tipo Imovel → Tipo Locacao
                │
                ▼
7. Generate comprehensive HTML report
```

## 🎨 Report Generation Flow

```
TestResult[] → TestSuite → generateHTMLReport()
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                  │
        ▼                                                  ▼
  Calculate Metrics                             Build HTML Template
  • Total tests                                 • Dashboard cards
  • Success count                               • Color coding
  • Failure count                               • Individual test cards
  • Success rate %                              • Error details
  • Total execution time                        • Recommendations
        │                                                  │
        └────────────────────────┬────────────────────────┘
                                 │
                                 ▼
                    Write to scripts/reports/
                    test-[module].html
                                 │
                                 ▼
                    Auto-open in browser
                    (using 'open' package)
```

## 📦 Module Dependencies

```
┌───────────────────────────────────────────────────────────┐
│                      DEPENDENCIES                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Runtime:                                                 │
│  ├── @supabase/supabase-js (Supabase client)            │
│  ├── node-fetch (HTTP requests)                          │
│  └── open (Browser opening)                              │
│                                                           │
│  Dev Dependencies:                                        │
│  ├── ts-node (TypeScript execution)                      │
│  ├── typescript (Type checking)                          │
│  └── @types/node (Node.js types)                         │
│                                                           │
│  Environment Variables:                                   │
│  ├── NEXT_PUBLIC_SUPABASE_URL                           │
│  └── SUPABASE_SERVICE_ROLE_KEY                          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                  AUTHENTICATION                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Test Script                                            │
│       │                                                 │
│       ▼                                                 │
│  E2ETestRunner                                          │
│       │                                                 │
│       │ Reads from .env.local                           │
│       ├─► NEXT_PUBLIC_SUPABASE_URL                     │
│       └─► SUPABASE_SERVICE_ROLE_KEY                    │
│            (NOT anon key!)                              │
│       │                                                 │
│       ▼                                                 │
│  Fetch Request to Supabase REST API                    │
│       │                                                 │
│       │ Headers:                                        │
│       ├─► apikey: {service_role_key}                   │
│       └─► Authorization: Bearer {service_role_key}     │
│       │                                                 │
│       ▼                                                 │
│  Supabase                                               │
│       │                                                 │
│       │ service_role key:                               │
│       ├─► Bypasses RLS (Row Level Security)            │
│       ├─► Full admin access                            │
│       └─► Can read/write all tables                    │
│       │                                                 │
│       ▼                                                 │
│  Database Operation Executed                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- Framework layer (`lib/`) is reusable
- Test suites (`tests/`) use framework
- Mock data generation is isolated
- Reports generation is standardized

### 2. **DRY (Don't Repeat Yourself)**
- Common operations in E2ETestRunner
- Mock data generators reused across tests
- HTML template shared by all reports

### 3. **Fail-Safe Operations**
- Soft deletes (not hard deletes)
- Automatic cleanup
- Error handling at every step
- Graceful failure with detailed errors

### 4. **Observability**
- Console logging for live feedback
- HTML reports for post-analysis
- Execution time tracking
- Success/failure metrics

### 5. **Extensibility**
- Easy to add new test suites
- Framework methods are generic
- Mock generator can be extended
- Reports are template-based

---

## 📈 Benefits of This Architecture

✅ **Maintainable**: Clear separation, easy to update
✅ **Testable**: Each layer can be tested independently
✅ **Scalable**: Add new modules without changing core
✅ **Observable**: Rich logging and reporting
✅ **Reliable**: Automatic cleanup, error handling
✅ **Developer-Friendly**: Clear patterns, good docs

---

**This architecture ensures long-term maintainability and scalability of the E2E testing suite.** 🏗️
