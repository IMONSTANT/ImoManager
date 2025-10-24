'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pessoaSchema, type PessoaFormData } from '@/lib/validations/imobiliaria'
import { useCreatePessoa, useUpdatePessoa, useProfissoes } from '@/hooks/useImobiliaria'
import { maskCPF, maskPhone, unformatCPF, unformatPhone } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PessoaFormProps {
  initialData?: PessoaFormData
  pessoaId?: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function PessoaForm({ initialData, pessoaId, onSuccess, onCancel }: PessoaFormProps) {
  const router = useRouter()
  const { data: profissoes } = useProfissoes()
  const createMutation = useCreatePessoa()
  const updateMutation = useUpdatePessoa()

  const form = useForm<PessoaFormData>({
    resolver: zodResolver(pessoaSchema) as any,
    defaultValues: initialData || {
      nome: '',
      tipo: 'PF',
      data_nascimento: '',
      cpf: '',
      rg: '',
      estado_civil: undefined,
      nacionalidade: 'brasileiro(a)',
      email: '',
      telefone: '',
      observacoes: ''
    }
  })

  const onSubmit = async (data: PessoaFormData) => {
    try {
      // Normalizar campos antes de enviar ao banco (remover máscaras)
      const normalizedData = {
        ...data,
        cpf: data.cpf ? unformatCPF(data.cpf) : data.cpf,
        telefone: data.telefone ? unformatPhone(data.telefone) : data.telefone
      }

      if (pessoaId) {
        await updateMutation.mutateAsync({ id: pessoaId, input: normalizedData })
        toast.success('Pessoa atualizada com sucesso!')
      } else {
        await createMutation.mutateAsync(normalizedData)
        toast.success('Pessoa cadastrada com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/pessoas')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar pessoa')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas da pessoa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome Completo <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                        <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="data_nascimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado_civil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado Civil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solteiro(a)">Solteiro(a)</SelectItem>
                        <SelectItem value="casado(a)">Casado(a)</SelectItem>
                        <SelectItem value="divorciado(a)">Divorciado(a)</SelectItem>
                        <SelectItem value="viúvo(a)">Viúvo(a)</SelectItem>
                        <SelectItem value="união estável">União Estável</SelectItem>
                        <SelectItem value="separado(a)">Separado(a)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nacionalidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nacionalidade</FormLabel>
                    <FormControl>
                      <Input placeholder="brasileiro(a)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000.000.000-00"
                        maxLength={14}
                        {...field}
                        onChange={(e) => {
                          const masked = maskCPF(e.target.value)
                          field.onChange(masked)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Formato: 000.000.000-00</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o RG" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemplo@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(85) 98765-4321"
                        maxLength={15}
                        {...field}
                        onChange={(e) => {
                          const masked = maskPhone(e.target.value)
                          field.onChange(masked)
                        }}
                      />
                    </FormControl>
                    <FormDescription>Formato: (00) 00000-0000</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="profissao_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissão</FormLabel>
                  <Select
                    value={field.value?.toString() || ''}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a profissão" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!profissoes || profissoes.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Não cadastrado
                        </SelectItem>
                      ) : (
                        profissoes.map((profissao) => (
                          <SelectItem key={profissao.id} value={profissao.id.toString()}>
                            {profissao.descricao}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre a pessoa..."
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Adicione qualquer informação relevante sobre a pessoa
                  </FormDescription>
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
                {pessoaId ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
