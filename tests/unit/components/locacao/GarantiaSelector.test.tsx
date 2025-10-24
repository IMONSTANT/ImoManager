import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GarantiaSelector } from '@/components/locacao/GarantiaSelector';

describe('GarantiaSelector', () => {
  describe('Renderização', () => {
    it('deve exibir opções de garantia', () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      expect(screen.getByLabelText(/caução/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fiador/i)).toBeInTheDocument();
    });

    it('deve iniciar com caução selecionada', () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const caucaoRadio = screen.getByLabelText(/caução/i) as HTMLInputElement;
      expect(caucaoRadio.checked).toBe(true);
    });
  });

  describe('Opção Caução', () => {
    it('deve exibir campo de valor para caução', () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      expect(screen.getByLabelText(/valor da caução/i)).toBeInTheDocument();
    });

    it('deve calcular e sugerir 3x o valor do aluguel', () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      expect(screen.getByText(/sugestão: r\$ 4\.500,00/i)).toBeInTheDocument();
    });

    it('deve validar valor mínimo (1x aluguel)', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const valorInput = screen.getByLabelText(/valor da caução/i);
      await user.clear(valorInput);
      await user.type(valorInput, '1000');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/valor mínimo: r\$ 1\.500,00/i)).toBeInTheDocument();
      });
    });

    it('deve aceitar valor igual ou maior que 1x aluguel', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const valorInput = screen.getByLabelText(/valor da caução/i);
      await user.clear(valorInput);
      await user.type(valorInput, '4500');
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/valor mínimo/i)).not.toBeInTheDocument();
      });
    });

    it('deve exibir informação sobre devolução', () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      expect(screen.getByText(/a caução será devolvida/i)).toBeInTheDocument();
    });

    it('deve aplicar sugestão ao clicar no botão', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const aplicarButton = screen.getByRole('button', { name: /aplicar sugestão/i });
      fireEvent.click(aplicarButton);

      await waitFor(() => {
        const valorInput = screen.getByLabelText(/valor da caução/i) as HTMLInputElement;
        expect(valorInput.value).toBe('4500');
      });
    });
  });

  describe('Opção Fiador', () => {
    it('deve exibir formulário do fiador ao selecionar', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(() => {
        expect(screen.getByText(/dados do fiador/i)).toBeInTheDocument();
      });
    });

    it('deve exibir campos do fiador', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(() => {
        expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cpf/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/profissão/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/renda mensal/i)).toBeInTheDocument();
      });
    });

    it('deve validar CPF do fiador', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(async () => {
        const cpfInput = screen.getByLabelText(/cpf/i);
        await user.type(cpfInput, '111.111.111-11');
        await user.tab();
      });

      await waitFor(() => {
        expect(screen.getByText(/cpf inválido/i)).toBeInTheDocument();
      });
    });

    it('deve exibir informação legal sobre fiança', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(() => {
        expect(screen.getByText(/o fiador se compromete/i)).toBeInTheDocument();
      });
    });

    it('deve requerer mínimo 2 documentos para fiador', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(() => {
        expect(screen.getByText(/mínimo 2 documentos/i)).toBeInTheDocument();
      });
    });

    it('deve incluir campos de endereço do fiador', async () => {
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(() => {
        expect(screen.getByLabelText(/logradouro/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/número/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
      });
    });
  });

  describe('Troca entre Caução e Fiador', () => {
    it('deve limpar dados ao trocar de caução para fiador', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      // Preencher caução
      const valorInput = screen.getByLabelText(/valor da caução/i);
      await user.type(valorInput, '4500');

      // Trocar para fiador
      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      // Voltar para caução
      const caucaoRadio = screen.getByLabelText(/caução/i);
      fireEvent.click(caucaoRadio);

      await waitFor(() => {
        const valorInputAfter = screen.getByLabelText(/valor da caução/i) as HTMLInputElement;
        expect(valorInputAfter.value).toBe('');
      });
    });
  });

  describe('Submissão', () => {
    it('deve submeter com caução válida', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<GarantiaSelector onSubmit={onSubmit} valorAluguel={1500} />);

      const valorInput = screen.getByLabelText(/valor da caução/i);
      await user.type(valorInput, '4500');

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          tipo: 'caucao',
          valor: 4500,
        });
      });
    });

    it('deve submeter com fiador válido', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<GarantiaSelector onSubmit={onSubmit} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      // Preencher dados do fiador (simplificado)
      await waitFor(async () => {
        await user.type(screen.getByLabelText(/nome completo/i), 'Maria Silva');
        await user.type(screen.getByLabelText(/cpf/i), '123.456.789-09');
        await user.type(screen.getByLabelText(/email/i), 'maria@email.com');
        await user.type(screen.getByLabelText(/telefone/i), '11987654321');
        await user.type(screen.getByLabelText(/profissão/i), 'Advogada');
        await user.type(screen.getByLabelText(/renda mensal/i), '8000');
      });

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          tipo: 'fiador',
          fiador: expect.objectContaining({
            nome: 'Maria Silva',
            cpf: '123.456.789-09',
          }),
        });
      });
    });

    it('não deve submeter sem dados válidos', async () => {
      const onSubmit = vi.fn();
      render(<GarantiaSelector onSubmit={onSubmit} valorAluguel={1500} />);

      const submitButton = screen.getByRole('button', { name: /continuar/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled();
      });
    });
  });

  describe('Formatação de Valores', () => {
    it('deve formatar valor da caução como moeda', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const valorInput = screen.getByLabelText(/valor da caução/i);
      await user.type(valorInput, '4500');

      await waitFor(() => {
        expect(screen.getByText(/r\$ 4\.500,00/i)).toBeInTheDocument();
      });
    });

    it('deve formatar renda do fiador como moeda', async () => {
      const user = userEvent.setup();
      render(<GarantiaSelector onSubmit={vi.fn()} valorAluguel={1500} />);

      const fiadorRadio = screen.getByLabelText(/fiador/i);
      fireEvent.click(fiadorRadio);

      await waitFor(async () => {
        const rendaInput = screen.getByLabelText(/renda mensal/i);
        await user.type(rendaInput, '8000');
      });

      await waitFor(() => {
        const rendaInput = screen.getByLabelText(/renda mensal/i) as HTMLInputElement;
        expect(rendaInput.value).toContain('8.000');
      });
    });
  });
});
