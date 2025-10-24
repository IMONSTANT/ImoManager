/**
 * Mock Data para Testes de Templates
 * Reproduz EXATAMENTE o que o frontend envia para a API
 */

export type DocumentoTipo = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'D10';

/**
 * Payloads que o FRONTEND envia (linha 223-229 do page.tsx)
 * Apenas IDs, não dados customizados!
 */
export const MOCK_PAYLOADS: Record<DocumentoTipo, any> = {
  // D1 - Ficha Cadastro Locatário - Requer contrato
  D1: {
    tipo: 'D1',
    contrato_id: 10
  },

  // D2 - Ficha Cadastro Fiador - Requer fiador
  D2: {
    tipo: 'D2',
    fiador_id: 1  // Precisa existir no banco
  },

  // D3 - Contrato de Locação - Requer contrato
  D3: {
    tipo: 'D3',
    contrato_id: 10
  },

  // D4 - Termo Vistoria Entrada - Requer contrato
  D4: {
    tipo: 'D4',
    contrato_id: 10
  },

  // D5 - Termo Vistoria Saída - Requer contrato
  D5: {
    tipo: 'D5',
    contrato_id: 10
  },

  // D6 - Autorização Débito - Requer contrato
  D6: {
    tipo: 'D6',
    contrato_id: 10
  },

  // D7 - Termo Entrega Chaves - Requer contrato
  D7: {
    tipo: 'D7',
    contrato_id: 10
  },

  // D8 - Notificação Atraso - Requer contrato + parcela
  D8: {
    tipo: 'D8',
    contrato_id: 10,
    parcela_id: 1  // Precisa existir no banco
  },

  // D9 - Acordo Rescisão - Requer contrato
  D9: {
    tipo: 'D9',
    contrato_id: 10
  },

  // D10 - Recibo Pagamento - Requer contrato + parcela
  D10: {
    tipo: 'D10',
    contrato_id: 10,
    parcela_id: 1  // Precisa existir no banco
  }
};

/**
 * Dados esperados que DEVERIAM vir do banco
 * (para comparação e análise de problemas)
 */
