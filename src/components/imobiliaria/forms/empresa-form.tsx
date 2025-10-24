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
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Loader2, Save, X, Plus, MapPin } from 'lucide-react'
import Link from 'next/link'

const empresaSchema = z.object({
  descricao: z.string().min(1, 'Informe a descrição/nome da empresa'),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  cnpj: z.string().optional(),
  inscricao_estadual: z.string().optional(),
  inscricao_municipal: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  contato_principal: z.string().optional(),
  endereco_id: z.string().min(1, 'Selecione um endereço'),
  imovel_id: z.string().optional(),
  observacoes: z.string().optional(),
})

type EmpresaFormValues = z.infer<typeof empresaSchema>

interface EmpresaFormProps {
  initialData?: any
  empresaId?: number
  onSuccess?: () => void
}

export function EmpresaForm({ initialData, empresaId, onSuccess }: EmpresaFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imoveis, setImoveis] = useState<any[]>([])
  const [enderecos, setEnderecos] = useState<any[]>([])
  const supabase = createClient()

  const form = useForm<EmpresaFormValues>({
    resolver: zodResolver(empresaSchema),
    defaultValues: initialData ? {
      descricao: initialData.descricao || '',
      razao_social: initialData.razao_social || '',
      nome_fantasia: initialData.nome_fantasia || '',
      cnpj: initialData.cnpj || '',
      inscricao_estadual: initialData.inscricao_estadual || '',
      inscricao_municipal: initialData.inscricao_municipal || '',
      email: initialData.email || '',
      telefone: initialData.telefone || '',
      contato_principal: initialData.contato_principal || '',
      endereco_id: initialData.endereco_id?.toString() || '',
      imovel_id: initialData.imovel_id?.toString() || '',
      observacoes: initialData.observacoes || '',
    } : undefined,
  })

  useEffect(() => {
    fetchImoveis()
    fetchEnderecos()
  }, [])

  async function fetchImoveis() {
    try {
      const { data, error } = await supabase
        .from('imovel')
        .select('id, codigo_imovel, endereco:endereco_id(logradouro, numero)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setImoveis(data || [])
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error)
    }
  }

  async function fetchEnderecos() {
    try {
      const { data, error } = await supabase
        .from('endereco')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEnderecos(data || [])
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    }
  }

  async function onSubmit(data: EmpresaFormValues) {
    setLoading(true)
    try {
      // Dados da empresa
      const empresaData = {
        descricao: data.descricao,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        cnpj: data.cnpj ? data.cnpj.replace(/\D/g, '') : null,
        inscricao_estadual: data.inscricao_estadual,
        inscricao_municipal: data.inscricao_municipal,
        endereco_id: parseInt(data.endereco_id),
        imovel_id: data.imovel_id ? parseInt(data.imovel_id) : null,
        email: data.email,
        telefone: data.telefone ? data.telefone.replace(/\D/g, '') : null,
        contato_principal: data.contato_principal,
        observacoes: data.observacoes,
      }

      if (empresaId) {
        // Modo de edição
        const { error: empresaError } = await (supabase as any)
          .from('empresa_cliente')
          .update(empresaData)
          .eq('id', empresaId)

        if (empresaError) throw empresaError
        toast.success('Empresa atualizada com sucesso!')
      } else {
        // Modo de criação
        const { error: empresaError } = await (supabase as any)
          .from('empresa_cliente')
          .insert(empresaData)

        if (empresaError) throw empresaError
        toast.success('Empresa cadastrada com sucesso!')
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/dashboard/imobiliaria/empresas')
      }
    } catch (error: any) {
      console.error('Erro ao salvar empresa:', error)
      toast.error(error.message || 'Erro ao salvar empresa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>Informações cadastrais da empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição/Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="razao_social"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nome_fantasia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome fantasia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inscricao_estadual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição Estadual</FormLabel>
                  <FormControl>
                    <Input placeholder="IE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inscricao_municipal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inscrição Municipal</FormLabel>
                  <FormControl>
                    <Input placeholder="IM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@empresa.com" {...field} />
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
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contato_principal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contato Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imovel_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel Vinculado (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um imóvel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imoveis.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum imóvel cadastrado
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
          </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Selecione o endereço da empresa</CardDescription>
              </div>
              <Link href="/dashboard/imobiliaria/enderecos/novo" target="_blank">
                <Button type="button" variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Endereço
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="endereco_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um endereço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {enderecos.length === 0 ? (
                        <SelectItem value="none" disabled>
                          Nenhum endereço cadastrado
                        </SelectItem>
                      ) : (
                        enderecos.map((endereco) => (
                          <SelectItem key={endereco.id} value={endereco.id.toString()}>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {endereco.logradouro}, {endereco.numero} - {endereco.bairro}, {endereco.cidade}/{endereco.uf}
                              {endereco.complemento && ` - ${endereco.complemento}`}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Se o endereço não estiver cadastrado, clique em "Novo Endereço" acima
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
            <CardDescription>Observações e notas sobre a empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre a empresa..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Adicione informações relevantes sobre a empresa
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
                {empresaId ? 'Atualizar' : 'Cadastrar'} Empresa
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
