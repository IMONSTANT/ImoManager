'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pessoaSchema, type PessoaFormData } from '@/lib/validations/imobiliaria'
import { useCreatePessoa, useUpdatePessoa, useProfissoes } from '@/hooks/useImobiliaria'
import { maskCPF, maskPhone } from '@/lib/utils/formatters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(pessoaSchema),
    defaultValues: initialData || {
      nome: '',
      data_nascimento: '',
      cpf: '',
      rg: '',
      email: '',
      telefone: '',
      observacoes: ''
    }
  })

  const cpfValue = watch('cpf')
  const telefoneValue = watch('telefone')

  const onSubmit = async (data: PessoaFormData) => {
    try {
      if (pessoaId) {
        await updateMutation.mutateAsync({ id: pessoaId, input: data })
        toast.success('Pessoa atualizada com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>Informações básicas da pessoa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Digite o nome completo"
                className={errors.nome ? 'border-destructive' : ''}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                {...register('data_nascimento')}
                className={errors.data_nascimento ? 'border-destructive' : ''}
              />
              {errors.data_nascimento && (
                <p className="text-sm text-destructive">{errors.data_nascimento.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* CPF */}
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="000.000.000-00"
                maxLength={14}
                onChange={(e) => {
                  const masked = maskCPF(e.target.value)
                  setValue('cpf', masked)
                }}
                value={cpfValue}
                className={errors.cpf ? 'border-destructive' : ''}
              />
              {errors.cpf && (
                <p className="text-sm text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            {/* RG */}
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                {...register('rg')}
                placeholder="Digite o RG"
                className={errors.rg ? 'border-destructive' : ''}
              />
              {errors.rg && (
                <p className="text-sm text-destructive">{errors.rg.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="exemplo@email.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(85) 98765-4321"
                maxLength={15}
                onChange={(e) => {
                  const masked = maskPhone(e.target.value)
                  setValue('telefone', masked)
                }}
                value={telefoneValue}
                className={errors.telefone ? 'border-destructive' : ''}
              />
              {errors.telefone && (
                <p className="text-sm text-destructive">{errors.telefone.message}</p>
              )}
            </div>
          </div>

          {/* Profissão */}
          <div className="space-y-2">
            <Label htmlFor="profissao_id">Profissão</Label>
            <Select
              value={watch('profissao_id')?.toString() || ''}
              onValueChange={(value) => setValue('profissao_id', parseInt(value))}
            >
              <SelectTrigger className={errors.profissao_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione a profissão" />
              </SelectTrigger>
              <SelectContent>
                {profissoes?.map((profissao) => (
                  <SelectItem key={profissao.id} value={profissao.id.toString()}>
                    {profissao.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.profissao_id && (
              <p className="text-sm text-destructive">{errors.profissao_id.message}</p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              placeholder="Informações adicionais..."
              rows={4}
              className={errors.observacoes ? 'border-destructive' : ''}
            />
            {errors.observacoes && (
              <p className="text-sm text-destructive">{errors.observacoes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => router.back())}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
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
  )
}
