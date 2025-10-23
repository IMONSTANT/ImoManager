"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Save, X, FileText, DollarSign, Calendar } from 'lucide-react'

const contratoSchema = z.object({
  imovel_id: z.string().min(1, 'Selecione um imóvel'),
  locatario_id: z.string().min(1, 'Selecione um locatário'),
  tipo_locacao_id: z.string().min(1, 'Selecione o tipo de locação'),
  valor: z.string().min(1, 'Informe o valor do aluguel'),
  caucao: z.string().optional(),
  valor_iptu: z.string().optional(),
  valor_condominio: z.string().optional(),
  data_inicio_contrato: z.string().min(1, 'Informe a data de início'),
  data_fim_contrato: z.string().min(1, 'Informe a data de fim'),
  dia_vencimento: z.string().min(1, 'Informe o dia de vencimento'),
  indice_reajuste: z.string().optional(),
  periodicidade_reajuste: z.string().optional(),
  observacoes: z.string().optional(),
  clausulas_especiais: z.string().optional(),
})

type ContratoFormValues = z.infer<typeof contratoSchema>

interface ContratoFormProps {
  initialData?: any
  contratoId?: number
  onSuccess?: () => void
}

export function ContratoForm({ initialData, contratoId, onSuccess }: ContratoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imoveis, setImoveis] = useState<any[]>([])
  const [locatarios, setLocatarios] = useState<any[]>([])
  const [tiposLocacao, setTiposLocacao] = useState<any[]>([])
  const supabase = createClient()

  const form = useForm<ContratoFormValues>({
    resolver: zodResolver(contratoSchema),
    defaultValues: initialData ? {
      imovel_id: initialData.imovel_id?.toString() || '',
      locatario_id: initialData.locatario_id?.toString() || '',
      tipo_locacao_id: initialData.tipo_locacao_id?.toString() || '',
      valor: initialData.valor?.toString() || '',
      caucao: initialData.caucao?.toString() || '',
      valor_iptu: initialData.valor_iptu?.toString() || '',
      valor_condominio: initialData.valor_condominio?.toString() || '',
      data_inicio_contrato: initialData.data_inicio_contrato || '',
      data_fim_contrato: initialData.data_fim_contrato || '',
      dia_vencimento: initialData.dia_vencimento?.toString() || '10',
      indice_reajuste: initialData.indice_reajuste || 'IGPM',
      periodicidade_reajuste: initialData.periodicidade_reajuste?.toString() || '12',
      observacoes: initialData.observacoes || '',
      clausulas_especiais: initialData.clausulas_especiais || '',
    } : {
      dia_vencimento: '10',
      indice_reajuste: 'IGPM',
      periodicidade_reajuste: '12',
    },
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  async function fetchOptions() {
    try {
      // Em modo de edição, carregar todos os imóveis; em modo de criação, apenas disponíveis
      const imoveisQuery = contratoId
        ? supabase
            .from('imovel')
            .select('id, codigo_imovel, endereco:endereco(logradouro, numero)')
        : supabase
            .from('imovel')
            .select('id, codigo_imovel, endereco:endereco(logradouro, numero)')
            .eq('disponivel', true)

      const [imoveisRes, locatariosRes, tiposRes] = await Promise.all([
        imoveisQuery,
        supabase
          .from('locatario')
          .select('id, pessoa:pessoa(nome)'),
        supabase
          .from('tipo_locacao')
          .select('*')
      ])

      if (imoveisRes.data) setImoveis(imoveisRes.data)
      if (locatariosRes.data) setLocatarios(locatariosRes.data)
      if (tiposRes.data) setTiposLocacao(tiposRes.data)
    } catch (error) {
      console.error('Erro ao carregar opções:', error)
      toast.error('Erro ao carregar opções do formulário')
    }
  }

  async function onSubmit(data: ContratoFormValues) {
    setLoading(true)
    try {
      const contratoData = {
        imovel_id: parseInt(data.imovel_id),
        locatario_id: parseInt(data.locatario_id),
        tipo_locacao_id: parseInt(data.tipo_locacao_id),
        valor: parseFloat(data.valor),
        caucao: data.caucao ? parseFloat(data.caucao) : null,
        valor_iptu: data.valor_iptu ? parseFloat(data.valor_iptu) : null,
        valor_condominio: data.valor_condominio ? parseFloat(data.valor_condominio) : null,
        data_inicio_contrato: data.data_inicio_contrato,
        data_fim_contrato: data.data_fim_contrato,
        dia_vencimento: parseInt(data.dia_vencimento),
        indice_reajuste: data.indice_reajuste || 'IGPM',
        periodicidade_reajuste: data.periodicidade_reajuste ? parseInt(data.periodicidade_reajuste) : 12,
        observacoes: data.observacoes,
        clausulas_especiais: data.clausulas_especiais,
      }

      if (contratoId) {
        // Modo de edição
        const { error } = await supabase
          .from('contrato_locacao')
          .update(contratoData)
          .eq('id', contratoId)

        if (error) throw error

        toast.success('Contrato atualizado com sucesso!')
      } else {
        // Modo de criação
        const { error } = await supabase
          .from('contrato_locacao')
          .insert({
            ...contratoData,
            status: 'ativo' as const,
            contrato_assinado: false,
          })

        if (error) throw error

        // Atualizar disponibilidade do imóvel
        await supabase
          .from('imovel')
          .update({ disponivel: false })
          .eq('id', parseInt(data.imovel_id))

        toast.success('Contrato criado com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/contratos')
      }
    } catch (error: any) {
      console.error('Erro ao salvar contrato:', error)
      toast.error(error.message || 'Erro ao salvar contrato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações do Contrato
            </CardTitle>
            <CardDescription>Selecione o imóvel, locatário e tipo de locação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="imovel_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imóvel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o imóvel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {imoveis.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Não cadastrado
                      </SelectItem>
                    ) : (
                      imoveis.map((imovel) => (
                        <SelectItem key={imovel.id} value={imovel.id.toString()}>
                          {imovel.codigo_imovel} - {imovel.endereco?.logradouro}, {imovel.endereco?.numero}
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
            name="locatario_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locatário</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o locatário" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locatarios.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Não cadastrado
                      </SelectItem>
                    ) : (
                      locatarios.map((locatario) => (
                        <SelectItem key={locatario.id} value={locatario.id.toString()}>
                          {locatario.pessoa?.nome}
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
            name="tipo_locacao_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Locação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposLocacao.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Não cadastrado
                      </SelectItem>
                    ) : (
                      tiposLocacao.map((tipo) => (
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Valores
            </CardTitle>
            <CardDescription>Valores mensais do contrato de locação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Aluguel <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                    <FormLabel>Valor do Condomínio</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Valor mensal do condomínio</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_iptu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do IPTU</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Valor mensal do IPTU</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="caucao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caução</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Valor da caução inicial</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período e Vencimento
            </CardTitle>
            <CardDescription>Datas e informações de reajuste do contrato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="data_inicio_contrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_fim_contrato"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Fim <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dia_vencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" placeholder="10" {...field} />
                    </FormControl>
                    <FormDescription>Dia do mês para vencimento do aluguel</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indice_reajuste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Índice de Reajuste</FormLabel>
                    <FormControl>
                      <Input placeholder="IGPM" {...field} />
                    </FormControl>
                    <FormDescription>Índice usado para reajuste anual</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodicidade_reajuste"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodicidade de Reajuste (meses)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormDescription>Quantidade de meses entre reajustes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>Observações e cláusulas especiais do contrato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações gerais sobre o contrato..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Adicione informações relevantes sobre o contrato</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clausulas_especiais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cláusulas Especiais</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cláusulas especiais do contrato..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Cláusulas específicas e diferenciadas deste contrato</FormDescription>
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
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Criar Contrato
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
