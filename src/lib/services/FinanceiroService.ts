/**
 * FINANCEIRO SERVICE
 *
 * Implementação das regras de negócio financeiras do sistema imobiliário
 * Baseado no SRS - Seção 8 (Regras de Negócio)
 *
 * Regras Implementadas:
 * - RN-3.3: Cálculo de Multa e Juros
 * - RN-3.4: Pagamento Parcial
 * - RN-4: Reajuste Anual
 */

/**
 * Configuração padrão de cálculos financeiros
 * Valores conforme SRS - RN-3.3
 */
const CONFIG_PADRAO = {
  PERCENTUAL_MULTA: 2.0,        // 2%
  PERCENTUAL_JUROS_DIA: 0.033,  // 0,033% ao dia (1% ao mês)
  CASAS_DECIMAIS: 2,
}

/**
 * Arredonda valor para 2 casas decimais (padrão monetário)
 */
function arredondar(valor: number, casasDecimais = CONFIG_PADRAO.CASAS_DECIMAIS): number {
  return Number(valor.toFixed(casasDecimais))
}

/**
 * Valida que um valor não seja negativo
 */
function validarPositivo(valor: number, nomeCampo: string): void {
  if (valor < 0) {
    throw new Error(`${nomeCampo} não pode ser negativo`)
  }
}

/**
 * Interface para resultado de cálculo de valor total
 */
interface CalculoValorTotal {
  principal: number
  desconto?: number
  valorBase?: number
  multa: number
  juros: number
  total: number
}

/**
 * Interface para dívida (usado em pagamento parcial)
 */
interface Divida {
  principal: number
  multa: number
  juros: number
}

/**
 * Interface para resultado de pagamento parcial
 */
interface ResultadoPagamentoParcial {
  principal: number
  multa: number
  juros: number
  valorPago: number
  saldoDevedor: number
  quitado?: boolean
}

/**
 * Interface para resultado de reajuste
 */
interface ResultadoReajuste {
  valorAnterior: number
  percentualReajuste: number
  valorReajustado: number
  diferenca: number
}

/**
 * FINANCEIRO SERVICE
 *
 * Todas as funções são puras (sem side effects) para facilitar testes
 */
export class FinanceiroService {
  /**
   * RN-3.3: Calcula multa de 2% sobre o principal
   *
   * @param principal - Valor base do aluguel
   * @param percentual - Percentual de multa (padrão: 2%)
   * @returns Valor da multa arredondado para 2 casas decimais
   *
   * @example
   * ```ts
   * FinanceiroService.calcularMulta(1000.00)  // 20.00
   * FinanceiroService.calcularMulta(1000.00, 5.0)  // 50.00
   * ```
   */
  static calcularMulta(
    principal: number,
    percentual: number = CONFIG_PADRAO.PERCENTUAL_MULTA
  ): number {
    validarPositivo(principal, 'Principal')
    validarPositivo(percentual, 'Percentual de multa')

    if (principal === 0) return 0

    const multa = principal * (percentual / 100)
    return arredondar(multa)
  }

  /**
   * RN-3.3: Calcula juros de mora de 0,033% ao dia
   *
   * @param principal - Valor base do aluguel
   * @param diasAtraso - Número de dias em atraso
   * @param percentualDia - Percentual de juros por dia (padrão: 0,033%)
   * @returns Valor dos juros arredondado para 2 casas decimais
   *
   * @example
   * ```ts
   * FinanceiroService.calcularJurosMora(1000.00, 1)   // 0.33
   * FinanceiroService.calcularJurosMora(1000.00, 10)  // 3.30
   * FinanceiroService.calcularJurosMora(1000.00, 30)  // 9.90 (≈ 1%)
   * ```
   */
  static calcularJurosMora(
    principal: number,
    diasAtraso: number,
    percentualDia: number = CONFIG_PADRAO.PERCENTUAL_JUROS_DIA
  ): number {
    validarPositivo(principal, 'Principal')
    validarPositivo(diasAtraso, 'Dias de atraso')

    if (principal === 0 || diasAtraso === 0) return 0

    const juros = principal * (percentualDia / 100) * diasAtraso
    return arredondar(juros)
  }

