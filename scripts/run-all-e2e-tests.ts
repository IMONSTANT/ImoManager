#!/usr/bin/env ts-node
/**
 * Master E2E Test Runner
 * Executes all E2E tests and generates consolidated report
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestSuiteResult {
  name: string;
  file: string;
  status: 'success' | 'failed' | 'error';
  exitCode: number;
  duration: number;
  error?: string;
}

const TEST_FILES = [
  // Base CRUDs (Simple)
  { name: 'Pessoas', file: 'scripts/tests/cadastros/test-pessoas.ts', category: 'Cadastros' },
  { name: 'Locadores', file: 'scripts/tests/cadastros/test-locadores.ts', category: 'Cadastros' },
  { name: 'Locatários', file: 'scripts/tests/cadastros/test-locatarios.ts', category: 'Cadastros' },
  { name: 'Fiadores', file: 'scripts/tests/cadastros/test-fiadores.ts', category: 'Cadastros' },
  { name: 'Endereços', file: 'scripts/tests/cadastros/test-enderecos.ts', category: 'Cadastros' },
  { name: 'Profissões', file: 'scripts/tests/cadastros/test-profissoes.ts', category: 'Cadastros' },
  { name: 'Tipo Imóvel', file: 'scripts/tests/cadastros/test-tipo-imovel.ts', category: 'Cadastros' },

  // Complex Modules
  { name: 'Imóveis', file: 'scripts/tests/imoveis/test-imoveis.ts', category: 'Módulos Complexos' },
  { name: 'Contratos', file: 'scripts/tests/contratos/test-contratos.ts', category: 'Módulos Complexos' },
];

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

async function runTestSuite(suite: typeof TEST_FILES[0]): Promise<TestSuiteResult> {
  const startTime = Date.now();
  console.log(`\n${'='.repeat(70)}`);
  console.log(`▶️  Executando: ${suite.name} (${suite.category})`);
  console.log(`${'='.repeat(70)}`);

  try {
    execSync(`npx ts-node ${suite.file}`, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });

    const duration = Date.now() - startTime;
    console.log(`✅ ${suite.name} - PASSOU (${formatDuration(duration)})`);

    return {
      name: suite.name,
      file: suite.file,
      status: 'success',
      exitCode: 0,
      duration,
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.log(`❌ ${suite.name} - FALHOU (${formatDuration(duration)})`);

    return {
      name: suite.name,
      file: suite.file,
      status: 'failed',
      exitCode: error.status || 1,
      duration,
      error: error.message,
    };
  }
}

async function generateMasterReport(results: TestSuiteResult[]) {
  const totalTests = results.length;
  const passedTests = results.filter(r => r.status === 'success').length;
  const failedTests = results.filter(r => r.status === 'failed' || r.status === 'error').length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);

  // Group by category
  const categories = new Map<string, TestSuiteResult[]>();
  TEST_FILES.forEach(suite => {
    const result = results.find(r => r.name === suite.name);
    if (result) {
      if (!categories.has(suite.category)) {
        categories.set(suite.category, []);
      }
      categories.get(suite.category)!.push(result);
    }
  });

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Master - E2E Tests</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    .header {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 { font-size: 42px; color: #1a202c; margin-bottom: 15px; }
    .subtitle { color: #718096; font-size: 16px; margin-bottom: 30px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 30px;
      color: white;
      text-align: center;
    }
    .summary-card.success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
    .summary-card.error { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }
    .summary-card.info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .summary-number { font-size: 54px; font-weight: bold; margin-bottom: 10px; }
    .summary-label { font-size: 14px; opacity: 0.95; text-transform: uppercase; letter-spacing: 1px; }

    .category-section {
      background: white;
      border-radius: 20px;
      padding: 35px;
      margin-bottom: 25px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .category-title {
      font-size: 28px;
      color: #1a202c;
      margin-bottom: 25px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    .test-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }
    .test-card {
      background: #f7fafc;
      border-radius: 12px;
      padding: 20px;
      border-left: 5px solid #cbd5e0;
      transition: all 0.3s;
    }
    .test-card:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
    .test-card.success { border-left-color: #38ef7d; background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%); }
    .test-card.failed { border-left-color: #ff6a00; background: linear-gradient(135deg, #ffebee 0%, #fef5f5 100%); }
    .test-name { font-size: 20px; font-weight: bold; color: #1a202c; margin-bottom: 10px; }
    .test-status {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .test-status.success { background: #4caf50; color: white; }
    .test-status.failed { background: #f44336; color: white; }
    .test-meta { color: #718096; font-size: 14px; margin-top: 8px; }
    .test-file { font-size: 12px; color: #a0aec0; margin-top: 5px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Relatório Master - E2E Tests</h1>
      <p class="subtitle">
        Sistema de Gerenciamento Imobiliário - Testes End-to-End<br>
        Gerado em: ${new Date().toLocaleString('pt-BR')}<br>
        Total de Suites: ${totalTests} | Tempo total: ${formatDuration(totalDuration)}
      </p>

      <div class="summary">
        <div class="summary-card">
          <div class="summary-number">${totalTests}</div>
          <div class="summary-label">Total Suites</div>
        </div>
        <div class="summary-card success">
          <div class="summary-number">${passedTests}</div>
          <div class="summary-label">Aprovadas</div>
        </div>
        <div class="summary-card error">
          <div class="summary-number">${failedTests}</div>
          <div class="summary-label">Falharam</div>
        </div>
        <div class="summary-card info">
          <div class="summary-number">${successRate}%</div>
          <div class="summary-label">Taxa Sucesso</div>
        </div>
      </div>
    </div>

    ${Array.from(categories.entries()).map(([category, suites]) => `
      <div class="category-section">
        <h2 class="category-title">📁 ${category}</h2>
        <div class="test-grid">
          ${suites.map(suite => `
            <div class="test-card ${suite.status}">
              <div class="test-name">${suite.name}</div>
              <div class="test-status ${suite.status}">
                ${suite.status === 'success' ? '✅ Passou' : '❌ Falhou'}
              </div>
              <div class="test-meta">
                ⏱️ Duração: ${formatDuration(suite.duration)}
              </div>
              <div class="test-file">${suite.file}</div>
              ${suite.error ? `<div style="color: #e53e3e; margin-top: 10px; font-size: 12px;">Erro: ${suite.error}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}

    <div class="category-section" style="background: ${failedTests === 0 ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)' : '#fff3cd'};">
      <h2 class="category-title" style="border-color: ${failedTests === 0 ? '#38ef7d' : '#ffc107'};">
        ${failedTests === 0 ? '🎉 Conclusão' : '⚠️ Ação Necessária'}
      </h2>
      <p style="font-size: 18px; color: ${failedTests === 0 ? '#2e7d32' : '#856404'}; line-height: 1.6;">
        ${failedTests === 0
          ? `Excelente! Todos os ${totalTests} testes E2E passaram com sucesso. O sistema está funcionando corretamente em todos os módulos.`
          : `${failedTests} suite(s) falharam. Verifique os relatórios individuais em scripts/reports/ para detalhes sobre os erros.`
        }
      </p>
      <p style="margin-top: 15px; color: #4a5568; font-size: 14px;">
        📊 Relatórios individuais disponíveis em: <code>scripts/reports/</code><br>
        🔄 Para re-executar: <code>npm run test:e2e</code>
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const reportPath = path.join(__dirname, 'reports', 'master-e2e-report.html');
  fs.writeFileSync(reportPath, html, 'utf8');
  return reportPath;
}

async function main() {
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║' + ' '.repeat(15) + '🚀 MASTER E2E TEST RUNNER' + ' '.repeat(28) + '║');
  console.log('║' + ' '.repeat(10) + 'Sistema de Gerenciamento Imobiliário' + ' '.repeat(21) + '║');
  console.log('╚' + '═'.repeat(68) + '╝\n');

  const startTime = Date.now();
  const results: TestSuiteResult[] = [];

  // Run all test suites
  for (const suite of TEST_FILES) {
    const result = await runTestSuite(suite);
    results.push(result);

    // Small delay between suites
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const totalDuration = Date.now() - startTime;

  // Generate master report
  console.log(`\n${'='.repeat(70)}`);
  console.log('📊 Gerando relatório master...');
  const reportPath = await generateMasterReport(results);

  // Print summary
  const passed = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'failed' || r.status === 'error').length;
  const successRate = ((passed / results.length) * 100).toFixed(1);

  console.log(`\n${'='.repeat(70)}`);
  console.log('🎯 RESUMO FINAL - TODOS OS TESTES E2E');
  console.log(`${'='.repeat(70)}`);
  console.log(`📦 Total de Suites:    ${results.length}`);
  console.log(`✅ Aprovadas:          ${passed}`);
  console.log(`❌ Falharam:           ${failed}`);
  console.log(`📈 Taxa de Sucesso:    ${successRate}%`);
  console.log(`⏱️  Tempo Total:        ${formatDuration(totalDuration)}`);
  console.log(`${'='.repeat(70)}`);
  console.log(`\n📄 Relatório Master: ${reportPath}`);
  console.log(`📁 Relatórios Individuais: scripts/reports/\n`);

  // Try to open master report
  try {
    const open = (await import('open')).default;
    await open(reportPath);
    console.log('🌐 Relatório master aberto no navegador!\n');
  } catch (error) {
    console.log('💡 Abra manualmente o relatório em:', reportPath, '\n');
  }

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
