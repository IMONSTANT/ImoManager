// ============================================================================
// E2E Test Framework - Reusable Testing Infrastructure
// Based on scripts/test-templates.ts pattern
// ============================================================================

import * as fs from 'fs';
import * as path from 'path';

export interface TestResult {
  nome: string;
  status: 'sucesso' | 'falha';
  erro?: string;
  detalhes?: any;
  tempo_ms: number;
}

export interface TestSuite {
  nome: string;
  total: number;
  sucessos: number;
  falhas: number;
  tempo_total_ms: number;
  resultados: TestResult[];
}

export interface CRUDTestResult {
  entityName: string;
  create: TestResult;
  read: TestResult;
  update: TestResult;
  delete: TestResult;
}

/**
 * E2E Test Runner - Executes tests against Supabase database directly
 * Uses service_role key with x-test-mode header to bypass auth
 */
export class E2ETestRunner {
  private supabaseUrl: string;
  private supabaseKey: string;

  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos');
    }
  }

  /**
   * Test CREATE operation
   */
  async testCreate(
    entityName: string,
    table: string,
    payload: any
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - CREATE`;

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        const data = await response.json();
        return {
          nome,
          status: 'sucesso',
          tempo_ms,
          detalhes: { id: data[0]?.id, data: data[0] }
        };
      } else {
        const errorData = await response.json();
        return {
          nome,
          status: 'falha',
          erro: errorData.message || `HTTP ${response.status}`,
          tempo_ms,
          detalhes: errorData
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Test CREATE operation - Expecting Failure (for validation tests)
   * Returns SUCCESS when the request fails (validation working correctly)
   */
  async testCreateExpectFailure(
    entityName: string,
    table: string,
    payload: any,
    expectedErrorPattern?: string
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - VALIDATION`;

    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        // Request succeeded when it should have failed - this is an error
        return {
          nome,
          status: 'falha',
          erro: 'Validação deveria ter rejeitado esta requisição mas ela foi aceita',
          tempo_ms,
          detalhes: await response.json()
        };
      } else {
        // Request failed as expected - this is success
        const errorData = await response.json();
        const errorMessage = errorData.message || `HTTP ${response.status}`;

        // If expectedErrorPattern is provided, verify it matches
        if (expectedErrorPattern && !errorMessage.includes(expectedErrorPattern)) {
          return {
            nome,
            status: 'falha',
            erro: `Erro esperado deve conter "${expectedErrorPattern}", mas recebeu: ${errorMessage}`,
            tempo_ms,
            detalhes: errorData
          };
        }

        return {
          nome,
          status: 'sucesso',
          tempo_ms,
          detalhes: { validacao_funcionou: true, erro_recebido: errorMessage }
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Test READ (list) operation
   */
  async testList(
    entityName: string,
    table: string,
    filters?: Record<string, any>
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - LIST`;

    try {
      let url = `${this.supabaseUrl}/rest/v1/${table}?deleted_at=is.null&order=created_at.desc`;

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          url += `&${key}=eq.${value}`;
        });
      }

      const response = await fetch(url, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
        },
      });

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        const data = await response.json();
        return {
          nome,
          status: 'sucesso',
          tempo_ms,
          detalhes: { count: data.length, sample: data[0] }
        };
      } else {
        const errorData = await response.json();
        return {
          nome,
          status: 'falha',
          erro: errorData.message || `HTTP ${response.status}`,
          tempo_ms
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Test READ (single) operation
   */
  async testGet(
    entityName: string,
    table: string,
    id: number
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - GET`;

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}&deleted_at=is.null`,
        {
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
          },
        }
      );

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            nome,
            status: 'sucesso',
            tempo_ms,
            detalhes: data[0]
          };
        } else {
          return {
            nome,
            status: 'falha',
            erro: `Registro com ID ${id} não encontrado`,
            tempo_ms
          };
        }
      } else {
        const errorData = await response.json();
        return {
          nome,
          status: 'falha',
          erro: errorData.message || `HTTP ${response.status}`,
          tempo_ms
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Test UPDATE operation
   */
  async testUpdate(
    entityName: string,
    table: string,
    id: number,
    payload: any
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - UPDATE`;

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(payload),
        }
      );

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        const data = await response.json();
        return {
          nome,
          status: 'sucesso',
          tempo_ms,
          detalhes: data[0]
        };
      } else {
        const errorData = await response.json();
        return {
          nome,
          status: 'falha',
          erro: errorData.message || `HTTP ${response.status}`,
          tempo_ms
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Test DELETE (soft delete) operation
   */
  async testDelete(
    entityName: string,
    table: string,
    id: number
  ): Promise<TestResult> {
    const inicio = Date.now();
    const nome = `${entityName} - DELETE`;

    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/${table}?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
          },
          body: JSON.stringify({ deleted_at: new Date().toISOString() }),
        }
      );

      const tempo_ms = Date.now() - inicio;

      if (response.ok) {
        return {
          nome,
          status: 'sucesso',
          tempo_ms
        };
      } else {
        const errorData = await response.json();
        return {
          nome,
          status: 'falha',
          erro: errorData.message || `HTTP ${response.status}`,
          tempo_ms
        };
      }
    } catch (error: any) {
      return {
        nome,
        status: 'falha',
        erro: `Erro de rede: ${error.message}`,
        tempo_ms: Date.now() - inicio
      };
    }
  }

  /**
   * Get last created ID from a table
   */
  async getLastCreatedId(table: string): Promise<number | null> {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/${table}?deleted_at=is.null&order=created_at.desc&limit=1`,
        {
          headers: {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data[0]?.id || null;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Complete CRUD test suite for an entity
   */
  async testCRUD(
    entityName: string,
    table: string,
    createPayload: any,
    updatePayload: any
  ): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // Test CREATE
    const createResult = await this.testCreate(entityName, table, createPayload);
    results.push(createResult);

    // If create failed, skip remaining tests
    if (createResult.status === 'falha') {
      console.log(`   ❌ CREATE falhou, pulando testes restantes`);
      return results;
    }

    const createdId = createResult.detalhes?.id;

    // Test LIST
    results.push(await this.testList(entityName, table));

    // Test GET (single)
    if (createdId) {
      results.push(await this.testGet(entityName, table, createdId));

      // Test UPDATE
      results.push(await this.testUpdate(entityName, table, createdId, updatePayload));

      // Test DELETE
      results.push(await this.testDelete(entityName, table, createdId));
    }

    return results;
  }

  /**
   * Generate beautiful HTML report (based on test-templates.ts)
   */
  generateHTMLReport(suite: TestSuite, outputPath: string): void {
    const aprovados = suite.sucessos;
    const falharam = suite.falhas;
    const total = suite.total;
    const percentual = total > 0 ? ((aprovados / total) * 100).toFixed(1) : '0.0';

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${suite.nome} - Relatório de Testes E2E</title>
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
      grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
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

    .success-message {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      border-radius: 5px;
      color: #155724;
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

    .details-section {
      margin-top: 15px;
      padding: 15px;
      background: #f7fafc;
      border-radius: 8px;
      font-size: 12px;
      font-family: 'Monaco', 'Courier New', monospace;
      max-height: 200px;
      overflow-y: auto;
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
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📊 ${suite.nome}</h1>
      <p class="subtitle">
        Gerado em: ${new Date().toLocaleString('pt-BR')}<br>
        Tempo total de execução: ${suite.tempo_total_ms}ms
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
      ${suite.resultados.map(result => `
        <div class="result-card">
          <div class="result-header ${result.status === 'sucesso' ? 'success' : 'error'}">
            <div class="result-title">
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
            ` : `
              <div class="success-message">
                ✅ Operação executada com sucesso!
              </div>
            `}

            ${result.detalhes ? `
              <div class="details-section">
                ${JSON.stringify(result.detalhes, null, 2).substring(0, 500)}
              </div>
            ` : ''}

            <div class="meta-info">
              <div class="meta-item">
                ⏱️ ${result.tempo_ms}ms
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Summary -->
    ${falharam === 0 ? `
      <div class="recommendations" style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);">
        <h2>🎉 Parabéns! Todos os testes passaram!</h2>
        <p style="color: #2e7d32; font-size: 16px; margin-top: 10px;">
          Todos os testes de ${suite.nome} foram executados com sucesso. O sistema está funcionando corretamente!
        </p>
      </div>
    ` : `
      <div class="recommendations">
        <h2>⚠️ Alguns testes falharam</h2>
        <p style="color: #856404; font-size: 16px; margin-top: 10px;">
          ${falharam} teste(s) falharam. Revise os erros acima para corrigir os problemas.
        </p>
      </div>
    `}
  </div>
</body>
</html>
    `;

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html, 'utf8');
  }

  /**
   * Log test result to console
   */
  logTestResult(result: TestResult): void {
    if (result.status === 'sucesso') {
      console.log(`   ✅ ${result.nome} (${result.tempo_ms}ms)`);
    } else {
      console.log(`   ❌ ${result.nome}: ${result.erro} (${result.tempo_ms}ms)`);
    }
  }
}
