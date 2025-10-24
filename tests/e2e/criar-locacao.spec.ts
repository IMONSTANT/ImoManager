import { test, expect } from '@playwright/test';

test.describe('Criar Nova Locação - Fluxo Completo', () => {
  test.beforeEach(async ({ page }) => {
    // Login (assumindo que existe uma rota de login)
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('deve completar o fluxo de criação de locação com caução', async ({ page }) => {
    // Navegar para nova locação
    await page.goto('/locacoes/nova');
    await expect(page.getByText('Nova Locação')).toBeVisible();

    // STEP 0: Selecionar Imóvel
    await expect(page.getByText('Seleção de Imóvel')).toBeVisible();
    await page.waitForSelector('[data-testid="imovel-card"]', { timeout: 5000 });

    const primeiroImovel = page.locator('[data-testid="imovel-card"]').first();
    await primeiroImovel.click();

    // Verificar que botão "Próximo" está habilitado
    const proximoButton = page.getByRole('button', { name: /próximo/i });
    await expect(proximoButton).toBeEnabled();
    await proximoButton.click();

    // STEP 1: Dados do Locatário
    await expect(page.getByText('Dados do Locatário')).toBeVisible();

    // Preencher formulário de novo locatário
    await page.fill('[id="nome"]', 'João Silva Teste');
    await page.fill('[id="cpf_cnpj"]', '123.456.789-09');
    await page.fill('[id="email"]', 'joao.teste@email.com');
    await page.fill('[id="telefone"]', '(11) 98765-4321');
    await page.fill('[id="logradouro"]', 'Rua de Teste');
    await page.fill('[id="numero"]', '123');
    await page.fill('[id="bairro"]', 'Centro');
    await page.fill('[id="cidade"]', 'São Paulo');
    await page.fill('[id="uf"]', 'SP');
    await page.fill('[id="cep"]', '01000-000');

    // Clicar em continuar
    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 2: Escolha de Garantia (Caução)
    await expect(page.getByText('Escolha de Garantia')).toBeVisible();

    // Selecionar caução
    await page.getByLabel(/caução/i).check();

    // Preencher valor da caução
    await page.fill('[id="valor"]', '4500');

    // Clicar em continuar
    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 3: Dados Financeiros
    await expect(page.getByText('Dados Financeiros')).toBeVisible();

    await page.fill('[id="valor_iptu"]', '100');
    await page.fill('[id="valor_condominio"]', '300');
    await page.fill('[id="dia_vencimento"]', '10');

    // Selecionar índice de reajuste
    await page.click('[id="indice_reajuste"]');
    await page.getByText('IGPM').click();

    // Data de início (hoje + 1 dia)
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataFormatada = amanha.toISOString().split('T')[0];
    await page.fill('[id="data_inicio"]', dataFormatada);

    await page.fill('[id="duracao_meses"]', '12');

    // Clicar em continuar
    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 4: Preview e Confirmação
    await expect(page.getByText('Preview do Contrato')).toBeVisible();

    // Verificar que os dados estão corretos
    await expect(page.getByText('João Silva Teste')).toBeVisible();
    await expect(page.getByText('R$ 4.500,00')).toBeVisible(); // Caução
    await expect(page.getByText('R$ 1.900,00')).toBeVisible(); // Total mensal (aluguel + IPTU + cond)

    // Confirmar criação
    await page.getByRole('button', { name: /gerar contrato/i }).click();

    // Verificar sucesso
    await expect(page.getByText(/contrato criado com sucesso/i)).toBeVisible({ timeout: 10000 });

    // Verificar redirecionamento para página do contrato
    await page.waitForURL(/\/contratos\/.*/, { timeout: 5000 });
  });

  test('deve completar o fluxo de criação de locação com fiador', async ({ page }) => {
    await page.goto('/locacoes/nova');

    // STEP 0: Selecionar Imóvel
    const primeiroImovel = page.locator('[data-testid="imovel-card"]').first();
    await primeiroImovel.click();
    await page.getByRole('button', { name: /próximo/i }).click();

    // STEP 1: Dados do Locatário (resumido)
    await page.fill('[id="nome"]', 'Maria Silva Teste');
    await page.fill('[id="cpf_cnpj"]', '987.654.321-00');
    await page.fill('[id="email"]', 'maria.teste@email.com');
    await page.fill('[id="telefone"]', '(11) 91234-5678');
    await page.fill('[id="logradouro"]', 'Av. Teste');
    await page.fill('[id="numero"]', '456');
    await page.fill('[id="bairro"]', 'Jardins');
    await page.fill('[id="cidade"]', 'São Paulo');
    await page.fill('[id="uf"]', 'SP');
    await page.fill('[id="cep"]', '01000-100');
    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 2: Escolha de Garantia (Fiador)
    await page.getByLabel(/fiador/i).check();

    // Preencher dados do fiador
    await page.fill('[id="nome"]', 'Pedro Fiador Teste');
    await page.fill('[id="cpf"]', '111.222.333-44');
    await page.fill('[id="email"]', 'pedro.fiador@email.com');
    await page.fill('[id="telefone"]', '(11) 99999-8888');
    await page.fill('[id="profissao"]', 'Engenheiro');
    await page.fill('[id="renda_mensal"]', '10000');

    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 3: Dados Financeiros (resumido)
    await page.fill('[id="valor_iptu"]', '150');
    await page.fill('[id="valor_condominio"]', '350');
    await page.fill('[id="dia_vencimento"]', '5');
    await page.click('[id="indice_reajuste"]');
    await page.getByText('IPCA').click();

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    await page.fill('[id="data_inicio"]', amanha.toISOString().split('T')[0]);
    await page.fill('[id="duracao_meses"]', '24');

    await page.getByRole('button', { name: /continuar/i }).click();

    // STEP 4: Preview
    await expect(page.getByText('Preview do Contrato')).toBeVisible();
    await expect(page.getByText('Maria Silva Teste')).toBeVisible();
    await expect(page.getByText('Pedro Fiador Teste')).toBeVisible();
    await expect(page.getByText(/fiador/i)).toBeVisible();

    // Confirmar
    await page.getByRole('button', { name: /gerar contrato/i }).click();
    await expect(page.getByText(/contrato criado com sucesso/i)).toBeVisible({ timeout: 10000 });
  });

  test('deve permitir navegar entre steps', async ({ page }) => {
    await page.goto('/locacoes/nova');

    // Selecionar imóvel
    await page.locator('[data-testid="imovel-card"]').first().click();
    await page.getByRole('button', { name: /próximo/i }).click();

    // Avançar para step 1
    await expect(page.getByText('Dados do Locatário')).toBeVisible();

    // Voltar para step 0
    await page.getByRole('button', { name: /anterior/i }).click();
    await expect(page.getByText('Seleção de Imóvel')).toBeVisible();

    // Verificar que imóvel ainda está selecionado
    const cardSelecionado = page.locator('[data-testid="imovel-card"]').first();
    await expect(cardSelecionado).toHaveClass(/selected/);
  });

  test('deve validar campos obrigatórios', async ({ page }) => {
    await page.goto('/locacoes/nova');

    // Tentar avançar sem selecionar imóvel
    const proximoButton = page.getByRole('button', { name: /próximo/i });
    await expect(proximoButton).toBeDisabled();

    // Selecionar imóvel
    await page.locator('[data-testid="imovel-card"]').first().click();
    await expect(proximoButton).toBeEnabled();
  });

  test('deve salvar rascunho', async ({ page }) => {
    await page.goto('/locacoes/nova');

    // Selecionar imóvel
    await page.locator('[data-testid="imovel-card"]').first().click();

    // Clicar em salvar rascunho
    await page.getByRole('button', { name: /salvar rascunho/i }).click();

    // Verificar mensagem de sucesso
    await expect(page.getByText(/rascunho salvo com sucesso/i)).toBeVisible();
  });

  test('deve permitir cancelar criação', async ({ page }) => {
    await page.goto('/locacoes/nova');

    // Clicar em cancelar
    await page.getByRole('button', { name: /cancelar/i }).click();

    // Verificar redirecionamento
    await page.waitForURL('/dashboard');
  });
});