  /**
   * RN-3.3: Calcula valor total com multa e juros
   *
   * Fórmula: (Principal - Desconto) + Multa + Juros
   * - Multa: aplicada sobre valorBase (principal - desconto)
   * - Juros: aplicados sobre valorBase
   *
   * @param principal - Valor base do aluguel
   * @param diasAtraso - Número de dias em atraso
   * @param opcoes - Configurações opcionais (desconto, percentuais customizados)
   * @returns Objeto com breakdown dos valores
   *
   * @example
   * ```ts
   * FinanceiroService.calcularValorComMultaJuros(1000, 7)
   * // {
   * //   principal: 1000.00,
   * //   multa: 20.00,
   * //   juros: 2.31,
   * //   total: 1022.31
   * // }
   * ```
   */
  static calcularValorComMultaJuros(
    principal: number,
    diasAtraso: number,
    opcoes: {
      desconto?: number
      percentualMulta?: number
      percentualJurosDia?: number
    } = {}
  ): CalculoValorTotal {
    validarPositivo(principal, 'Principal')
    validarPositivo(diasAtraso, 'Dias de atraso')

    const { desconto = 0, percentualMulta, percentualJurosDia } = opcoes

    // Calcular valor base (após desconto)
    const valorBase = principal - desconto

    // Se não houver atraso, retornar apenas valor base
    if (diasAtraso === 0) {
      const resultado: CalculoValorTotal = {
        principal,
        multa: 0,
        juros: 0,
        total: valorBase,
      }

      if (desconto > 0) {
        resultado.desconto = desconto
        resultado.valorBase = valorBase
      }

      return resultado
    }

    // Calcular multa e juros sobre valor base
    const multa = this.calcularMulta(valorBase, percentualMulta)
    const juros = this.calcularJurosMora(valorBase, diasAtraso, percentualJurosDia)
    const total = arredondar(valorBase + multa + juros)

    const resultado: CalculoValorTotal = {
      principal,
      multa,
      juros,
      total,
    }

    if (desconto > 0) {
      resultado.desconto = desconto
      resultado.valorBase = valorBase
    }

    return resultado
  }

  /**
   * RN-3.4: Aplica pagamento parcial seguindo ordem: juros → multa → principal
   *
   * @param divida - Valores devidos (principal, multa, juros)
   * @param valorPago - Valor que está sendo pago
   * @returns Novo estado da dívida após o pagamento
   *
   * @throws Error se valorPago > total devido
   *
   * @example
   * ```ts
   * const divida = { principal: 1000, multa: 20, juros: 5 }
   * FinanceiroService.aplicarPagamentoParcial(divida, 30)
   * // {
   * //   principal: 995,  // sobrou 995
   * //   multa: 0,
   * //   juros: 0,
   * //   valorPago: 30,
   * //   saldoDevedor: 995,
   * //   quitado: false
   * // }
   * ```
   */
  static aplicarPagamentoParcial(
    divida: Divida,
    valorPago: number
  ): ResultadoPagamentoParcial {
    validarPositivo(valorPago, 'Valor pago')

    const { principal, multa, juros } = divida
    const totalDevido = principal + multa + juros

    if (valorPago > totalDevido) {
      throw new Error('Valor pago não pode exceder o total devido')
    }

    let saldo = valorPago
    let novoJuros = juros
    let novaMulta = multa
    let novoPrincipal = principal

    // 1. Abater dos juros primeiro
    if (saldo > 0 && novoJuros > 0) {
      const abateJuros = Math.min(saldo, novoJuros)
      novoJuros = arredondar(novoJuros - abateJuros)
      saldo = arredondar(saldo - abateJuros)
    }

    // 2. Depois abater da multa
    if (saldo > 0 && novaMulta > 0) {
      const abateMulta = Math.min(saldo, novaMulta)
      novaMulta = arredondar(novaMulta - abateMulta)
      saldo = arredondar(saldo - abateMulta)
    }

    // 3. Por fim, abater do principal
    if (saldo > 0 && novoPrincipal > 0) {
      const abatePrincipal = Math.min(saldo, novoPrincipal)
      novoPrincipal = arredondar(novoPrincipal - abatePrincipal)
      saldo = arredondar(saldo - abatePrincipal)
    }

    const saldoDevedor = arredondar(novoPrincipal + novaMulta + novoJuros)
    const quitado = saldoDevedor === 0

    const resultado: ResultadoPagamentoParcial = {
      principal: novoPrincipal,
      multa: novaMulta,
      juros: novoJuros,
      valorPago,
      saldoDevedor,
    }

    if (quitado) {
      resultado.quitado = true
    }

    return resultado
  }

