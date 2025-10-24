#!/usr/bin/env ts-node
/**
 * E2E Tests: Imoveis CRUD (Complex - with relationships)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestResult, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-imoveis.html');

async function runTests() {
  console.log('🚀 Iniciando testes E2E: Imoveis CRUD (módulo complexo)');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();
  const resultados: TestResult[] = [];

  // Pre-requisites: Create related entities
  console.log('📝 Criando pré-requisitos...');

  // 1. Create Endereco
  const endereco = mockGen.generateEndereco();
  const enderecoResult = await runner.testCreate('Endereco', 'endereco', endereco);
  resultados.push(enderecoResult);
  runner.logTestResult(enderecoResult);

  // 2. Create Pessoa for Locador
  const pessoa = mockGen.generatePessoa('PF');
  const pessoaResult = await runner.testCreate('Pessoa', 'pessoa', pessoa);
  resultados.push(pessoaResult);
  runner.logTestResult(pessoaResult);

  // 3. Create Locador
  let locadorResult: TestResult | null = null;
  if (pessoaResult.status === 'sucesso' && pessoaResult.detalhes?.id) {
    const locador = mockGen.generateLocador(pessoaResult.detalhes.id);
    locadorResult = await runner.testCreate('Locador', 'locador', locador);
    resultados.push(locadorResult);
    runner.logTestResult(locadorResult);
  }

  // 4. Create Tipo Imovel
  const tipoImovel = mockGen.generateTipoImovel();
  const tipoResult = await runner.testCreate('Tipo Imovel', 'tipo_imovel', tipoImovel);
  resultados.push(tipoResult);
  runner.logTestResult(tipoResult);

  // Main Tests: Imovel CRUD
  if (
    enderecoResult.status === 'sucesso' &&
    locadorResult?.status === 'sucesso' &&
    tipoResult.status === 'sucesso'
  ) {
    const imovel = mockGen.generateImovel(
      enderecoResult.detalhes.id,
      locadorResult.detalhes.id,
      tipoResult.detalhes.id
    );

    console.log('\n📝 Testando CRUD de Imovel...');

    // Test CRUD
    const imovelTests = await runner.testCRUD('Imovel', 'imovel', imovel, {
      valor_aluguel: '2500.00',
      disponivel: false
    });
    resultados.push(...imovelTests);
    imovelTests.forEach(t => runner.logTestResult(t));

    // Test Filters
    console.log('\n📝 Testando filtros...');
    const filterDisponivel = await runner.testList('Imoveis Disponiveis', 'imovel', {
      disponivel: 'true'
    });
    resultados.push(filterDisponivel);
    runner.logTestResult(filterDisponivel);

    const filterLocador = await runner.testList('Imoveis por Locador', 'imovel', {
      locador_id: locadorResult.detalhes.id
    });
    resultados.push(filterLocador);
    runner.logTestResult(filterLocador);

    // Cleanup
    if (imovelTests[0].status === 'sucesso' && imovelTests[0].detalhes?.id) {
      await runner.testDelete('Imovel', 'imovel', imovelTests[0].detalhes.id);
    }
  }

  // Cleanup pre-requisites
  if (locadorResult?.status === 'sucesso') {
    await runner.testDelete('Locador', 'locador', locadorResult.detalhes.id);
  }
  if (pessoaResult.status === 'sucesso') {
    await runner.testDelete('Pessoa', 'pessoa', pessoaResult.detalhes.id);
  }
  if (enderecoResult.status === 'sucesso') {
    await runner.testDelete('Endereco', 'endereco', enderecoResult.detalhes.id);
  }
  if (tipoResult.status === 'sucesso') {
    await runner.testDelete('Tipo Imovel', 'tipo_imovel', tipoResult.detalhes.id);
  }

  // Generate Report
  const suite: TestSuite = {
    nome: 'Relatório E2E: Imoveis CRUD (Complexo)',
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
