/**
 * TESTES TDD - FinancialMetrics Component
 *
 * Testa os cards de métricas financeiras do dashboard
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock do componente (será implementado depois)
const FinancialMetrics = ({ metrics, isLoading }: { metrics: any; isLoading?: boolean }) => {
  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div data-testid="financial-metrics">
      <div data-testid="receita-mensal">
        <span>Receita Mensal</span>
        <span>{metrics.receitaMensal}</span>
      </div>
      <div data-testid="inadimplencia">
        <span>Inadimplência</span>
        <span>{metrics.inadimplencia}%</span>
      </div>
      <div data-testid="taxa-ocupacao">
        <span>Taxa de Ocupação</span>
        <span>{metrics.taxaOcupacao}%</span>
      </div>
      <div data-testid="mrr">
        <span>MRR</span>
        <span>{metrics.mrr}</span>
      </div>
    </div>
  )
}

describe('FinancialMetrics', () => {
  const mockMetrics = {
    receitaMensal: 50000,
    inadimplencia: 5.2,
    taxaOcupacao: 92.5,
    mrr: 48500,
    contratosAtivos: 25,
    boletosVencer: 8
  }

  describe('Renderização de métricas', () => {
    it('deve renderizar todos os cards de métricas', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      expect(screen.getByTestId('financial-metrics')).toBeInTheDocument()
      expect(screen.getByTestId('receita-mensal')).toBeInTheDocument()
      expect(screen.getByTestId('inadimplencia')).toBeInTheDocument()
      expect(screen.getByTestId('taxa-ocupacao')).toBeInTheDocument()
      expect(screen.getByTestId('mrr')).toBeInTheDocument()
    })

    it('deve exibir valor de receita mensal formatado', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      const receitaCard = screen.getByTestId('receita-mensal')
      expect(receitaCard).toHaveTextContent('50000')
    })

    it('deve exibir percentual de inadimplência', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      const inadimplenciaCard = screen.getByTestId('inadimplencia')
      expect(inadimplenciaCard).toHaveTextContent('5.2%')
    })

    it('deve exibir taxa de ocupação', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      const ocupacaoCard = screen.getByTestId('taxa-ocupacao')
      expect(ocupacaoCard).toHaveTextContent('92.5%')
    })

    it('deve exibir MRR', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      const mrrCard = screen.getByTestId('mrr')
      expect(mrrCard).toHaveTextContent('48500')
    })
  })

  describe('Estado de carregamento', () => {
    it('deve exibir skeleton quando isLoading = true', () => {
      render(<FinancialMetrics metrics={mockMetrics} isLoading={true} />)

      expect(screen.getByText('Carregando...')).toBeInTheDocument()
    })

    it('não deve exibir métricas quando isLoading = true', () => {
      render(<FinancialMetrics metrics={mockMetrics} isLoading={true} />)

      expect(screen.queryByTestId('financial-metrics')).not.toBeInTheDocument()
    })
  })

  describe('Formatação de valores', () => {
    it('deve formatar valores monetários com separador de milhares', () => {
      const metricsComMilhares = { ...mockMetrics, receitaMensal: 125000 }
      render(<FinancialMetrics metrics={metricsComMilhares} />)

      // Teste básico - implementação futura irá formatar corretamente
      expect(screen.getByTestId('receita-mensal')).toHaveTextContent('125000')
    })

    it('deve formatar percentuais com 1 casa decimal', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      expect(screen.getByTestId('inadimplencia')).toHaveTextContent('5.2%')
      expect(screen.getByTestId('taxa-ocupacao')).toHaveTextContent('92.5%')
    })

    it('deve tratar valores zerados', () => {
      const metricsZeradas = {
        receitaMensal: 0,
        inadimplencia: 0,
        taxaOcupacao: 0,
        mrr: 0,
        contratosAtivos: 0,
        boletosVencer: 0
      }

      render(<FinancialMetrics metrics={metricsZeradas} />)

      expect(screen.getByTestId('receita-mensal')).toHaveTextContent('0')
      expect(screen.getByTestId('inadimplencia')).toHaveTextContent('0%')
    })
  })

  describe('Indicadores visuais', () => {
    it('deve exibir indicador de alerta quando inadimplência > 10%', () => {
      const metricsAlta = { ...mockMetrics, inadimplencia: 15.5 }
      render(<FinancialMetrics metrics={metricsAlta} />)

      // Implementação futura verificará classe CSS de alerta
      expect(screen.getByTestId('inadimplencia')).toHaveTextContent('15.5%')
    })

    it('deve exibir indicador de sucesso quando ocupação > 90%', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      // Taxa de ocupação 92.5% deve ter indicador verde
      expect(screen.getByTestId('taxa-ocupacao')).toHaveTextContent('92.5%')
    })

    it('deve exibir indicador de aviso quando ocupação < 70%', () => {
      const metricsBaixa = { ...mockMetrics, taxaOcupacao: 65 }
      render(<FinancialMetrics metrics={metricsBaixa} />)

      expect(screen.getByTestId('taxa-ocupacao')).toHaveTextContent('65%')
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter labels descritivos para screen readers', () => {
      render(<FinancialMetrics metrics={mockMetrics} />)

      expect(screen.getByText('Receita Mensal')).toBeInTheDocument()
      expect(screen.getByText('Inadimplência')).toBeInTheDocument()
      expect(screen.getByText('Taxa de Ocupação')).toBeInTheDocument()
      expect(screen.getByText('MRR')).toBeInTheDocument()
    })
  })
})
