'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { imovelSchema, type ImovelFormData } from '@/lib/validations/imobiliaria'
import { useCreateImovel, useUpdateImovel, useTiposImovel, useLocadores } from '@/hooks/useImobiliaria'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from '@/components/ui/form'
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

  const form = useForm<ImovelFormData>({
    resolver: zodResolver(imovelSchema) as any,
    defaultValues: initialData || {
      tipo_imovel_id: undefined,
      locador_id: undefined,
      codigo_imovel: '',
      quartos: 0,
      banheiros: 0,
      vagas_garagem: 0,
      area_total: 0,
      valor_aluguel: 0,
      valor_condominio: 0,
      iptu: 0,
      disponivel: true
    }
  })

  const onSubmit = async (data: ImovelFormData) => {
    try {
      if (imovelId) {
        await updateMutation.mutateAsync({ id: imovelId, input: data })
        toast.success('Imóvel atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Imóvel cadastrado com sucesso!')
      }
      onSuccess?.() || router.push('/dashboard/imobiliaria/imoveis')
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar imóvel')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Dados principais do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="tipo_imovel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de Imóvel <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!tiposImovel || tiposImovel.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Não cadastrado
                          </SelectItem>
                        ) : (
                          tiposImovel.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                              {tipo.descricao}
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
                name="locador_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Locador (Proprietário) <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      value={field.value?.toString() || ''}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o proprietário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {!locadores || locadores.length === 0 ? (
                          <SelectItem value="none" disabled>
                            Não cadastrado
                          </SelectItem>
                        ) : (
                          locadores.map((locador) => (
                            <SelectItem key={locador.id} value={locador.id.toString()}>
                              {locador.pessoa?.nome}
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
                name="codigo_imovel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do Imóvel</FormLabel>
                    <FormControl>
                      <Input placeholder="IMV001" {...field} />
                    </FormControl>
                    <FormDescription>Código interno de identificação</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
            <CardDescription>Detalhes e metragem do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <FormField
                control={form.control}
                name="quartos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quartos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banheiros"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banheiros</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vagas_garagem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vagas Garagem</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="area_total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Total (m²)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valores</CardTitle>
            <CardDescription>Informações financeiras do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="valor_aluguel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Valor do Aluguel <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Valor mensal do aluguel</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_condominio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condomínio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Valor mensal do condomínio</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="iptu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPTU</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>Valor mensal do IPTU</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                {imovelId ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
