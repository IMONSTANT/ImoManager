#!/usr/bin/env ts-node
/**
 * E2E Tests: Pessoas CRUD
 * POC implementation following test-templates.ts pattern
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestResult, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-pessoas.html');

async function runPessoasTests() {
  console.log('🚀 Iniciando testes E2E: Pessoas CRUD');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();
  const resultados: TestResult[] = [];

  // =========================================================================
  // TEST 1: Create Pessoa Física (PF)
  // =========================================================================
  console.log('\n📝 Teste 1: Criar Pessoa Física...');
  const pessoaFisica = mockGen.generatePessoa('PF');
  const createPFResult = await runner.testCreate('Pessoa Física', 'pessoa', pessoaFisica);
  resultados.push(createPFResult);
  runner.logTestResult(createPFResult);

  // =========================================================================
  // TEST 2: List Pessoas
  // =========================================================================
  console.log('\n📝 Teste 2: Listar Pessoas...');
  const listResult = await runner.testList('Pessoas', 'pessoa');
  resultados.push(listResult);
  runner.logTestResult(listResult);

  // =========================================================================
  // TEST 3: Get Pessoa by ID
  // =========================================================================
  if (createPFResult.status === 'sucesso' && createPFResult.detalhes?.id) {
    console.log('\n📝 Teste 3: Buscar Pessoa por ID...');
    const pessoaId = createPFResult.detalhes.id;
    const getResult = await runner.testGet('Pessoa Física', 'pessoa', pessoaId);
    resultados.push(getResult);
    runner.logTestResult(getResult);

    // =========================================================================
    // TEST 4: Update Pessoa
    // =========================================================================
    console.log('\n📝 Teste 4: Atualizar Pessoa...');
    const updatePayload = {
      nome: 'Nome Atualizado via Teste',
      telefone: mockGen.generatePhone(),
    };
    const updateResult = await runner.testUpdate('Pessoa Física', 'pessoa', pessoaId, updatePayload);
    resultados.push(updateResult);
    runner.logTestResult(updateResult);

    // =========================================================================
    // TEST 5: Delete Pessoa (soft delete)
    // =========================================================================
    console.log('\n📝 Teste 5: Deletar Pessoa (soft delete)...');
    const deleteResult = await runner.testDelete('Pessoa Física', 'pessoa', pessoaId);
    resultados.push(deleteResult);
    runner.logTestResult(deleteResult);
  }

  // =========================================================================
  // TEST 6: Create Pessoa Jurídica (PJ)
  // =========================================================================
  console.log('\n📝 Teste 6: Criar Pessoa Jurídica...');
  const pessoaJuridica = mockGen.generatePessoa('PJ');
  const createPJResult = await runner.testCreate('Pessoa Jurídica', 'pessoa', pessoaJuridica);
  resultados.push(createPJResult);
  runner.logTestResult(createPJResult);

  if (createPJResult.status === 'sucesso' && createPJResult.detalhes?.id) {
    const pjId = createPJResult.detalhes.id;

    // =========================================================================
    // TEST 7: Update Pessoa Jurídica
    // =========================================================================
    console.log('\n📝 Teste 7: Atualizar Pessoa Jurídica...');
    const updatePJResult = await runner.testUpdate('Pessoa Jurídica', 'pessoa', pjId, {
      nome: 'Empresa Atualizada Ltda',
    });
    resultados.push(updatePJResult);
    runner.logTestResult(updatePJResult);

    // Cleanup PJ
    await runner.testDelete('Pessoa Jurídica', 'pessoa', pjId);
  }

  // =========================================================================
  // TEST 8: Validation - Empty Name (should fail)
  // =========================================================================
  console.log('\n📝 Teste 8: Validação - Nome vazio (deve falhar)...');
  const invalidPessoa = {
    nome: '',
    tipo: 'PF',
    cpf_cnpj: mockGen.generateCPF(),
  };
  const validationResult = await runner.testCreateExpectFailure(
    'Pessoa - Validação nome vazio',
    'pessoa',
    invalidPessoa,
    'pessoa_nome_not_empty'
  );
  resultados.push(validationResult);
  runner.logTestResult(validationResult);

  // =========================================================================
  // TEST 9: Create Multiple Pessoas (Batch Test)
  // =========================================================================
  console.log('\n📝 Teste 9: Criar múltiplas Pessoas em lote...');
  for (let i = 0; i < 3; i++) {
    const pessoa = mockGen.generatePessoa(i % 2 === 0 ? 'PF' : 'PJ');
    const batchResult = await runner.testCreate(`Pessoa Lote ${i + 1}`, 'pessoa', pessoa);
    resultados.push(batchResult);
    runner.logTestResult(batchResult);

    // Cleanup
    if (batchResult.status === 'sucesso' && batchResult.detalhes?.id) {
      await runner.testDelete(`Pessoa Lote ${i + 1}`, 'pessoa', batchResult.detalhes.id);
    }
  }

  // =========================================================================
  // TEST 10: Filter by Tipo (PF)
  // =========================================================================
  console.log('\n📝 Teste 10: Filtrar Pessoas por tipo (PF)...');
  const filterPFResult = await runner.testList('Pessoas tipo PF', 'pessoa', { tipo: 'PF' });
  resultados.push(filterPFResult);
  runner.logTestResult(filterPFResult);

  // =========================================================================
  // TEST 11: Filter by Tipo (PJ)
  // =========================================================================
  console.log('\n📝 Teste 11: Filtrar Pessoas por tipo (PJ)...');
  const filterPJResult = await runner.testList('Pessoas tipo PJ', 'pessoa', { tipo: 'PJ' });
  resultados.push(filterPJResult);
  runner.logTestResult(filterPJResult);

  // =========================================================================
  // Calculate Metrics
  // =========================================================================
  const suite: TestSuite = {
    nome: 'Relatório E2E: Pessoas CRUD',
    total: resultados.length,
    sucessos: resultados.filter(r => r.status === 'sucesso').length,
    falhas: resultados.filter(r => r.status === 'falha').length,
    tempo_total_ms: resultados.reduce((acc, r) => acc + r.tempo_ms, 0),
    resultados
  };

  // =========================================================================
  // Generate HTML Report
  // =========================================================================
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

  // Try to open report in browser
  try {
    const open = (await import('open')).default;
    await open(OUTPUT_FILE);
    console.log('🌐 Relatório aberto no navegador!');
  } catch (error) {
    console.log('\n💡 Abra manualmente o relatório em:', OUTPUT_FILE);
  }

  // Exit with appropriate code
  process.exit(suite.falhas > 0 ? 1 : 0);
}

// Run tests
runPessoasTests().catch((error) => {
  console.error('❌ Erro fatal ao executar testes:', error);
  process.exit(1);
});
