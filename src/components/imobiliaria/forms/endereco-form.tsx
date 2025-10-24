'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { enderecoSchema, type EnderecoFormData } from '@/lib/validations/imobiliaria'
import { useCreateEndereco, useUpdateEndereco } from '@/hooks/useImobiliaria'
import { useCep } from '@/hooks/useCep'
import { maskCEP, unformatCEP } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
import { Loader2, Save, X, MapPin, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EnderecoFormProps {
  initialData?: EnderecoFormData
  enderecoId?: number
  onSuccess?: () => void
}

export function EnderecoForm({ initialData, enderecoId, onSuccess }: EnderecoFormProps) {
  const router = useRouter()
  const createMutation = useCreateEndereco()
  const updateMutation = useUpdateEndereco()
  const { fetchCep, loading: loadingCep } = useCep()

  const form = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema) as any,
    defaultValues: initialData || {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      pais: ''
    }
  })

  const handleCepBlur = async (cep: string) => {
    const cleanCep = unformatCEP(cep)

    // Só busca se o CEP tiver 8 dígitos
    if (cleanCep.length !== 8) return

    const data = await fetchCep(cleanCep)

    if (data) {
      // Preenche os campos automaticamente
      form.setValue('logradouro', data.logradouro)
      form.setValue('bairro', data.bairro)
      form.setValue('cidade', data.localidade)
      form.setValue('uf', data.uf)

      // Se vier complemento da API, preenche também
      if (data.complemento) {
        form.setValue('complemento', data.complemento)
      }

      toast.success('Endereço encontrado!')
    }
  }

  const onSubmit = async (data: EnderecoFormData) => {
    try {
      // Normalizar CEP antes de enviar (remover máscara)
      const normalizedData = {
        ...data,
        cep: unformatCEP(data.cep)
      }

      if (enderecoId) {
        await updateMutation.mutateAsync({ id: enderecoId, input: normalizedData })
        toast.success('Endereço atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(normalizedData)
        toast.success('Endereço cadastrado com sucesso!')
      }
      onSuccess?.() || router.push('/dashboard/imobiliaria/enderecos')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar endereço')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Informações do Endereço
            </CardTitle>
            <CardDescription>
              Cadastre o endereço completo. Este endereço poderá ser vinculado a pessoas, imóveis e empresas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CEP <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="00000-000"
                          maxLength={9}
                          {...field}
                          onChange={(e) => {
                            const masked = maskCEP(e.target.value)
                            field.onChange(masked)
                          }}
                          onBlur={(e) => {
                            field.onBlur()
                            handleCepBlur(e.target.value)
                          }}
                          disabled={loadingCep}
                        />
                        {loadingCep && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      {loadingCep ? 'Buscando endereço...' : 'Digite o CEP e pressione TAB'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cidade <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Fortaleza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      UF <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CE"
                        maxLength={2}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormDescription>2 letras</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="logradouro"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Logradouro <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, Avenida, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Número <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input placeholder="Apto, Bloco, etc." {...field} />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Bairro <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="Brasil" {...field} />
                  </FormControl>
                  <FormDescription>Padrão: Brasil</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={form.formState.isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {enderecoId ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
