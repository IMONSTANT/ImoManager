// ============================================================================
// Mock Data Generator - Realistic test data matching frontend payloads
// ============================================================================

/**
 * Generates realistic mock data for testing all entities
 * Matches the exact structure expected by frontend forms
 */
export class MockDataGenerator {

  /**
   * Generate valid CPF (Brazilian tax ID for individuals)
   * Returns WITHOUT mask (11 digits only) to match database format
   */
  generateCPF(): string {
    // Generate 11 random digits
    const randomDigits = () => Math.floor(Math.random() * 10);
    const cpf = Array.from({ length: 11 }, randomDigits);

    // Return WITHOUT mask (database expects CHAR(11))
    return cpf.join('');
  }

  /**
   * Generate valid CNPJ (Brazilian tax ID for companies)
   */
  generateCNPJ(): string {
    // Generate 14 random digits
    const randomDigits = () => Math.floor(Math.random() * 10);
    const cnpj = Array.from({ length: 14 }, randomDigits);

    // Format: XX.XXX.XXX/XXXX-XX
    return `${cnpj.slice(0, 2).join('')}.${cnpj.slice(2, 5).join('')}.${cnpj.slice(5, 8).join('')}/${cnpj.slice(8, 12).join('')}-${cnpj.slice(12, 14).join('')}`;
  }

  /**
   * Generate random Brazilian phone number
   */
  generatePhone(): string {
    const ddd = Math.floor(Math.random() * 90) + 10; // 10-99
    const firstDigit = 9;
    const number = Math.floor(Math.random() * 90000000) + 10000000;
    return `(${ddd}) ${firstDigit}${number.toString().substring(0, 4)}-${number.toString().substring(4)}`;
  }

  /**
   * Generate random email
   */
  generateEmail(name?: string): string {
    const randomId = Math.floor(Math.random() * 10000);
    const sanitizedName = name?.toLowerCase().replace(/\s+/g, '.') || `user${randomId}`;
    return `${sanitizedName}@teste.com`;
  }

