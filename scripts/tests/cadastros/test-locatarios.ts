#!/usr/bin/env ts-node
/**
 * E2E Tests: Locatarios CRUD
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-locatarios.html');

async function runTests() {
  console.log('🚀 Iniciando testes E2E: Locatarios CRUD');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();
  const resultados: any[] = [];

  // Pre-requisite: Create Pessoa
  console.log('📝 Pré-requisito: Criar Pessoa para Locatario...');
  const pessoa = mockGen.generatePessoa('PF');
  const pessoaResult = await runner.testCreate('Pessoa para Locatario', 'pessoa', pessoa);
  resultados.push(pessoaResult);
  runner.logTestResult(pessoaResult);

  if (pessoaResult.status === 'sucesso' && pessoaResult.detalhes?.id) {
    const locatario = mockGen.generateLocatario(pessoaResult.detalhes.id);
    const tests = await runner.testCRUD('Locatario', 'locatario', locatario, {
      referencias: 'Referências atualizadas via teste'
    });
    resultados.push(...tests);
    tests.forEach(t => runner.logTestResult(t));
    await runner.testDelete('Pessoa', 'pessoa', pessoaResult.detalhes.id);
  }

  const suite: TestSuite = {
    nome: 'Relatório E2E: Locatarios CRUD',
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
