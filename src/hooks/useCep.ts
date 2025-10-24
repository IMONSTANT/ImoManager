import { useState } from 'react'
import { toast } from 'sonner'

export interface CepData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export function useCep() {
  const [loading, setLoading] = useState(false)

  const fetchCep = async (cep: string): Promise<CepData | null> => {
    // Remove formatação do CEP (hífen)
    const cleanCep = cep.replace(/\D/g, '')

    // Valida se o CEP tem 8 dígitos
    if (cleanCep.length !== 8) {
      toast.error('CEP deve conter 8 dígitos')
      return null
    }

    setLoading(true)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

      if (!response.ok) {
        throw new Error('Erro ao buscar CEP')
      }

      const data: CepData = await response.json()

      if (data.erro) {
        toast.error('CEP não encontrado')
        return null
      }

      return data
    } catch (error) {
      toast.error('Erro ao buscar CEP. Tente novamente.')
      console.error('Erro ao buscar CEP:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { fetchCep, loading }
}