export const MOCK_DATA_ESPERADO_DO_BANCO = {
  // Dados do Locatário
  locatario: {
    nome: 'João da Silva Santos',
    cpf: '12345678901',
    rg: '1234567',
    email: 'joao.silva@email.com',
    telefone: '85987654321',
    nacionalidade: 'brasileiro',
    estado_civil: 'solteiro',
    profissao: 'Engenheiro Civil',
    renda_mensal: 8500.00,
    data_nascimento: '1990-05-15',
    endereco_residencial: 'Rua das Flores, 123, Apto 45, Centro, Fortaleza/CE'
  },

  // Dados do Fiador
  fiador: {
    nome: 'Maria Oliveira Costa',
    cpf: '98765432100',
    rg: '7654321',
    email: 'maria.costa@email.com',
    telefone: '85912345678',
    nacionalidade: 'brasileira',
    estado_civil: 'casada',
    profissao: 'Advogada',
    renda_mensal: 12000.00,
    data_nascimento: '1985-08-20',
    endereco_residencial: 'Avenida Santos Dumont, 500, Apto 101, Aldeota, Fortaleza/CE'
  },

  // Dados do Locador/Proprietário
  locador: {
    nome: 'Imonstant Gestão Imobiliária',
    cnpj: '12345678000190',
    nacionalidade: 'brasileira',
    estado_civil: 'não aplicável',
    endereco_completo: 'Rua Amadeu Furtado, 85, Sala 05, São Gerardo, Fortaleza/CE',
    telefone: '85999887766',
    email: 'contato@imonstant.com.br'
  },

  proprietario: {
    nome: 'Imonstant Gestão Imobiliária',
    cnpj: '12345678000190',
    nacionalidade: 'brasileira',
    estado_civil: 'não aplicável',
    endereco_completo: 'Rua Amadeu Furtado, 85, Sala 05, São Gerardo, Fortaleza/CE'
  },

  // Dados do Imóvel
  imovel: {
    tipo: 'casa',
    endereco_completo: 'Avenida Pintor João Figueiredo, 331, casa, Iparana, Caucaia/CE',
    endereco: {
      logradouro: 'Avenida Pintor João Figueiredo',
      numero: '331',
      complemento: 'casa',
      bairro: 'Iparana',
      cidade: 'Caucaia',
      uf: 'CE',
      cep: '61600000'
    },
    area_total: 120.50,
    area_construida: 95.00,
    quartos: 3,
    banheiros: 2,
    vagas_garagem: 2,
    iptu_anual: 1200.00
  },

  // Dados do Contrato
  contrato: {
    numero: 'CTR-2025-00010',
    data_inicio: '2025-01-15',
    data_fim: '2026-01-14',
    data_assinatura: '2025-01-10',
    valor: 2500.00,
    valor_caucao: 5000.00,
    dia_vencimento: 10,
    indice_reajuste: 'IGPM',
    prazo_meses: 12,
    tipo_garantia: 'caução',
    valor_condominio: 350.00,
    valor_iptu: 100.00,
    observacoes: 'Contrato inclui condomínio e IPTU',
    data_vencimento_caucao: '2025-01-20',
    data_devolucao_assinado: '2025-01-25'
  },

  // Dados de Parcela (para D8 e D10)
  parcela: {
    competencia: '01/2025',
    vencimento: '2025-01-10',
    data_vencimento: '2025-01-10',
    valor: 2500.00,
    principal: 2500.00,
    multa: 250.00,
    juros: 75.50,
    valor_total: 2825.50,
    dias_atraso: 15,
    status: 'em_atraso',
    numero: 1
  },

  // Dados de Pagamento (para D10)
  pagamento: {
    valor: 2825.50,
    data: '2025-01-25',
    data_pagamento: '2025-01-25',
    forma_pagamento: 'PIX',
    comprovante: 'PIX-202501251545',
    banco: 'Banco do Brasil',
    observacoes: 'Pagamento realizado via PIX'
  },

  // Dados de Conta Bancária (para D6)
  conta: {
    banco_codigo: '001',
    banco_nome: 'Banco do Brasil',
    banco: 'Banco do Brasil',
    agencia: '1234-5',
    numero: '12345678-9',
    titular: 'João da Silva Santos',
    cpf_titular: '12345678901',
    tipo_conta: 'Corrente'
  },

  // Dados de Chaves (para D7)
  chaves: {
    quantidade: 3,
    tipo: 'tetra',
    descricao: '2 chaves da porta principal e 1 chave do portão',
    data_entrega: '2025-01-15',
    tipo_entrega: 'definitiva'
  },

  // Dados de Vistoria (para D4 e D5)
  vistoria: {
    data_vistoria: '2025-01-15',
    vistoriador: 'Carlos Alberto Mendes',
    vistoriador_cargo: 'Corretor',
    tipo: 'entrada',
    observacoes_gerais: 'Imóvel em bom estado de conservação',

    // Estado de conservação por cômodo
    comodos: {
      sala: 'Bom estado, paredes pintadas recentemente',
      cozinha: 'Regular, armários com desgaste',
      quarto_1: 'Bom estado',
      quarto_2: 'Bom estado',
      quarto_3: 'Bom estado',
      banheiro_1: 'Bom estado, azulejos intactos',
      banheiro_2: 'Regular, torneira com pequeno vazamento',
      area_servico: 'Bom estado',
      garagem: 'Bom estado, piso limpo'
    },

    // Equipamentos e instalações
    equipamentos: {
      aquecedor: 'Presente e funcionando',
      ar_condicionado: 'Não possui',
      ventiladores: '3 unidades funcionando',
      fogao: 'Fogão 4 bocas em bom estado',
      geladeira: 'Não inclusa',
      maquina_lavar: 'Não inclusa'
    }
  },

  // Dados de Rescisão (para D9)
  rescisao: {
    motivo_rescisao: 'Mudança para outro estado',
    data_rescisao: '2025-06-30',
    tipo_rescisao: 'antecipada',
    multa_rescisoria: 2500.00,
    saldo_devedor: 0.00,
    saldo_credor: 4500.00,
    data_desocupacao: '2025-07-05',
    observacoes: 'Rescisão amigável, locatário pagou todas as contas em dia'
  },

  // Datas diversas
  data_emissao: new Date().toISOString().split('T')[0],
  data_geracao: new Date().toISOString().split('T')[0],
  data_notificacao: new Date().toISOString().split('T')[0],
  data_entrega: '2025-01-15',
  data_vistoria: '2025-01-15'
};
