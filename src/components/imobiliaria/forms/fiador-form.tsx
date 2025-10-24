'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { fiadorSchema, type FiadorFormData } from '@/lib/validations/imobiliaria'
import { useCreateFiador, useUpdateFiador, usePessoas } from '@/hooks/useImobiliaria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
import { Loader2, Save, X, User, Wallet } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FiadorFormProps {
  initialData?: FiadorFormData
  fiadorId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function FiadorForm({ initialData, fiadorId, onSuccess, onCancel }: FiadorFormProps) {
  const router = useRouter()
  const { data: pessoas, isLoading: loadingPessoas } = usePessoas()
  const createMutation = useCreateFiador()
  const updateMutation = useUpdateFiador()

  const form = useForm<FiadorFormData>({
    resolver: zodResolver(fiadorSchema) as any,
    defaultValues: initialData || {
      pessoa_id: 0,
      observacoes: '',
      patrimonio_estimado: undefined
    }
  })

  const onSubmit = async (data: FiadorFormData) => {
    try {
      if (fiadorId) {
        await updateMutation.mutateAsync({ id: fiadorId, input: data })
        toast.success('Fiador atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Fiador cadastrado com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/fiadores')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar fiador')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados do Fiador</CardTitle>
            <CardDescription>
              Cadastre os dados do fiador. O fiador poderá ser associado a contratos de locação posteriormente.
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
                                {pessoa.nome} {pessoa.cpf_cnpj && `- CPF/CNPJ: ${pessoa.cpf_cnpj}`}
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
                    Selecione a pessoa que será o fiador ou cadastre uma nova pessoa
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Patrimônio Estimado */}
            <FormField
              control={form.control}
              name="patrimonio_estimado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patrimônio Estimado</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                    Patrimônio estimado do fiador (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre o fiador, histórico, etc..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Informações adicionais sobre o fiador
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Importante:</strong> O fiador será vinculado a um contrato de locação específico.
                Certifique-se de ter todas as informações necessárias da pessoa cadastrada antes de prosseguir.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          ) : (
            <Link href="/dashboard/imobiliaria/fiadores">
              <Button type="button" variant="outline">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {fiadorId ? 'Atualizar' : 'Cadastrar'} Fiador
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
