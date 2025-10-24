'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { locatarioSchema, type LocatarioFormData } from '@/lib/validations/imobiliaria'
import { useCreateLocatario, useUpdateLocatario, usePessoas } from '@/hooks/useImobiliaria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
import { Loader2, Save, X, User, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LocatarioFormProps {
  initialData?: LocatarioFormData
  locatarioId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function LocatarioForm({ initialData, locatarioId, onSuccess, onCancel }: LocatarioFormProps) {
  const router = useRouter()
  const { data: pessoas, isLoading: loadingPessoas } = usePessoas()
  const createMutation = useCreateLocatario()
  const updateMutation = useUpdateLocatario()

  const form = useForm<LocatarioFormData>({
    resolver: zodResolver(locatarioSchema) as any,
    defaultValues: initialData || {
      pessoa_id: 0,
      referencias: '',
      renda_mensal: undefined
    }
  })

  const onSubmit = async (data: LocatarioFormData) => {
    try {
      if (locatarioId) {
        await updateMutation.mutateAsync({ id: locatarioId, input: data })
        toast.success('Locatário atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Locatário cadastrado com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/locatarios')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar locatário')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Locatário (Inquilino)</CardTitle>
            <CardDescription>
              Cadastre os dados do inquilino. Os contratos de locação serão criados posteriormente.
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
                    Selecione a pessoa que será o locatário ou cadastre uma nova pessoa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Renda Mensal */}
            <FormField
              control={form.control}
              name="renda_mensal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Renda Mensal</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-9"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        value={field.value || ''}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Renda mensal declarada pelo locatário (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Referências */}
            <FormField
              control={form.control}
              name="referencias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referências</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Referências pessoais ou profissionais do locatário..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Informações de referências pessoais, profissionais ou anteriores de locação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Informação:</strong> Os dados pessoais (CPF, telefone, email, endereço) já constam no cadastro da pessoa selecionada.
                Os contratos de locação serão criados na seção de Contratos, onde você poderá vincular o locatário a um imóvel disponível.
              </p>
            </div>
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
                {locatarioId ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
