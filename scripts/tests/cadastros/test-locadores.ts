#!/usr/bin/env ts-node
/**
 * E2E Tests: Locadores CRUD
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestResult, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-locadores.html');

async function runLocadoresTests() {
  console.log('🚀 Iniciando testes E2E: Locadores CRUD');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();
  const resultados: TestResult[] = [];

  // First, create a Pessoa to be used as Locador
  console.log('📝 Pré-requisito: Criar Pessoa para Locador...');
  const pessoa = mockGen.generatePessoa('PF');
  const pessoaResult = await runner.testCreate('Pessoa para Locador', 'pessoa', pessoa);
  resultados.push(pessoaResult);
  runner.logTestResult(pessoaResult);

  if (pessoaResult.status === 'sucesso' && pessoaResult.detalhes?.id) {
    const pessoaId = pessoaResult.detalhes.id;

    // TEST 1: Create Locador
    console.log('\n📝 Teste 1: Criar Locador...');
    const locador = mockGen.generateLocador(pessoaId);
    const createResult = await runner.testCreate('Locador', 'locador', locador);
    resultados.push(createResult);
    runner.logTestResult(createResult);

    // TEST 2: List Locadores
    console.log('\n📝 Teste 2: Listar Locadores...');
    const listResult = await runner.testList('Locadores', 'locador');
    resultados.push(listResult);
    runner.logTestResult(listResult);

    if (createResult.status === 'sucesso' && createResult.detalhes?.id) {
      const locadorId = createResult.detalhes.id;

      // TEST 3: Get Locador
      console.log('\n📝 Teste 3: Buscar Locador por ID...');
      const getResult = await runner.testGet('Locador', 'locador', locadorId);
      resultados.push(getResult);
      runner.logTestResult(getResult);

      // TEST 4: Update Locador
      console.log('\n📝 Teste 4: Atualizar Locador...');
      const updateResult = await runner.testUpdate('Locador', 'locador', locadorId, {
        tipo_pessoa: 'fisica'
      });
      resultados.push(updateResult);
      runner.logTestResult(updateResult);

      // TEST 5: Delete Locador
      console.log('\n📝 Teste 5: Deletar Locador...');
      const deleteResult = await runner.testDelete('Locador', 'locador', locadorId);
      resultados.push(deleteResult);
      runner.logTestResult(deleteResult);
    }

    // Cleanup: Delete Pessoa
    await runner.testDelete('Pessoa', 'pessoa', pessoaId);
  }

  // Generate Report
  const suite: TestSuite = {
    nome: 'Relatório E2E: Locadores CRUD',
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

runLocadoresTests().catch(console.error);