  /**
   * RN-4: Calcula reajuste anual por índice (IGPM/IPCA)
   *
   * @param valorAtual - Valor atual do aluguel
   * @param indiceVariacao - Percentual de variação do índice
   * @returns Objeto com valores antes/depois e diferença
   *
   * @example
   * ```ts
   * FinanceiroService.calcularReajuste(1000, 5.0)
   * // {
   * //   valorAnterior: 1000.00,
   * //   percentualReajuste: 5.0,
   * //   valorReajustado: 1050.00,
   * //   diferenca: 50.00
   * // }
   * ```
   */
  static calcularReajuste(
    valorAtual: number,
    indiceVariacao: number
  ): ResultadoReajuste {
    validarPositivo(valorAtual, 'Valor atual')

    const fatorReajuste = 1 + indiceVariacao / 100
    const valorReajustado = arredondar(valorAtual * fatorReajuste)
    const diferenca = arredondar(valorReajustado - valorAtual)

    return {
      valorAnterior: valorAtual,
      percentualReajuste: indiceVariacao,
      valorReajustado,
      diferenca,
    }
  }

  /**
   * RN-4: Calcula data do próximo reajuste (12 meses após início)
   *
   * @param dataInicioContrato - Data de início do contrato
   * @returns Data do próximo reajuste
   *
   * @example
   * ```ts
   * FinanceiroService.calcularProximoReajuste(new Date('2024-03-15'))
   * // new Date('2025-03-15')
   * ```
   */
  static calcularProximoReajuste(dataInicioContrato: Date): Date {
    const proximoReajuste = new Date(dataInicioContrato)
    proximoReajuste.setFullYear(proximoReajuste.getFullYear() + 1)
    return proximoReajuste
  }

  /**
   * RN-4: Verifica se contrato está no período de reajuste
   *
   * Considera período de reajuste como ±30 dias do aniversário
   *
   * @param dataInicioContrato - Data de início do contrato
   * @param dataAtual - Data atual (padrão: hoje)
   * @returns true se está no período de reajuste
   *
   * @example
   * ```ts
   * const inicio = new Date('2024-01-01')
   * const hoje = new Date('2025-01-05')
   * FinanceiroService.estaEmPeriodoReajuste(inicio, hoje)  // true
   * ```
   */
  static estaEmPeriodoReajuste(
    dataInicioContrato: Date,
    dataAtual: Date = new Date()
  ): boolean {
    const dataReajuste = this.calcularProximoReajuste(dataInicioContrato)

    // Período de 30 dias antes e depois do aniversário
    const janelaDias = 30
    const dataInicio = new Date(dataReajuste)
    dataInicio.setDate(dataInicio.getDate() - janelaDias)

    const dataFim = new Date(dataReajuste)
    dataFim.setDate(dataFim.getDate() + janelaDias)

    return dataAtual >= dataInicio && dataAtual <= dataFim
  }

  /**
   * Calcula dias de atraso entre data de vencimento e data de referência
   *
   * @param vencimento - Data de vencimento
   * @param dataReferencia - Data para comparação (padrão: hoje)
   * @returns Número de dias de atraso (0 se não venceu)
   *
   * @example
   * ```ts
   * const vencimento = new Date('2025-01-01')
   * const hoje = new Date('2025-01-10')
   * FinanceiroService.calcularDiasAtraso(vencimento, hoje)  // 9
   * ```
   */
  static calcularDiasAtraso(
    vencimento: Date,
    dataReferencia: Date = new Date()
  ): number {
    const diffMs = dataReferencia.getTime() - vencimento.getTime()
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDias)
  }
}
