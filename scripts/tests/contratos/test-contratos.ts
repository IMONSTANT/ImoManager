#!/usr/bin/env ts-node
/**
 * E2E Tests: Contratos CRUD (Most Complex - full workflow)
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../../../.env.local') });

import { E2ETestRunner, TestResult, TestSuite } from '../../lib/test-framework';
import { MockDataGenerator } from '../../lib/mock-data-generator';

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const OUTPUT_FILE = path.join(__dirname, '../../reports/test-contratos.html');

async function runTests() {
  console.log('🚀 Iniciando testes E2E: Contratos CRUD (módulo mais complexo)');
  console.log(`📡 Supabase URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${OUTPUT_FILE}\n`);

  const runner = new E2ETestRunner();
  const mockGen = new MockDataGenerator();
  const resultados: TestResult[] = [];

  // STEP 1: Create all pre-requisites
  console.log('📝 Criando pré-requisitos (pipeline completo)...\n');

  // Create Endereco
  const endereco = mockGen.generateEndereco();
  const enderecoResult = await runner.testCreate('Endereco', 'endereco', endereco);
  resultados.push(enderecoResult);
  runner.logTestResult(enderecoResult);

  // Create Pessoa Locador
  const pessoaLocador = mockGen.generatePessoa('PF');
  const pessoaLocadorResult = await runner.testCreate('Pessoa Locador', 'pessoa', pessoaLocador);
  resultados.push(pessoaLocadorResult);
  runner.logTestResult(pessoaLocadorResult);

  // Create Locador
  let locadorId: number | null = null;
  if (pessoaLocadorResult.status === 'sucesso') {
    const locador = mockGen.generateLocador(pessoaLocadorResult.detalhes.id);
    const locadorResult = await runner.testCreate('Locador', 'locador', locador);
    resultados.push(locadorResult);
    runner.logTestResult(locadorResult);
    locadorId = locadorResult.detalhes?.id;
  }

  // Create Tipo Imovel
  const tipoImovel = mockGen.generateTipoImovel();
  const tipoResult = await runner.testCreate('Tipo Imovel', 'tipo_imovel', tipoImovel);
  resultados.push(tipoResult);
  runner.logTestResult(tipoResult);

  // Create Imovel
  let imovelId: number | null = null;
  if (enderecoResult.status === 'sucesso' && locadorId && tipoResult.status === 'sucesso') {
    const imovel = mockGen.generateImovel(
      enderecoResult.detalhes.id,
      locadorId,
      tipoResult.detalhes.id
    );
    const imovelResult = await runner.testCreate('Imovel', 'imovel', imovel);
    resultados.push(imovelResult);
    runner.logTestResult(imovelResult);
    imovelId = imovelResult.detalhes?.id;
  }

  // Create Pessoa Locatario
  const pessoaLocatario = mockGen.generatePessoa('PF');
  const pessoaLocatarioResult = await runner.testCreate('Pessoa Locatario', 'pessoa', pessoaLocatario);
  resultados.push(pessoaLocatarioResult);
  runner.logTestResult(pessoaLocatarioResult);

  // Create Locatario
  let locatarioId: number | null = null;
  if (pessoaLocatarioResult.status === 'sucesso') {
    const locatario = mockGen.generateLocatario(pessoaLocatarioResult.detalhes.id);
    const locatarioResult = await runner.testCreate('Locatario', 'locatario', locatario);
    resultados.push(locatarioResult);
    runner.logTestResult(locatarioResult);
    locatarioId = locatarioResult.detalhes?.id;
  }

  // Create Tipo Locacao (using simple insert as it might not exist)
  const tipoLocacaoData = {
    descricao: 'Residencial Teste ' + Date.now(),
  };
  const tipoLocacaoResult = await runner.testCreate('Tipo Locacao', 'tipo_locacao', tipoLocacaoData);
  resultados.push(tipoLocacaoResult);
  runner.logTestResult(tipoLocacaoResult);

  // STEP 2: Test Contrato CRUD
  if (imovelId && locatarioId && tipoLocacaoResult.status === 'sucesso') {
    console.log('\n📝 Testando CRUD de Contrato...\n');

    const contrato = mockGen.generateContrato(
      imovelId,
      locatarioId,
      tipoLocacaoResult.detalhes.id
    );

    // First, do basic CREATE
    const createResult = await runner.testCreate('Contrato', 'contrato_locacao', contrato);
    resultados.push(createResult);
    runner.logTestResult(createResult);

    if (createResult.status === 'falha') {
      console.log('   ❌ CREATE falhou, pulando testes restantes');
    } else {
      const contratoId = createResult.detalhes?.id;

      // LIST (basic REST API)
      resultados.push(await runner.testList('Contrato', 'contrato_locacao'));
      runner.logTestResult(resultados[resultados.length - 1]);

      // LIST com ORDER BY (como frontend faz) - CRITICAL para pegar erros de coluna
      console.log('\n📝 Testando LIST com ORDER BY (como frontend)...\n');
      const inicioList = Date.now();
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Simula getContratos() que usa ORDER BY created_at
        const { data: listData, error: listError } = await supabase
          .from('contrato_locacao')
          .select('*')
          .is('deleted_at', null)
          .order('created_at', { ascending: false })
          .limit(10);

        const tempo_ms_list = Date.now() - inicioList;

        if (listError) {
          resultados.push({
            nome: 'Contrato LIST com ORDER BY - FRONTEND SIMULATION',
            status: 'falha',
            erro: `Erro Supabase: ${listError.message} | Code: ${listError.code}`,
            tempo_ms: tempo_ms_list,
            detalhes: { error: listError }
          });
        } else {
          resultados.push({
            nome: 'Contrato LIST com ORDER BY - FRONTEND SIMULATION',
            status: 'sucesso',
            tempo_ms: tempo_ms_list,
            detalhes: { count: listData?.length || 0 }
          });
        }
        runner.logTestResult(resultados[resultados.length - 1]);
      } catch (error: any) {
        resultados.push({
          nome: 'Contrato LIST com ORDER BY - FRONTEND SIMULATION',
          status: 'falha',
          erro: `Exceção: ${error.message}`,
          tempo_ms: Date.now() - inicioList
        });
        runner.logTestResult(resultados[resultados.length - 1]);
      }

      // GET simples
      resultados.push(await runner.testGet('Contrato', 'contrato_locacao', contratoId));
      runner.logTestResult(resultados[resultados.length - 1]);

      // TESTE ESPECÍFICO: GET com Joins Nested (igual ao frontend) - ANTES do DELETE
      console.log('\n📝 Testando GET com joins nested (como frontend)...\n');
      const inicio = Date.now();

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data, error } = await supabase
          .from('contrato_locacao')
          .select(`
            *,
            imovel:imovel_id (
              *,
              endereco:endereco_id (*),
              tipo_imovel:tipo_imovel_id (*),
              locador:locador_id (
                *,
                pessoa:pessoa_id (*)
              )
            ),
            locatario:locatario_id (
              *,
              pessoa:pessoa_id (
                *,
                endereco:endereco_id (*)
              )
            ),
            fiador:fiador_id (
              *,
              pessoa:pessoa_id (
                *,
                endereco:endereco_id (*)
              )
            ),
            tipo_locacao:tipo_locacao_id (*)
          `)
          .eq('id', contratoId)
          .is('deleted_at', null)
          .single();

        const tempo_ms = Date.now() - inicio;

        if (error) {
          resultados.push({
            nome: 'Contrato GET com joins - FRONTEND SIMULATION',
            status: 'falha',
            erro: `Erro Supabase: ${error.message} | Code: ${error.code} | Details: ${error.details}`,
            tempo_ms,
            detalhes: { error }
          });
          runner.logTestResult(resultados[resultados.length - 1]);
        } else if (!data) {
          resultados.push({
            nome: 'Contrato GET com joins - FRONTEND SIMULATION',
            status: 'falha',
            erro: 'Nenhum dado retornado',
            tempo_ms
          });
          runner.logTestResult(resultados[resultados.length - 1]);
        } else {
          // Validar estrutura nested
          const missingRelations = [];
          if (!data.imovel) missingRelations.push('imovel');
          if (!data.locatario) missingRelations.push('locatario');
          if (!data.tipo_locacao) missingRelations.push('tipo_locacao');
          if (data.imovel && !data.imovel.endereco) missingRelations.push('imovel.endereco');
          if (data.imovel && !data.imovel.tipo_imovel) missingRelations.push('imovel.tipo_imovel');
          if (data.imovel && !data.imovel.locador) missingRelations.push('imovel.locador');
          if (data.locatario && !data.locatario.pessoa) missingRelations.push('locatario.pessoa');

          if (missingRelations.length > 0) {
            resultados.push({
              nome: 'Contrato GET com joins - FRONTEND SIMULATION',
              status: 'falha',
              erro: `Relacionamentos faltando: ${missingRelations.join(', ')}`,
              tempo_ms,
              detalhes: data
            });
          } else {
            resultados.push({
              nome: 'Contrato GET com joins - FRONTEND SIMULATION',
              status: 'sucesso',
              tempo_ms,
              detalhes: {
                hasAllRelations: true,
                relations: {
                  imovel: !!data.imovel,
                  locatario: !!data.locatario,
                  tipo_locacao: !!data.tipo_locacao,
                  fiador: !!data.fiador
                }
              }
            });
          }
          runner.logTestResult(resultados[resultados.length - 1]);
        }
      } catch (error: any) {
        resultados.push({
          nome: 'Contrato GET com joins - FRONTEND SIMULATION',
          status: 'falha',
          erro: `Exceção: ${error.message}`,
          tempo_ms: Date.now() - inicio,
          detalhes: { stack: error.stack }
        });
        runner.logTestResult(resultados[resultados.length - 1]);
      }

      // UPDATE
      resultados.push(await runner.testUpdate('Contrato', 'contrato_locacao', contratoId, {
        status: 'ativo',
        observacoes: 'Contrato atualizado via teste'
      }));
      runner.logTestResult(resultados[resultados.length - 1]);

      // DELETE
      resultados.push(await runner.testDelete('Contrato', 'contrato_locacao', contratoId));
      runner.logTestResult(resultados[resultados.length - 1]);
    }

    // Test filters
    console.log('\n📝 Testando filtros de Contratos...\n');

    const filterAtivos = await runner.testList('Contratos Ativos', 'contrato_locacao', {
      status: 'ativo'
    });
    resultados.push(filterAtivos);
    runner.logTestResult(filterAtivos);

    const filterImovel = await runner.testList('Contratos por Imovel', 'contrato_locacao', {
      imovel_id: imovelId
    });
    resultados.push(filterImovel);
    runner.logTestResult(filterImovel);
  }

  // Cleanup (reverse order of creation)
  console.log('\n🧹 Limpando dados de teste...');
  // Note: In a real scenario, we'd delete in proper order respecting foreign keys

  // Generate Report
  const suite: TestSuite = {
    nome: 'Relatório E2E: Contratos CRUD (Workflow Completo)',
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
