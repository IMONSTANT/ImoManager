import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EnderecoForm } from '@/components/imobiliaria/forms/endereco-form'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock do router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}))

// Mock do toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock dos hooks
vi.mock('@/hooks/useImobiliaria', () => ({
  useCreateEndereco: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 1 }),
    isLoading: false,
  }),
  useUpdateEndereco: () => ({
    mutateAsync: vi.fn().mockResolvedValue({ id: 1 }),
    isLoading: false,
  }),
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('EnderecoForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderização', () => {
    it('deve renderizar todos os campos obrigatórios', () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      expect(screen.getByLabelText(/cep/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/logradouro/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/número/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/uf/i)).toBeInTheDocument()
    })

    it('deve renderizar campos opcionais', () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      expect(screen.getByLabelText(/complemento/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument()
    })

    it('deve renderizar botões de ação', () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
    })

    it('deve mostrar valores padrão corretos', () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cidadeInput = screen.getByLabelText(/cidade/i) as HTMLInputElement
      const ufInput = screen.getByLabelText(/uf/i) as HTMLInputElement
      const paisInput = screen.getByLabelText(/país/i) as HTMLInputElement

      expect(cidadeInput.value).toBe('Fortaleza')
      expect(ufInput.value).toBe('CE')
      expect(paisInput.value).toBe('Brasil')
    })
  })

  describe('Validação de CEP', () => {
    it('deve aceitar CEP válido com máscara', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '60000-000' } })

      await waitFor(() => {
        expect(screen.queryByText(/cep inválido/i)).not.toBeInTheDocument()
      })
    })

    it('deve mostrar erro para CEP inválido', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i)
      const submitButton = screen.getByRole('button', { name: /cadastrar/i })

      fireEvent.change(cepInput, { target: { value: '123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/cep deve ter 8 dígitos/i)).toBeInTheDocument()
      })
    })

    it('deve aceitar CEP sem máscara', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i)
      fireEvent.change(cepInput, { target: { value: '60000000' } })

      await waitFor(() => {
        expect(screen.queryByText(/cep inválido/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Validação de Campos Obrigatórios', () => {
    it('deve mostrar erro quando logradouro está vazio', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/logradouro deve ter pelo menos 3 caracteres/i)
        ).toBeInTheDocument()
      })
    })

    it('deve mostrar erro quando número está vazio', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/número é obrigatório/i)).toBeInTheDocument()
      })
    })

    it('deve mostrar erro quando bairro está vazio', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const submitButton = screen.getByRole('button', { name: /cadastrar/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText(/bairro deve ter pelo menos 2 caracteres/i)
        ).toBeInTheDocument()
      })
    })
  })

  describe('Validação de UF', () => {
    it('deve aceitar UF válida em maiúsculas', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const ufInput = screen.getByLabelText(/uf/i)
      fireEvent.change(ufInput, { target: { value: 'SP' } })

      await waitFor(() => {
        expect(screen.queryByText(/uf inválido/i)).not.toBeInTheDocument()
      })
    })

    it('deve mostrar erro para UF com mais de 2 caracteres', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const ufInput = screen.getByLabelText(/uf/i)
      const submitButton = screen.getByRole('button', { name: /cadastrar/i })

      fireEvent.change(ufInput, { target: { value: 'CEA' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/uf deve ter 2 caracteres/i)).toBeInTheDocument()
      })
    })
  })

  describe('Modo de Edição', () => {
    it('deve preencher campos com dados iniciais', () => {
      const initialData = {
        cep: '60000-000',
        logradouro: 'Rua Teste',
        numero: '123',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'Fortaleza',
        uf: 'CE',
        pais: 'Brasil',
      }

      render(<EnderecoForm initialData={initialData} enderecoId={1} />, {
        wrapper: createWrapper(),
      })

      expect((screen.getByLabelText(/cep/i) as HTMLInputElement).value).toBe('60000-000')
      expect((screen.getByLabelText(/logradouro/i) as HTMLInputElement).value).toBe(
        'Rua Teste'
      )
      expect((screen.getByLabelText(/número/i) as HTMLInputElement).value).toBe('123')
      expect((screen.getByLabelText(/bairro/i) as HTMLInputElement).value).toBe('Centro')
    })

    it('deve mostrar texto "Atualizar" no botão quando em modo edição', () => {
      const initialData = {
        cep: '60000-000',
        logradouro: 'Rua Teste',
        numero: '123',
        bairro: 'Centro',
        cidade: 'Fortaleza',
        uf: 'CE',
        pais: 'Brasil',
      }

      render(<EnderecoForm initialData={initialData} enderecoId={1} />, {
        wrapper: createWrapper(),
      })

      expect(screen.getByRole('button', { name: /atualizar/i })).toBeInTheDocument()
    })
  })

  describe('Submissão do Formulário', () => {
    it('deve desabilitar botões durante submissão', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i)
      const logradouroInput = screen.getByLabelText(/logradouro/i)
      const numeroInput = screen.getByLabelText(/número/i)
      const bairroInput = screen.getByLabelText(/bairro/i)
      const submitButton = screen.getByRole('button', { name: /cadastrar/i })

      // Preencher formulário
      fireEvent.change(cepInput, { target: { value: '60000-000' } })
      fireEvent.change(logradouroInput, { target: { value: 'Rua Teste' } })
      fireEvent.change(numeroInput, { target: { value: '123' } })
      fireEvent.change(bairroInput, { target: { value: 'Centro' } })

      // Submeter
      fireEvent.click(submitButton)

      // Verificar que o botão foi desabilitado (pode ser verificado pela presença do loading)
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })
  })

  describe('Máscara de CEP', () => {
    it('deve aplicar máscara de CEP automaticamente', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i) as HTMLInputElement

      fireEvent.change(cepInput, { target: { value: '60000000' } })

      await waitFor(() => {
        expect(cepInput.value).toBe('60000-000')
      })
    })

    it('deve limitar CEP a 9 caracteres com máscara', async () => {
      render(<EnderecoForm />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i) as HTMLInputElement

      fireEvent.change(cepInput, { target: { value: '600000001234' } })

      await waitFor(() => {
        expect(cepInput.value.length).toBeLessThanOrEqual(9)
      })
    })
  })

  describe('Callback onSuccess', () => {
    it('deve chamar onSuccess quando fornecido', async () => {
      const onSuccess = vi.fn()

      render(<EnderecoForm onSuccess={onSuccess} />, { wrapper: createWrapper() })

      const cepInput = screen.getByLabelText(/cep/i)
      const logradouroInput = screen.getByLabelText(/logradouro/i)
      const numeroInput = screen.getByLabelText(/número/i)
      const bairroInput = screen.getByLabelText(/bairro/i)
      const submitButton = screen.getByRole('button', { name: /cadastrar/i })

      fireEvent.change(cepInput, { target: { value: '60000-000' } })
      fireEvent.change(logradouroInput, { target: { value: 'Rua Teste' } })
      fireEvent.change(numeroInput, { target: { value: '123' } })
      fireEvent.change(bairroInput, { target: { value: 'Centro' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled()
      })
    })
  })
})
