/**
 * TESTES TDD - FINANCEIRO SERVICE
 *
 * Baseado no SRS - Seção 8 (Regras de Negócio)
 * RN-3: Cobrança, Multas e Inadimplência
 *
 * Metodologia: Red-Green-Refactor
 * - RED: Escrever teste que falha
 * - GREEN: Implementar código mínimo para passar
 * - REFACTOR: Melhorar código mantendo testes passando
 */

import { describe, it, expect } from 'vitest'
import { FinanceiroService } from '@/lib/services/FinanceiroService'

describe('FinanceiroService - Cálculos Financeiros', () => {
  describe('RN-3.3: Cálculo de Multa', () => {
    /**
     * RED: Este teste vai FALHAR porque FinanceiroService ainda não existe
     *
     * Regra: Multa padrão de 2% sobre o valor principal
     * Aplicada em D+1 (primeiro dia de atraso)
     */
    it('deve calcular multa de 2% sobre o principal', () => {
      const principal = 1000.00
      const esperado = 20.00  // 2% de R$ 1.000,00

      const resultado = FinanceiroService.calcularMulta(principal)

      expect(resultado).toBe(esperado)
    })

    it('deve calcular multa corretamente para valores decimais', () => {
      const principal = 1547.83
      const esperado = 30.96  // 2% de R$ 1.547,83 = R$ 30,9566 → R$ 30,96 (arredondado)

      const resultado = FinanceiroService.calcularMulta(principal)

      expect(resultado).toBe(esperado)
    })

    it('deve arredondar multa para 2 casas decimais', () => {
      const principal = 1333.33
      const esperado = 26.67  // 2% de R$ 1.333,33 = R$ 26,6666 → R$ 26,67

      const resultado = FinanceiroService.calcularMulta(principal)

      expect(resultado).toBe(esperado)
    })

    it('deve retornar zero para principal zero', () => {
      const principal = 0
      const esperado = 0

      const resultado = FinanceiroService.calcularMulta(principal)

      expect(resultado).toBe(esperado)
    })

    it('deve aceitar percentual de multa customizado', () => {
      const principal = 1000.00
      const percentualCustomizado = 5.0  // 5%
      const esperado = 50.00

      const resultado = FinanceiroService.calcularMulta(principal, percentualCustomizado)

      expect(resultado).toBe(esperado)
    })

    it('deve lançar erro para principal negativo', () => {
      const principal = -1000.00

      expect(() => {
        FinanceiroService.calcularMulta(principal)
      }).toThrow('Principal não pode ser negativo')
    })

    it('deve lançar erro para percentual negativo', () => {
      const principal = 1000.00
      const percentual = -2.0

      expect(() => {
        FinanceiroService.calcularMulta(principal, percentual)
      }).toThrow('Percentual de multa não pode ser negativo')
    })
  })

  describe('RN-3.3: Cálculo de Juros de Mora', () => {
    /**
     * Regra: Juros de 0,033% ao dia (equivalente a 1% ao mês)
     * Calculado sobre o principal multiplicado pelos dias de atraso
     */
    it('deve calcular juros de 0,033% ao dia sobre o principal', () => {
      const principal = 1000.00
      const diasAtraso = 1
      const esperado = 0.33  // 0,033% de R$ 1.000,00 = R$ 0,33

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso)

      expect(resultado).toBe(esperado)
    })

    it('deve calcular juros proporcionalmente aos dias de atraso', () => {
      const principal = 1000.00
      const diasAtraso = 10
      const esperado = 3.30  // 0,033% * 10 dias = R$ 3,30

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso)

      expect(resultado).toBe(esperado)
    })

    it('deve calcular juros para 30 dias (equivalente a 1% ao mês)', () => {
      const principal = 1000.00
      const diasAtraso = 30
      const esperado = 9.90  // 0,033% * 30 dias ≈ 1% = R$ 9,90

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso)

      expect(resultado).toBe(esperado)
    })

    it('deve arredondar juros para 2 casas decimais', () => {
      const principal = 1547.83
      const diasAtraso = 7
      const esperado = 3.58  // 0,033% * 7 * 1547,83 = R$ 3,5772 → R$ 3,58

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso)

      expect(resultado).toBe(esperado)
    })

    it('deve retornar zero para zero dias de atraso', () => {
      const principal = 1000.00
      const diasAtraso = 0
      const esperado = 0

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso)

      expect(resultado).toBe(esperado)
    })

    it('deve aceitar percentual de juros customizado', () => {
      const principal = 1000.00
      const diasAtraso = 1
      const percentualDia = 0.05  // 0,05% ao dia
      const esperado = 0.50

      const resultado = FinanceiroService.calcularJurosMora(principal, diasAtraso, percentualDia)

      expect(resultado).toBe(esperado)
    })

    it('deve lançar erro para principal negativo', () => {
      const principal = -1000.00
      const diasAtraso = 5

      expect(() => {
        FinanceiroService.calcularJurosMora(principal, diasAtraso)
      }).toThrow('Principal não pode ser negativo')
    })

    it('deve lançar erro para dias de atraso negativos', () => {
      const principal = 1000.00
      const diasAtraso = -5

      expect(() => {
        FinanceiroService.calcularJurosMora(principal, diasAtraso)
      }).toThrow('Dias de atraso não pode ser negativo')
    })
  })

  describe('RN-3.3: Cálculo Combinado (Multa + Juros)', () => {
    /**
     * Cenário real: calcular valor total devido em uma parcela atrasada
     */
    it('deve calcular valor total com multa e juros para 1 dia de atraso', () => {
      const principal = 1000.00
      const diasAtraso = 1

      const resultado = FinanceiroService.calcularValorComMultaJuros(principal, diasAtraso)

      expect(resultado).toEqual({
        principal: 1000.00,
        multa: 20.00,      // 2%
        juros: 0.33,       // 0,033%
        total: 1020.33     // 1000 + 20 + 0.33
      })
    })

    it('deve calcular valor total para 7 dias de atraso', () => {
      const principal = 1500.00
      const diasAtraso = 7

      const resultado = FinanceiroService.calcularValorComMultaJuros(principal, diasAtraso)

      expect(resultado).toEqual({
        principal: 1500.00,
        multa: 30.00,      // 2% de 1500
        juros: 3.46,       // 0,033% * 7 * 1500 = R$ 3,465 → R$ 3,46
        total: 1533.46
      })
    })

    it('deve aplicar desconto antes de calcular multa e juros', () => {
      const principal = 1000.00
      const diasAtraso = 5
      const desconto = 100.00

      const resultado = FinanceiroService.calcularValorComMultaJuros(
        principal,
        diasAtraso,
        { desconto }
      )

      // Desconto aplicado primeiro: 1000 - 100 = 900
      // Multa sobre 900: 18.00
      // Juros sobre 900: 0,033% * 5 * 900 = 1.485 → 1.48 (arredondado)
      expect(resultado).toEqual({
        principal: 1000.00,
        desconto: 100.00,
        valorBase: 900.00,
        multa: 18.00,
        juros: 1.48,
        total: 919.48
      })
    })

    it('deve retornar apenas principal se não houver atraso', () => {
      const principal = 1000.00
      const diasAtraso = 0

      const resultado = FinanceiroService.calcularValorComMultaJuros(principal, diasAtraso)

      expect(resultado).toEqual({
        principal: 1000.00,
        multa: 0,
        juros: 0,
        total: 1000.00
      })
    })
  })

  describe('RN-3.4: Pagamento Parcial', () => {
    /**
     * Regra: Pagamentos parciais abatem primeiro juros, depois multa, por fim principal
     */
    it('deve aplicar pagamento primeiro aos juros', () => {
      const divida = {
        principal: 1000.00,
        multa: 20.00,
        juros: 5.00  // Total: R$ 1.025,00
      }
      const valorPago = 3.00  // Paga apenas parte dos juros

      const resultado = FinanceiroService.aplicarPagamentoParcial(divida, valorPago)

      expect(resultado).toEqual({
        principal: 1000.00,
        multa: 20.00,
        juros: 2.00,        // 5 - 3 = 2
        valorPago: 3.00,
        saldoDevedor: 1022.00
      })
    })

    it('deve aplicar pagamento aos juros, depois multa, depois principal', () => {
      const divida = {
        principal: 1000.00,
        multa: 20.00,
        juros: 5.00
      }
      const valorPago = 30.00  // Paga juros + multa + parte do principal

      const resultado = FinanceiroService.aplicarPagamentoParcial(divida, valorPago)

      expect(resultado).toEqual({
        principal: 995.00,    // 1000 - 5 = 995
        multa: 0,
        juros: 0,
        valorPago: 30.00,
        saldoDevedor: 995.00
      })
    })

    it('deve quitar totalmente se pagamento for igual ao total', () => {
      const divida = {
        principal: 1000.00,
        multa: 20.00,
        juros: 5.00
      }
      const valorPago = 1025.00

      const resultado = FinanceiroService.aplicarPagamentoParcial(divida, valorPago)

      expect(resultado).toEqual({
        principal: 0,
        multa: 0,
        juros: 0,
        valorPago: 1025.00,
        saldoDevedor: 0,
        quitado: true
      })
    })

    it('deve lançar erro se pagamento exceder total devido', () => {
      const divida = {
        principal: 1000.00,
        multa: 20.00,
        juros: 5.00
      }
      const valorPago = 1100.00

      expect(() => {
        FinanceiroService.aplicarPagamentoParcial(divida, valorPago)
      }).toThrow('Valor pago não pode exceder o total devido')
    })
  })

  describe('RN-4: Reajuste Anual', () => {
    /**
     * Regra: Aplicar reajuste por índice (IGPM/IPCA) no aniversário do contrato
     */
    it('deve calcular reajuste de 5% (IGPM)', () => {
      const valorAtual = 1000.00
      const indiceVariacao = 5.0  // 5%
      const esperado = 1050.00

      const resultado = FinanceiroService.calcularReajuste(valorAtual, indiceVariacao)

      expect(resultado).toEqual({
        valorAnterior: 1000.00,
        percentualReajuste: 5.0,
        valorReajustado: 1050.00,
        diferenca: 50.00
      })
    })

    it('deve calcular reajuste com índice negativo (deflação)', () => {
      const valorAtual = 1000.00
      const indiceVariacao = -2.5  // -2,5%
      const esperado = 975.00

      const resultado = FinanceiroService.calcularReajuste(valorAtual, indiceVariacao)

      expect(resultado).toEqual({
        valorAnterior: 1000.00,
        percentualReajuste: -2.5,
        valorReajustado: 975.00,
        diferenca: -25.00
      })
    })

    it('deve arredondar valor reajustado para 2 casas decimais', () => {
      const valorAtual = 1547.83
      const indiceVariacao = 4.37  // IPCA acumulado

      const resultado = FinanceiroService.calcularReajuste(valorAtual, indiceVariacao)

      expect(resultado.valorReajustado).toBe(1615.47)  // 1547.83 * 1.0437 = 1615,4647 → 1615,47
    })

    it('deve calcular data do próximo reajuste (12 meses)', () => {
      const dataInicioContrato = new Date('2024-03-15')

      const resultado = FinanceiroService.calcularProximoReajuste(dataInicioContrato)

      expect(resultado).toEqual(new Date('2025-03-15'))
    })

    it('deve identificar se contrato está no período de reajuste', () => {
      const dataInicioContrato = new Date('2024-01-01')
      const dataAtual = new Date('2025-01-05')  // 1 ano + 5 dias

      const resultado = FinanceiroService.estaEmPeriodoReajuste(
        dataInicioContrato,
        dataAtual
      )

      expect(resultado).toBe(true)
    })
  })
})
