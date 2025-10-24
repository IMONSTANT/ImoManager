#!/usr/bin/env ts-node
/**
 * E2E Tests: Tipo Imovel CRUD
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-tipo-imovel.html');

async function runTests() {
  console.log('🚀 Iniciando testes E2E: Tipo Imovel CRUD');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();

  const tipoImovel = mockGen.generateTipoImovel();
  const resultados = await runner.testCRUD('Tipo Imovel', 'tipo_imovel', tipoImovel, {
    descricao: `Tipo Atualizado ${Date.now()}`
  });

  resultados.forEach(t => runner.logTestResult(t));

  const suite: TestSuite = {
    nome: 'Relatório E2E: Tipo Imovel CRUD',
    total: resultados.length,
    sucessos: resultados.filter(r => r.status === 'sucesso').length,
    falhas: resultados.filter(r => r.status === 'falha').length,
    tempo_total_ms: resultados.reduce((acc, r) => acc + r.tempo_ms, 0),
    resultados
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  console.log(`✅ Aprovados: ${suite.sucessos}/${suite.total}`);
  console.log(`❌ Falharam: ${suite.falhas}/${suite.total}`);
  console.log(`⏱️  Tempo total: ${suite.tempo_total_ms}ms`);
  console.log(`📈 Taxa de sucesso: ${((suite.sucessos / suite.total) * 100).toFixed(1)}%`);
  console.log('='.repeat(60) + '\n');

  runner.generateHTMLReport(suite, OUTPUT_FILE);
  console.log(`✅ Relatório HTML gerado: ${OUTPUT_FILE}`);

  process.exit(suite.falhas > 0 ? 1 : 0);
}

runTests().catch(console.error);
