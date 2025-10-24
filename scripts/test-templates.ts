#!/usr/bin/env ts-node
/**
 * Script de Teste Automatizado para Templates de Documentos
 * Testa todos os 10 documentos (D1-D10) e gera relatório HTML
 */

import { MOCK_PAYLOADS, type DocumentoTipo } from './mock-data';
import * as fs from 'fs';
import * as path from 'path';

// Configuração
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname);
const REPORT_FILE = path.join(OUTPUT_DIR, 'relatorio-templates.html');

// Credenciais de teste (pode ser passado via env ou argumentos)
const TEST_EMAIL = process.env.TEST_EMAIL || process.argv[2];
const TEST_PASSWORD = process.env.TEST_PASSWORD || process.argv[3];

let AUTH_TOKEN: string | null = null;

interface TestResult {
  tipo: DocumentoTipo;
  nome: string;
  status: 'sucesso' | 'falha';
  erro?: string;
  variaveis_esperadas?: string[];
  variaveis_faltando?: string[];
  chaves_extraidas?: string[];
  dados_enviados?: any;
  html_gerado?: string;
  tempo_ms?: number;
}

const DOCUMENTO_NOMES: Record<DocumentoTipo, string> = {
  D1: 'Declaração de Entrega de Contrato',
  D2: 'Ficha Cadastral de Fiador',
  D3: 'Contrato de Locação',
  D4: 'Termo de Vistoria de Entrada',
  D5: 'Termo de Vistoria de Saída',
  D6: 'Autorização de Débito Automático',
  D7: 'Termo de Entrega de Chaves',
  D8: 'Notificação de Atraso de Pagamento',
  D9: 'Acordo de Rescisão de Contrato',
  D10: 'Recibo de Pagamento'
};

/**
 * Configura bypass de autenticação para testes
 */
async function configurarBypassAuth() {
  // Define variável de ambiente para bypass
  process.env.SKIP_AUTH = 'true';
  console.log('🔓 Modo de teste: autenticação será bypassed\n');
}

