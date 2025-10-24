import { z } from 'zod';

/**
 * Validação de CPF
 */
function validarCPF(cpf: string): boolean {
  const cpfLimpo = cpf.replace(/\D/g, '');

  if (cpfLimpo.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;

  if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;

  return digito2 === parseInt(cpfLimpo.charAt(10));
}

/**
 * Validação de CNPJ
 */
function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/\D/g, '');

  if (cnpjLimpo.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

  let tamanho = cnpjLimpo.length - 2;
  let numeros = cnpjLimpo.substring(0, tamanho);
  let digitos = cnpjLimpo.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho = tamanho + 1;
  numeros = cnpjLimpo.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

/**
 * Schema para endereço
 */
export const enderecoSchema = z.object({
  logradouro: z.string().min(3, 'Logradouro deve ter no mínimo 3 caracteres'),
  numero: z.string().min(1, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(2, 'Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  uf: z.string().length(2, 'UF deve ter 2 caracteres').toUpperCase(),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
});

/**
 * Schema para documento de upload
 */
export const documentoSchema = z.object({
  tipo: z.enum(['rg', 'cpf', 'comprovante_renda', 'comprovante_residencia', 'outro']),
  arquivo: z.instanceof(File).optional(),
  url: z.string().url().optional(),
}).refine(
  (data) => data.arquivo || data.url,
  { message: 'Arquivo ou URL é obrigatório' }
);

/**
 * Schema para novo locatário
 */
export const locatarioNovoSchema = z.object({
  tipo_pessoa: z.enum(['fisica', 'juridica']),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf_cnpj: z.string().refine(
    (doc) => {
      const limpo = doc.replace(/\D/g, '');
      return limpo.length === 11 ? validarCPF(limpo) : validarCNPJ(limpo);
    },
    { message: 'CPF/CNPJ inválido' }
  ),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  endereco: enderecoSchema,
  profissao: z.string().min(2, 'Profissão é obrigatória').optional(),
  renda_mensal: z.number().positive('Renda deve ser positiva').optional(),
  documentos: z.array(documentoSchema).min(1, 'Pelo menos 1 documento é obrigatório'),
});

/**
 * Schema para seleção de locatário existente
 */
export const locatarioExistenteSchema = z.object({
  id: z.string().uuid('ID inválido'),
  nome: z.string(),
  cpf_cnpj: z.string(),
  email: z.string(),
  telefone: z.string(),
});

/**
 * Schema para dados do locatário (novo ou existente)
 */
export const locatarioFormSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('novo'),
    dados: locatarioNovoSchema,
  }),
  z.object({
    tipo: z.literal('existente'),
    dados: locatarioExistenteSchema,
  }),
]);

/**
 * Schema para fiador
 */
export const fiadorSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().refine(validarCPF, { message: 'CPF inválido' }),
  email: z.string().email('Email inválido'),
  telefone: z.string().regex(/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'),
  endereco: enderecoSchema,
  profissao: z.string().min(2, 'Profissão é obrigatória'),
  renda_mensal: z.number().positive('Renda deve ser positiva'),
  documentos: z.array(documentoSchema).min(2, 'Mínimo 2 documentos (RG e comprovante de renda)'),
});

/**
 * Schema para garantia
 */
export const garantiaSchema = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('caucao'),
    valor: z.number().positive('Valor deve ser positivo'),
  }),
  z.object({
    tipo: z.literal('fiador'),
    fiador: fiadorSchema,
  }),
]);

/**
 * Schema para dados financeiros
 */
export const dadosFinanceirosSchema = z.object({
  valor_aluguel: z.number().positive('Valor do aluguel deve ser positivo'),
  valor_iptu: z.number().nonnegative('Valor do IPTU não pode ser negativo').default(0),
  valor_condominio: z.number().nonnegative('Valor do condomínio não pode ser negativo').default(0),
  dia_vencimento: z.number().int().min(1, 'Dia deve ser entre 1 e 31').max(31, 'Dia deve ser entre 1 e 31'),
  indice_reajuste: z.enum(['IGPM', 'IPCA', 'INPC', 'Nenhum']),
  data_inicio: z.date(),
  duracao_meses: z.number().int().positive('Duração deve ser positiva').min(6, 'Mínimo 6 meses'),
  observacoes: z.string().optional(),
}).refine(
  (data) => {
    // Validar que a data de início não é no passado
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return data.data_inicio >= hoje;
  },
  { message: 'Data de início não pode ser no passado', path: ['data_inicio'] }
);

/**
 * Schema para filtros de imóveis
 */
export const filtrosImoveisSchema = z.object({
  tipo: z.enum(['apartamento', 'casa', 'comercial', 'terreno', 'todos']).default('todos'),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  valor_min: z.number().nonnegative().optional(),
  valor_max: z.number().nonnegative().optional(),
  quartos_min: z.number().int().nonnegative().optional(),
  vagas_min: z.number().int().nonnegative().optional(),
}).refine(
  (data) => {
    if (data.valor_min && data.valor_max) {
      return data.valor_min <= data.valor_max;
    }
    return true;
  },
  { message: 'Valor mínimo não pode ser maior que o máximo', path: ['valor_max'] }
);

/**
 * Schema completo para nova locação
 */
export const novaLocacaoSchema = z.object({
  imovel_id: z.string().uuid('ID do imóvel inválido'),
  locatario: locatarioFormSchema,
  garantia: garantiaSchema,
  dados_financeiros: dadosFinanceirosSchema,
});

/**
 * Tipos TypeScript extraídos dos schemas
 */
export type EnderecoFormData = z.infer<typeof enderecoSchema>;
export type DocumentoFormData = z.infer<typeof documentoSchema>;
export type LocatarioNovoFormData = z.infer<typeof locatarioNovoSchema>;
export type LocatarioExistenteFormData = z.infer<typeof locatarioExistenteSchema>;
export type LocatarioFormData = z.infer<typeof locatarioFormSchema>;
export type FiadorFormData = z.infer<typeof fiadorSchema>;
export type GarantiaFormData = z.infer<typeof garantiaSchema>;
export type DadosFinanceirosFormData = z.infer<typeof dadosFinanceirosSchema>;
export type FiltrosImoveisFormData = z.infer<typeof filtrosImoveisSchema>;
export type NovaLocacaoFormData = z.infer<typeof novaLocacaoSchema>;
