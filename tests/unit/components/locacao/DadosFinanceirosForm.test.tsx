import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DadosFinanceirosForm } from '@/components/locacao/DadosFinanceirosForm';

describe('DadosFinanceirosForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    valorAluguel: 1500,
  };

  describe('Renderização', () => {
    it('deve exibir todos os campos', () => {
      render(<DadosFinanceirosForm {...defaultProps} />);

      expect(screen.getByLabelText(/valor do aluguel/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/valor iptu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/valor condomínio/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/dia de vencimento/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/índice de reajuste/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data início/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duração \(meses\)/i)).toBeInTheDocument();
    });

    it('deve exibir valor do aluguel readonly', () => {
      render(<DadosFinanceirosForm {...defaultProps} />);

      const aluguelInput = screen.getByLabelText(/valor do aluguel/i) as HTMLInputElement;
      expect(aluguelInput.readOnly).toBe(true);
      expect(aluguelInput.value).toContain('1.500');
    });
  });

  describe('Validações', () => {
    it('deve validar dia de vencimento mínimo', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const diaInput = screen.getByLabelText(/dia de vencimento/i);
      await user.type(diaInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/dia deve ser entre 1 e 31/i)).toBeInTheDocument();
      });
    });

    it('deve validar dia de vencimento máximo', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const diaInput = screen.getByLabelText(/dia de vencimento/i);
      await user.type(diaInput, '32');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/dia deve ser entre 1 e 31/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar dia válido (1-31)', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const diaInput = screen.getByLabelText(/dia de vencimento/i);
      await user.type(diaInput, '10');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/dia deve ser entre 1 e 31/i)).not.toBeInTheDocument();
      });
    });

    it('deve validar data início não no passado', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const dataInput = screen.getByLabelText(/data início/i);
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const dataFormatada = ontem.toISOString().split('T')[0];

      await user.type(dataInput, dataFormatada);
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/data de início não pode ser no passado/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar data de hoje ou futura', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const dataInput = screen.getByLabelText(/data início/i);
      const hoje = new Date().toISOString().split('T')[0];

      await user.type(dataInput, hoje);
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/data de início não pode ser no passado/i)).not.toBeInTheDocument();
      });
    });

    it('deve validar duração mínima (6 meses)', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const duracaoInput = screen.getByLabelText(/duração \(meses\)/i);
      await user.type(duracaoInput, '3');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/mínimo 6 meses/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar duração válida', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const duracaoInput = screen.getByLabelText(/duração \(meses\)/i);
      await user.type(duracaoInput, '12');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/mínimo 6 meses/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Cálculos Automáticos', () => {
    it('deve calcular valor total mensal', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/valor iptu/i), '100');
      await user.type(screen.getByLabelText(/valor condomínio/i), '300');

      await waitFor(() => {
        expect(screen.getByText(/valor total mensal: r\$ 1\.900,00/i)).toBeInTheDocument();
      });
    });

    it('deve calcular data fim baseada na duração', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const dataInicio = new Date('2025-11-01');
      const dataInicioFormatada = dataInicio.toISOString().split('T')[0];

      await user.type(screen.getByLabelText(/data início/i), dataInicioFormatada);
      await user.type(screen.getByLabelText(/duração \(meses\)/i), '12');

      await waitFor(() => {
        expect(screen.getByText(/data fim: 01\/11\/2026/i)).toBeInTheDocument();
      });
    });

    it('deve recalcular ao mudar valores', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const iptuInput = screen.getByLabelText(/valor iptu/i);
      await user.type(iptuInput, '100');

      await waitFor(() => {
        expect(screen.getByText(/valor total mensal: r\$ 1\.600,00/i)).toBeInTheDocument();
      });

      await user.clear(iptuInput);
      await user.type(iptuInput, '200');

      await waitFor(() => {
        expect(screen.getByText(/valor total mensal: r\$ 1\.700,00/i)).toBeInTheDocument();
      });
    });
  });

  describe('Índice de Reajuste', () => {
    it('deve exibir opções de índice', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const indiceSelect = screen.getByLabelText(/índice de reajuste/i);
      await user.click(indiceSelect);

      await waitFor(() => {
        expect(screen.getByText('IGPM')).toBeInTheDocument();
        expect(screen.getByText('IPCA')).toBeInTheDocument();
        expect(screen.getByText('INPC')).toBeInTheDocument();
        expect(screen.getByText('Nenhum')).toBeInTheDocument();
      });
    });

    it('deve validar seleção de índice', async () => {
      render(<DadosFinanceirosForm {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/índice de reajuste é obrigatório/i)).toBeInTheDocument();
      });
    });
  });

  describe('Campos Opcionais', () => {
    it('deve aceitar IPTU zero', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const iptuInput = screen.getByLabelText(/valor iptu/i);
      await user.type(iptuInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/valor do iptu não pode ser negativo/i)).not.toBeInTheDocument();
      });
    });

    it('deve aceitar condomínio zero', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const condInput = screen.getByLabelText(/valor condomínio/i);
      await user.type(condInput, '0');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/valor do condomínio não pode ser negativo/i)).not.toBeInTheDocument();
      });
    });

    it('deve ter campo de observações', () => {
      render(<DadosFinanceirosForm {...defaultProps} />);

      expect(screen.getByLabelText(/observações/i)).toBeInTheDocument();
    });

    it('deve permitir texto longo em observações', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const obsTextarea = screen.getByLabelText(/observações/i);
      const textoLongo = 'Este contrato possui cláusulas especiais. '.repeat(10);

      await user.type(obsTextarea, textoLongo);

      await waitFor(() => {
        expect(obsTextarea).toHaveValue(textoLongo);
      });
    });
  });

  describe('Formatação', () => {
    it('deve formatar valores monetários', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const iptuInput = screen.getByLabelText(/valor iptu/i);
      await user.type(iptuInput, '15000');

      await waitFor(() => {
        expect(iptuInput).toHaveValue('R$ 150,00');
      });
    });

    it('deve formatar data corretamente', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      const dataInput = screen.getByLabelText(/data início/i);
      await user.type(dataInput, '2025-11-15');

      await waitFor(() => {
        const displayDate = screen.getByText(/15\/11\/2025/i);
        expect(displayDate).toBeInTheDocument();
      });
    });
  });

  describe('Submissão', () => {
    it('deve submeter com todos os dados válidos', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<DadosFinanceirosForm {...defaultProps} onSubmit={onSubmit} />);

      await user.type(screen.getByLabelText(/valor iptu/i), '100');
      await user.type(screen.getByLabelText(/valor condomínio/i), '300');
      await user.type(screen.getByLabelText(/dia de vencimento/i), '10');

      const indiceSelect = screen.getByLabelText(/índice de reajuste/i);
      await user.click(indiceSelect);
      const igpmOption = screen.getByText('IGPM');
      await user.click(igpmOption);

      const dataInicio = new Date('2025-11-01').toISOString().split('T')[0];
      await user.type(screen.getByLabelText(/data início/i), dataInicio);
      await user.type(screen.getByLabelText(/duração \(meses\)/i), '12');

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            valor_aluguel: 1500,
            valor_iptu: 100,
            valor_condominio: 300,
            dia_vencimento: 10,
            indice_reajuste: 'IGPM',
            duracao_meses: 12,
          })
        );
      });
    });

    it('não deve submeter com dados inválidos', async () => {
      const onSubmit = vi.fn();
      render(<DadosFinanceirosForm {...defaultProps} onSubmit={onSubmit} />);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Resumo Financeiro', () => {
    it('deve mostrar resumo com todos os valores', async () => {
      const user = userEvent.setup();
      render(<DadosFinanceirosForm {...defaultProps} />);

      await user.type(screen.getByLabelText(/valor iptu/i), '100');
      await user.type(screen.getByLabelText(/valor condomínio/i), '300');

      await waitFor(() => {
        expect(screen.getByText(/aluguel: r\$ 1\.500,00/i)).toBeInTheDocument();
        expect(screen.getByText(/iptu: r\$ 100,00/i)).toBeInTheDocument();
        expect(screen.getByText(/condomínio: r\$ 300,00/i)).toBeInTheDocument();
        expect(screen.getByText(/total: r\$ 1\.900,00/i)).toBeInTheDocument();
      });
    });
  });
});