  /**
   * Generate random date in the past
   */
  generatePastDate(yearsAgo: number = 30): string {
    const now = new Date();
    const past = new Date(now.getFullYear() - yearsAgo, 0, 1);
    const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  /**
   * Generate random date in the future
   */
  generateFutureDate(yearsAhead: number = 2): string {
    const now = new Date();
    const future = new Date(now.getFullYear() + yearsAhead, 11, 31);
    const randomTime = now.getTime() + Math.random() * (future.getTime() - now.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  /**
   * Generate random CEP (Brazilian postal code)
   * Returns WITHOUT dash (8 digits only) to match database CHAR(8) format
   */
  generateCEP(): string {
    const num = Math.floor(Math.random() * 90000000) + 10000000;
    return num.toString(); // Database expects CHAR(8) without formatting
  }

  /**
   * Generate Pessoa (Person) data
   */
  generatePessoa(tipo: 'PF' | 'PJ' = 'PF') {
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Rafael', 'Fernanda'];
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Costa', 'Ferreira', 'Rodrigues'];
    const companies = ['Tech Ltda', 'Imóveis SA', 'Construtora ABC', 'Serviços XYZ', 'Comercial 123'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = tipo === 'PF' ? `${firstName} ${lastName}` : `${companies[Math.floor(Math.random() * companies.length)]}`;

    return {
      nome: fullName,
      tipo,
      data_nascimento: tipo === 'PF' ? this.generatePastDate(50) : null,
      cpf: tipo === 'PF' ? this.generateCPF() : null,  // CPF sem máscara
      rg: tipo === 'PF' ? String(Math.floor(Math.random() * 90000000) + 10000000) : null,
      estado_civil: tipo === 'PF' ? ['solteiro(a)', 'casado(a)', 'divorciado(a)', 'viúvo(a)'][Math.floor(Math.random() * 4)] : null,
      nacionalidade: 'brasileiro(a)',
      profissao_id: null,
      email: this.generateEmail(fullName),
      telefone: this.generatePhone(),
      observacoes: 'Cadastro criado via teste automatizado',
    };
  }

  /**
   * Generate Endereco (Address) data
   */
  generateEndereco() {
    const streets = ['Rua das Flores', 'Av. Principal', 'Rua do Comércio', 'Av. Paulista', 'Rua São João'];
    const neighborhoods = ['Centro', 'Jardim América', 'Vila Nova', 'Bela Vista', 'Morumbi'];
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'];
    const states = ['SP', 'RJ', 'MG', 'PR', 'RS'];

    return {
      logradouro: streets[Math.floor(Math.random() * streets.length)],
      numero: String(Math.floor(Math.random() * 9000) + 100),
      complemento: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 100) + 1}` : '',
      bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      cidade: cities[Math.floor(Math.random() * cities.length)],
      uf: states[Math.floor(Math.random() * states.length)],
      cep: this.generateCEP(),
    };
  }

  /**
   * Generate Locador (Landlord) data
   * Schema: pessoa_id (required), tipo_pessoa (fisica/juridica), cnpj, razao_social
   */
  generateLocador(pessoaId: number, tipo: 'fisica' | 'juridica' = 'fisica') {
    const base = {
      pessoa_id: pessoaId,
      tipo_pessoa: tipo,
    };

    // Add CNPJ and razao_social only for juridica
    if (tipo === 'juridica') {
      return {
        ...base,
        cnpj: this.generateCNPJ().replace(/[^\d]/g, ''), // Remove formatting for database
        razao_social: 'Empresa Locadora Ltda',
      };
    }

    return base;
  }

  /**
   * Generate Locatario (Tenant) data
   * Schema: pessoa_id (required), referencias (text), renda_mensal (decimal)
   */
  generateLocatario(pessoaId: number) {
    return {
      pessoa_id: pessoaId,
      renda_mensal: (Math.floor(Math.random() * 10000) + 3000).toFixed(2),
      referencias: 'Referências comerciais e pessoais - Teste automatizado',
    };
  }

  /**
   * Generate Fiador (Guarantor) data
   * Schema: pessoa_id (required), patrimonio_estimado (decimal), observacoes (text)
   */
  generateFiador(pessoaId: number) {
    return {
      pessoa_id: pessoaId,
      patrimonio_estimado: (Math.floor(Math.random() * 500000) + 200000).toFixed(2),
      observacoes: 'Fiador criado via teste automatizado',
    };
  }

  /**
   * Generate Profissao (Profession) data
   */
  generateProfissao() {
    const profissoes = [
      'Engenheiro',
      'Médico',
      'Advogado',
      'Professor',
      'Contador',
      'Arquiteto',
      'Designer',
      'Programador'
    ];
    return {
      descricao: profissoes[Math.floor(Math.random() * profissoes.length)] + ` ${Math.floor(Math.random() * 1000)}`,
    };
  }

  /**
   * Generate Tipo Imovel (Property Type) data
   */
  generateTipoImovel() {
    const tipos = ['Casa', 'Apartamento', 'Kitnet', 'Sobrado', 'Cobertura', 'Loft', 'Studio'];
    return {
      descricao: tipos[Math.floor(Math.random() * tipos.length)] + ` ${Date.now()}`,
    };
  }

  /**
   * Generate Caracteristica Imovel (Property Feature) data
   */
  generateCaracteristicaImovel() {
    const caracteristicas = [
      'Piscina',
      'Churrasqueira',
      'Academia',
      'Salão de Festas',
      'Playground',
      'Portaria 24h',
      'Elevador',
      'Garagem Coberta'
    ];
    return {
      descricao: caracteristicas[Math.floor(Math.random() * caracteristicas.length)] + ` ${Math.floor(Math.random() * 100)}`,
    };
  }

  /**
   * Generate Condicao Pagamento (Payment Condition) data
   */
  generateCondicaoPagamento() {
    const condicoes = [
      'À Vista',
      'Boleto Mensal',
      'Débito Automático',
      'PIX',
      'Transferência Bancária',
      'Cheque'
    ];
    return {
      descricao: condicoes[Math.floor(Math.random() * condicoes.length)] + ` ${Math.floor(Math.random() * 100)}`,
      dias_vencimento: Math.floor(Math.random() * 28) + 1,
    };
  }

  /**
   * Generate Empresa Cliente (Client Company) data
   */
  generateEmpresaCliente(enderecoId: number, imovelId?: number) {
    const companies = [
      'Tech Solutions Ltda',
      'Consultoria Empresarial SA',
      'Comércio Digital ME',
      'Serviços Profissionais Ltda',
      'Indústria Moderna SA'
    ];

    return {
      razao_social: companies[Math.floor(Math.random() * companies.length)],
      nome_fantasia: 'Fantasia ' + companies[Math.floor(Math.random() * companies.length)],
      cnpj: this.generateCNPJ(),
      inscricao_estadual: String(Math.floor(Math.random() * 900000000) + 100000000),
      email: this.generateEmail('empresa'),
      telefone: this.generatePhone(),
      endereco_id: enderecoId,
      imovel_id: imovelId || null,
      observacoes: 'Empresa criada via teste automatizado',
    };
  }

  /**
   * Generate Imovel (Property) data
   * Schema: endereco_id, locador_id, tipo_imovel_id (required FKs)
   *         codigo_imovel, descricao, area_total, area_construida
   *         quartos, banheiros, vagas_garagem
   *         valor_aluguel (required), valor_condominio, iptu
   *         disponivel (default true), data_disponibilidade, observacoes
   */
  generateImovel(enderecoId: number, locadorId: number, tipoImovelId: number) {
    // Gerar área total primeiro
    const areaTotal = Math.floor(Math.random() * 300) + 50; // 50-350m²
    // Área construída deve ser entre 60% e 95% da área total
    const areaConstruida = Math.floor(areaTotal * (0.6 + Math.random() * 0.35));

    return {
      endereco_id: enderecoId,
      locador_id: locadorId,
      tipo_imovel_id: tipoImovelId,
      codigo_imovel: `COD-${Math.floor(Math.random() * 900000) + 100000}`,
      descricao: 'Imóvel para locação - Teste automatizado',
      area_total: areaTotal.toFixed(2),
      area_construida: areaConstruida.toFixed(2),
      quartos: Math.floor(Math.random() * 4) + 1,
      banheiros: Math.floor(Math.random() * 3) + 1,
      vagas_garagem: Math.floor(Math.random() * 3) + 1,
      valor_aluguel: (Math.floor(Math.random() * 5000) + 1000).toFixed(2),
      iptu: (Math.floor(Math.random() * 500) + 100).toFixed(2),
      valor_condominio: (Math.floor(Math.random() * 800) + 200).toFixed(2),
      disponivel: true,
      data_disponibilidade: this.generatePastDate(0), // Today or recent
      observacoes: 'Imóvel criado via teste automatizado',
    };
  }

  /**
   * Generate Contrato Locacao (Rental Contract) data
   */
  generateContrato(
    imovelId: number,
    locatarioId: number,
    tipoLocacaoId: number,
    fiadorId?: number
  ) {
    const dataInicio = this.generatePastDate(1);
    const dataFim = this.generateFutureDate(2);

    return {
      imovel_id: imovelId,
      locatario_id: locatarioId,
      fiador_id: fiadorId || null,
      tipo_locacao_id: tipoLocacaoId,
      data_inicio_contrato: dataInicio,
      data_fim_contrato: dataFim,
      valor: (Math.floor(Math.random() * 5000) + 1000).toFixed(2),
      valor_iptu: (Math.floor(Math.random() * 500) + 100).toFixed(2),
      valor_condominio: (Math.floor(Math.random() * 800) + 200).toFixed(2),
      dia_vencimento: Math.floor(Math.random() * 28) + 1,
      indice_reajuste: 'IGPM',
      periodicidade_reajuste: 12,
      status: 'ativo',
      observacoes: 'Contrato criado via teste automatizado',
    };
  }

  /**
   * Generate Parcela (Installment) data
   */
  generateParcela(contratoId: number, numeroParce: number) {
    const hoje = new Date();
    const dataVencimento = new Date(hoje);
    dataVencimento.setMonth(hoje.getMonth() + numeroParce);

    return {
      contrato_id: contratoId,
      numero_parcela: numeroParce,
      data_vencimento: dataVencimento.toISOString().split('T')[0],
      valor: (Math.floor(Math.random() * 5000) + 1000).toFixed(2),
      status: 'pendente',
      tipo: 'aluguel',
      observacoes: 'Parcela criada via teste automatizado',
    };
  }

  /**
   * Generate Cobranca (Charge) data
   */
  generateCobranca(parcelaId: number) {
    return {
      parcela_id: parcelaId,
      tipo_cobranca: 'email',
      data_envio: new Date().toISOString(),
      status: 'enviada',
      observacoes: 'Cobrança criada via teste automatizado',
    };
  }

  /**
   * Generate Vistoria (Inspection) data
   */
  generateVistoria(imovelId: number, contratoId: number, tipo: 'entrada' | 'saida') {
    return {
      imovel_id: imovelId,
      contrato_id: contratoId,
      tipo,
      data_vistoria: new Date().toISOString().split('T')[0],
      responsavel: 'Vistoriador Teste',
      observacoes: 'Vistoria criada via teste automatizado',
      status: 'concluida',
    };
  }

  /**
   * Generate Rescisao (Contract Termination) data
   */
  generateRescisao(contratoId: number) {
    return {
      contrato_id: contratoId,
      data_rescisao: new Date().toISOString().split('T')[0],
      motivo: 'Teste automatizado',
      multa_rescisoria: (Math.floor(Math.random() * 3000) + 500).toFixed(2),
      observacoes: 'Rescisão criada via teste automatizado',
    };
  }

  /**
   * Generate Chave (Key) data
   */
  generateChave(imovelId: number) {
    return {
      imovel_id: imovelId,
      numero_chave: `CH-${Math.floor(Math.random() * 9000) + 1000}`,
      tipo: 'original',
      localizacao: 'Cofre da imobiliária',
      status: 'disponivel',
      observacoes: 'Chave criada via teste automatizado',
    };
  }

  /**
   * Generate Pendencia (Pending Issue) data
   */
  generatePendencia(imovelId: number, contratoId?: number) {
    const tipos = ['manutencao', 'documentacao', 'pagamento', 'vistoria'];
    const prioridades = ['baixa', 'media', 'alta', 'urgente'];

    return {
      imovel_id: imovelId,
      contrato_id: contratoId || null,
      tipo: tipos[Math.floor(Math.random() * tipos.length)],
      descricao: 'Pendência criada via teste automatizado para validação',
      prioridade: prioridades[Math.floor(Math.random() * prioridades.length)],
      status: 'aberta',
      data_abertura: new Date().toISOString().split('T')[0],
      observacoes: 'Teste automatizado',
    };
  }
}
