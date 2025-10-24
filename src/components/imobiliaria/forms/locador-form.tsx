'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { locadorSchema, type LocadorFormData } from '@/lib/validations/imobiliaria'
import { useCreateLocador, useUpdateLocador, usePessoas } from '@/hooks/useImobiliaria'
import { maskCNPJ, unformatCNPJ } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
import { Loader2, Save, X, User } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import Link from 'next/link'

interface LocadorFormProps {
  initialData?: LocadorFormData
  locadorId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function LocadorForm({ initialData, locadorId, onSuccess, onCancel }: LocadorFormProps) {
  const router = useRouter()
  const { data: pessoas, isLoading: loadingPessoas } = usePessoas()
  const createMutation = useCreateLocador()
  const updateMutation = useUpdateLocador()

  const form = useForm<LocadorFormData>({
    resolver: zodResolver(locadorSchema) as any,
    defaultValues: initialData || {
      pessoa_id: 0,
      tipo_pessoa: 'fisica',
      cnpj: '',
      razao_social: ''
    }
  })

  const tipoPessoa = form.watch('tipo_pessoa')

  const onSubmit = async (data: LocadorFormData) => {
    try {
      // Normalizar CNPJ antes de enviar
      const normalizedData = {
        ...data,
        cnpj: data.cnpj ? unformatCNPJ(data.cnpj) : undefined,
        razao_social: data.tipo_pessoa === 'juridica' ? data.razao_social : undefined
      }

      if (locadorId) {
        await updateMutation.mutateAsync({ id: locadorId, input: normalizedData })
        toast.success('Locador atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(normalizedData)
        toast.success('Locador cadastrado com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/locadores')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar locador')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Locador (Proprietário)</CardTitle>
            <CardDescription>
              Cadastre os dados do proprietário do imóvel. Os imóveis serão cadastrados posteriormente pela empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seleção de Pessoa */}
            <FormField
              control={form.control}
              name="pessoa_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Pessoa <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      disabled={loadingPessoas}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma pessoa cadastrada" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingPessoas ? (
                          <SelectItem value="loading" disabled>
                            Carregando...
                          </SelectItem>
                        ) : !pessoas || !pessoas.data || pessoas.data.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Nenhuma pessoa cadastrada
                          </SelectItem>
                        ) : (
                          pessoas.data.map((pessoa) => (
                            <SelectItem key={pessoa.id} value={pessoa.id.toString()}>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {pessoa.nome} {pessoa.cpf && `- CPF: ${pessoa.cpf}`}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Link href="/dashboard/imobiliaria/pessoas/novo">
                      <Button type="button" variant="outline" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <FormDescription>
                    Selecione a pessoa que será o locador ou cadastre uma nova pessoa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Pessoa */}
            <FormField
              control={form.control}
              name="tipo_pessoa"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    Tipo de Pessoa <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fisica" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Pessoa Física
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="juridica" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          Pessoa Jurídica
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos para Pessoa Jurídica */}
            {tipoPessoa === 'juridica' && (
              <>
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        CNPJ <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="00.000.000/0000-00"
                          maxLength={18}
                          {...field}
                          onChange={(e) => {
                            const masked = maskCNPJ(e.target.value)
                            field.onChange(masked)
                          }}
                        />
                      </FormControl>
                      <FormDescription>Formato: 00.000.000/0000-00</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="razao_social"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Razão Social <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a razão social da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {tipoPessoa === 'fisica' && (
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  Para pessoa física, o CPF e demais informações já constam no cadastro da pessoa selecionada.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel || (() => router.back())}
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
                {locadorId ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
