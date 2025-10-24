#!/bin/bash
# E2E Test Suite - Setup Verification Script

echo "═══════════════════════════════════════════════════════════════"
echo "         E2E Test Suite - Setup Verification"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0

# Function to check file existence
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING: $1"
        ((failed++))
    fi
}

# Function to check directory existence
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $2 - MISSING: $1"
        ((failed++))
    fi
}

echo "📁 Checking Directory Structure..."
echo "─────────────────────────────────────────────────────────────"
check_dir "scripts/lib" "Framework library directory"
check_dir "scripts/tests/cadastros" "Base CRUD tests directory"
check_dir "scripts/tests/imoveis" "Imoveis tests directory"
check_dir "scripts/tests/contratos" "Contratos tests directory"
check_dir "scripts/reports" "Reports directory"

echo ""
echo "📚 Checking Framework Files..."
echo "─────────────────────────────────────────────────────────────"
check_file "scripts/lib/test-framework.ts" "Test framework"
check_file "scripts/lib/mock-data-generator.ts" "Mock data generator"

echo ""
echo "🧪 Checking Test Files..."
echo "─────────────────────────────────────────────────────────────"
check_file "scripts/tests/cadastros/test-pessoas.ts" "Pessoas tests (POC)"
check_file "scripts/tests/cadastros/test-locadores.ts" "Locadores tests"
check_file "scripts/tests/cadastros/test-locatarios.ts" "Locatarios tests"
check_file "scripts/tests/cadastros/test-fiadores.ts" "Fiadores tests"
check_file "scripts/tests/cadastros/test-enderecos.ts" "Enderecos tests"
check_file "scripts/tests/cadastros/test-profissoes.ts" "Profissoes tests"
check_file "scripts/tests/cadastros/test-tipo-imovel.ts" "Tipo Imovel tests"
check_file "scripts/tests/imoveis/test-imoveis.ts" "Imoveis tests (complex)"
check_file "scripts/tests/contratos/test-contratos.ts" "Contratos tests (complex)"

echo ""
echo "🎯 Checking Master Runner..."
echo "─────────────────────────────────────────────────────────────"
check_file "scripts/run-all-e2e-tests.ts" "Master test runner"

echo ""
echo "📖 Checking Documentation..."
echo "─────────────────────────────────────────────────────────────"
check_file "scripts/README-E2E-TESTS.md" "Comprehensive documentation"
check_file "scripts/QUICK-START-E2E.md" "Quick start guide"
check_file "scripts/TEST-ARCHITECTURE.md" "Architecture documentation"
check_file "IMPLEMENTATION-SUMMARY-E2E.md" "Implementation summary"

echo ""
echo "⚙️  Checking package.json Scripts..."
echo "─────────────────────────────────────────────────────────────"
if grep -q "test:e2e:all" package.json; then
    echo -e "${GREEN}✓${NC} test:e2e:all script exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} test:e2e:all script missing"
    ((failed++))
fi

if grep -q "test:e2e:pessoas" package.json; then
    echo -e "${GREEN}✓${NC} test:e2e:pessoas script exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} test:e2e:pessoas script missing"
    ((failed++))
fi

if grep -q "test:e2e:contratos" package.json; then
    echo -e "${GREEN}✓${NC} test:e2e:contratos script exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} test:e2e:contratos script missing"
    ((failed++))
fi

echo ""
echo "🔐 Checking Environment Variables..."
echo "─────────────────────────────────────────────────────────────"
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL configured"
        ((passed++))
    else
        echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_SUPABASE_URL not found in .env.local"
        ((failed++))
    fi
    
    if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} SUPABASE_SERVICE_ROLE_KEY configured"
        ((passed++))
    else
        echo -e "${YELLOW}⚠${NC} SUPABASE_SERVICE_ROLE_KEY not found in .env.local"
        ((failed++))
    fi
else
    echo -e "${YELLOW}⚠${NC} .env.local file not found"
    echo "   Please create .env.local with:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    ((failed+=2))
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "                     VERIFICATION RESULTS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
total=$((passed + failed))
percentage=$((passed * 100 / total))

echo "Total Checks:  $total"
echo -e "Passed:        ${GREEN}$passed${NC}"
echo -e "Failed:        ${RED}$failed${NC}"
echo "Success Rate:  $percentage%"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL CHECKS PASSED! E2E Test Suite is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure Supabase is running"
    echo "  2. Run: npm run test:e2e:pessoas (POC test)"
    echo "  3. Run: npm run test:e2e:all (full suite)"
    echo ""
else
    echo -e "${YELLOW}⚠️  SETUP INCOMPLETE. Please address the failed checks above.${NC}"
    echo ""
fi

echo "For more information, see:"
echo "  • scripts/QUICK-START-E2E.md"
echo "  • scripts/README-E2E-TESTS.md"
echo ""

exit $failed