async function testarDocumento(tipo: DocumentoTipo): Promise<TestResult> {
  const inicio = Date.now();
  const payload = MOCK_PAYLOADS[tipo];

  console.log(`\n🔄 Testando ${tipo}: ${DOCUMENTO_NOMES[tipo]}...`);
  console.log(`   Payload:`, JSON.stringify(payload));

  try {
    const response = await fetch(`${API_URL}/api/documentos/gerar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-test-mode': 'true',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const tempo_ms = Date.now() - inicio;

    if (data.success && data.documento) {
      console.log(`   ✅ SUCESSO (${tempo_ms}ms)`);
      return {
        tipo,
        nome: DOCUMENTO_NOMES[tipo],
        status: 'sucesso',
        html_gerado: data.documento.conteudo_html,
        tempo_ms,
      };
    } else {
      console.log(`   ❌ FALHA: ${data.error}`);

      // Extrair informações do erro
      const errorMsg = data.error || 'Erro desconhecido';
      let variaveis_faltando: string[] = [];

      // Parse da mensagem de erro para extrair variáveis faltantes
      const match = errorMsg.match(/Faltam: (.+)/);
      if (match) {
        variaveis_faltando = match[1].split(', ').map((v: string) => v.trim());
      }

      return {
        tipo,
        nome: DOCUMENTO_NOMES[tipo],
        status: 'falha',
        erro: errorMsg,
        variaveis_faltando,
        tempo_ms,
      };
    }
  } catch (error) {
    const tempo_ms = Date.now() - inicio;
    console.log(`   ❌ ERRO DE REDE: ${error}`);
    return {
      tipo,
      nome: DOCUMENTO_NOMES[tipo],
      status: 'falha',
      erro: `Erro de rede: ${error instanceof Error ? error.message : String(error)}`,
      tempo_ms,
    };
  }
}

async function gerarRelatorio(resultados: TestResult[]) {
  const aprovados = resultados.filter(r => r.status === 'sucesso').length;
  const falharam = resultados.filter(r => r.status === 'falha').length;
  const total = resultados.length;
  const percentual = ((aprovados / total) * 100).toFixed(1);

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Testes - Templates de Documentos</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 36px;
      color: #1a202c;
      margin-bottom: 10px;
    }

    .subtitle {
      color: #718096;
      font-size: 16px;
      margin-bottom: 30px;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }

    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 15px;
      padding: 25px;
      color: white;
      text-align: center;
    }

    .summary-card.success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .summary-card.error {
      background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
    }

    .summary-number {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .summary-label {
      font-size: 14px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
      gap: 25px;
    }

    .result-card {
      background: white;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .result-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .result-header {
      padding: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f7fafc;
    }

    .result-header.success {
      background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    }

    .result-header.error {
      background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
    }

    .result-title {
      flex: 1;
    }

    .result-tipo {
      font-size: 14px;
      color: #718096;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .result-nome {
      font-size: 18px;
      font-weight: bold;
      color: #1a202c;
    }

    .result-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .result-badge.success {
      background: #4caf50;
      color: white;
    }

    .result-badge.error {
      background: #f44336;
      color: white;
    }

    .result-body {
      padding: 25px;
    }

    .error-message {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .error-message strong {
      color: #856404;
      display: block;
      margin-bottom: 5px;
    }

    .error-message p {
      color: #856404;
      font-size: 14px;
    }

    .missing-vars {
      margin-top: 15px;
    }

    .missing-vars-title {
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .var-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .var-tag {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-family: 'Monaco', 'Courier New', monospace;
      color: #e53e3e;
    }

    .success-message {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      border-radius: 5px;
      color: #155724;
    }

    .preview-section {
      margin-top: 20px;
      border-top: 2px solid #f7fafc;
      padding-top: 20px;
    }

    .preview-title {
      font-weight: bold;
      color: #1a202c;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .preview-html {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      max-height: 200px;
      overflow-y: auto;
      font-size: 11px;
      font-family: 'Monaco', 'Courier New', monospace;
    }

    .recommendations {
      background: white;
      border-radius: 15px;
      padding: 30px;
      margin-top: 30px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }

    .recommendations h2 {
      color: #1a202c;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .recommendation-item {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 5px;
    }

    .recommendation-item strong {
      color: #1a202c;
      display: block;
      margin-bottom: 8px;
    }

    .recommendation-item ul {
      margin-left: 20px;
      color: #4a5568;
    }

    .recommendation-item li {
      margin-bottom: 5px;
    }

    .meta-info {
      display: flex;
      gap: 15px;
      margin-top: 10px;
      font-size: 12px;
      color: #718096;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 Relatório de Testes - Templates de Documentos</h1>
      <p class="subtitle">
        Gerado em: ${new Date().toLocaleString('pt-BR')}<br>
        Contrato ID: 10 | Parcela ID: 1 | Fiador ID: 1
      </p>

      <div class="summary">
        <div class="summary-card">
          <div class="summary-number">${total}</div>
          <div class="summary-label">Total de Testes</div>
        </div>
        <div class="summary-card success">
          <div class="summary-number">${aprovados}</div>
          <div class="summary-label">Aprovados</div>
        </div>
        <div class="summary-card error">
          <div class="summary-number">${falharam}</div>
          <div class="summary-label">Falharam</div>
        </div>
        <div class="summary-card">
          <div class="summary-number">${percentual}%</div>
          <div class="summary-label">Taxa de Sucesso</div>
        </div>
      </div>
    </div>

    <!-- Results Grid -->
    <div class="results-grid">
      ${resultados.map(result => `
        <div class="result-card">
          <div class="result-header ${result.status === 'sucesso' ? 'success' : 'error'}">
            <div class="result-title">
              <div class="result-tipo">${result.tipo}</div>
              <div class="result-nome">${result.nome}</div>
            </div>
            <div class="result-badge ${result.status === 'sucesso' ? 'success' : 'error'}">
              ${result.status === 'sucesso' ? '✅ Passou' : '❌ Falhou'}
            </div>
          </div>

          <div class="result-body">
            ${result.status === 'falha' ? `
              <div class="error-message">
                <strong>Erro:</strong>
                <p>${result.erro}</p>
              </div>

              ${result.variaveis_faltando && result.variaveis_faltando.length > 0 ? `
                <div class="missing-vars">
                  <div class="missing-vars-title">🔍 Variáveis Faltando:</div>
                  <div class="var-list">
                    ${result.variaveis_faltando.map((v: string) => `
                      <span class="var-tag">${v}</span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            ` : `
              <div class="success-message">
                ✅ Documento gerado com sucesso!
              </div>

              ${result.html_gerado ? `
                <div class="preview-section">
                  <div class="preview-title">📄 Preview do HTML (primeiros 500 caracteres):</div>
                  <div class="preview-html">
                    ${result.html_gerado.substring(0, 500).replace(/</g, '&lt;').replace(/>/g, '&gt;')}...
                  </div>
                </div>
              ` : ''}
            `}

            <div class="meta-info">
              <div class="meta-item">
                ⏱️ ${result.tempo_ms}ms
              </div>
              <div class="meta-item">
                📦 Payload: ${JSON.stringify(MOCK_PAYLOADS[result.tipo])}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Recommendations -->
    ${falharam > 0 ? `
      <div class="recommendations">
        <h2>💡 Recomendações de Correção</h2>

        ${resultados.filter(r => r.status === 'falha').map(result => `
          <div class="recommendation-item">
            <strong>${result.tipo} - ${result.nome}</strong>
            <ul>
              ${result.variaveis_faltando?.map((v: string) => `
                <li>Adicionar campo <code>${v}</code> na função <code>buscarDadosDocumento()</code></li>
              `).join('') || '<li>Verificar estrutura de dados no backend</li>'}
            </ul>
          </div>
        `).join('')}

        <div class="recommendation-item">
          <strong>📝 Próximos Passos:</strong>
          <ul>
            <li>Editar <code>src/app/api/documentos/gerar/route.ts</code></li>
            <li>Atualizar função <code>buscarDadosDocumento()</code> para incluir campos faltantes</li>
            <li>Verificar nomes de colunas no banco de dados (ex: data_inicio_contrato vs data_inicio)</li>
            <li>Re-executar este script para validar correções</li>
          </ul>
        </div>
      </div>
    ` : `
      <div class="recommendations" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
        <h2>🎉 Parabéns! Todos os testes passaram!</h2>
        <p style="color: #2e7d32; font-size: 16px; margin-top: 10px;">
          Todos os 10 templates de documentos estão funcionando corretamente. O sistema está pronto para produção!
        </p>
      </div>
    `}
  </div>
</body>
</html>
  `;

  fs.writeFileSync(REPORT_FILE, html, 'utf8');
  console.log(`\n✅ Relatório gerado: ${REPORT_FILE}`);
}

async function main() {
  console.log('🚀 Iniciando testes automatizados de templates...');
  console.log(`📡 API URL: ${API_URL}`);
  console.log(`📁 Relatório será salvo em: ${REPORT_FILE}\n`);

  // Configurar bypass de autenticação
  await configurarBypassAuth();

  const tipos: DocumentoTipo[] = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
  const resultados: TestResult[] = [];

  for (const tipo of tipos) {
    const resultado = await testarDocumento(tipo);
    resultados.push(resultado);

    // Pequeno delay entre testes para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(60));
  console.log(`✅ Aprovados: ${resultados.filter(r => r.status === 'sucesso').length}/${resultados.length}`);
  console.log(`❌ Falharam: ${resultados.filter(r => r.status === 'falha').length}/${resultados.length}`);
  console.log('='.repeat(60) + '\n');

  await gerarRelatorio(resultados);

  // Tentar abrir relatório no navegador
  try {
    const open = (await import('open')).default;
    await open(REPORT_FILE);
    console.log('🌐 Relatório aberto no navegador!');
  } catch (error) {
    console.log('\n💡 Abra manualmente o relatório em:', REPORT_FILE);
  }

  // Exit code baseado nos resultados
  process.exit(resultados.some(r => r.status === 'falha') ? 1 : 0);
}

main().catch(console.error);
