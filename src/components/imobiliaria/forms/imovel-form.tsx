'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { imovelSchema, type ImovelFormData } from '@/lib/validations/imobiliaria'
import { useCreateImovel, useUpdateImovel, useTiposImovel, useLocadores } from '@/hooks/useImobiliaria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ImovelFormProps {
  initialData?: ImovelFormData
  imovelId?: number
  onSuccess?: () => void
}

export function ImovelForm({ initialData, imovelId, onSuccess }: ImovelFormProps) {
  const router = useRouter()
  const { data: tiposImovel } = useTiposImovel()
  const { data: locadores } = useLocadores()
  const createMutation = useCreateImovel()
  const updateMutation = useUpdateImovel()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(imovelSchema),
    defaultValues: initialData || {}
  })

  const onSubmit = async (data: ImovelFormData) => {
    try {
      if (imovelId) {
        await updateMutation.mutateAsync({ id: imovelId, input: data })
        toast.success('Imóvel atualizado!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Imóvel cadastrado!')
      }
      onSuccess?.() || router.push('/dashboard/imobiliaria/imoveis')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Imóvel</CardTitle>
          <CardDescription>Informações básicas do imóvel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tipo de Imóvel *</Label>
              <Select value={watch('tipo_imovel_id')?.toString()} onValueChange={(v) => setValue('tipo_imovel_id', parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {tiposImovel?.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.descricao}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.tipo_imovel_id && <p className="text-sm text-destructive">{errors.tipo_imovel_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Locador (Proprietário) *</Label>
              <Select value={watch('locador_id')?.toString()} onValueChange={(v) => setValue('locador_id', parseInt(v))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {locadores?.map(l => <SelectItem key={l.id} value={l.id.toString()}>{l.pessoa?.nome}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.locador_id && <p className="text-sm text-destructive">{errors.locador_id.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Código do Imóvel</Label>
              <Input {...register('codigo_imovel')} placeholder="IMV001" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Quartos</Label>
              <Input type="number" {...register('quartos')} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Banheiros</Label>
              <Input type="number" {...register('banheiros')} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Vagas Garagem</Label>
              <Input type="number" {...register('vagas_garagem')} placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Área Total (m²)</Label>
              <Input type="number" step="0.01" {...register('area_total')} placeholder="0.00" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Valor Aluguel *</Label>
              <Input type="number" step="0.01" {...register('valor_aluguel')} placeholder="0.00" />
              {errors.valor_aluguel && <p className="text-sm text-destructive">{errors.valor_aluguel.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Condomínio</Label>
              <Input type="number" step="0.01" {...register('valor_condominio')} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>IPTU</Label>
              <Input type="number" step="0.01" {...register('iptu')} placeholder="0.00" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          <X className="mr-2 h-4 w-4" />Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : <><Save className="mr-2 h-4 w-4" />{imovelId ? 'Atualizar' : 'Cadastrar'}</>}
        </Button>
      </div>
    </form>
  )
}
