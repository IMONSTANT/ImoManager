'use client'

import { useImovel } from '@/hooks/useImobiliaria'
import { formatCurrency, formatArea, formatDate } from '@/lib/utils/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Car,
  Ruler,
  DollarSign,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  ArrowLeft,
  Edit,
  CheckCircle2,
  XCircle,
  Home,
  MapPinned,
  Banknote
} from 'lucide-react'
import Link from 'next/link'

interface ImovelDetailsProps {
  imovelId: number
}

export function ImovelDetails({ imovelId }: ImovelDetailsProps) {
  const { data: imovel, isLoading, error } = useImovel(imovelId)

  if (isLoading) {
    return <ImovelDetailsSkeleton />
  }

  if (error || !imovel) {
    return (
      <Card className="border-destructive">
        <CardContent className="flex items-center gap-2 p-6">
          <XCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            Erro ao carregar detalhes do imóvel.
          </p>
        </CardContent>
      </Card>
    )
  }

  const valorTotal = imovel.valor_aluguel + (imovel.valor_condominio || 0) + (imovel.iptu || 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/imobiliaria/imoveis">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {imovel.codigo_imovel || `IMV${imovel.id}`}
              </h1>
              <p className="text-muted-foreground">
                {imovel.tipo_imovel?.descricao || 'Tipo não definido'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={imovel.disponivel ? 'default' : 'secondary'}
            className="gap-1.5 px-3 py-1.5 text-sm"
          >
            {imovel.disponivel ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Disponível
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Ocupado
              </>
            )}
          </Badge>
          <Button asChild>
            <Link href={`/dashboard/imobiliaria/imoveis/${imovel.id}/editar`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Descrição */}
          {imovel.descricao && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {imovel.descricao}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Características */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Características
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {imovel.quartos !== null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{imovel.quartos}</p>
                      <p className="text-sm text-muted-foreground">
                        {imovel.quartos === 1 ? 'Quarto' : 'Quartos'}
                      </p>
                    </div>
                  </div>
                )}

                {imovel.banheiros !== null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{imovel.banheiros}</p>
                      <p className="text-sm text-muted-foreground">
                        {imovel.banheiros === 1 ? 'Banheiro' : 'Banheiros'}
                      </p>
                    </div>
                  </div>
                )}

                {imovel.vagas_garagem !== null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{imovel.vagas_garagem}</p>
                      <p className="text-sm text-muted-foreground">
                        {imovel.vagas_garagem === 1 ? 'Vaga' : 'Vagas'}
                      </p>
                    </div>
                  </div>
                )}

                {imovel.area_total !== null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Ruler className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {imovel.area_total.toFixed(0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        m² Total
                      </p>
                    </div>
                  </div>
                )}

                {imovel.area_construida !== null && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-primary/10 p-2.5">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {imovel.area_construida.toFixed(0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        m² Construída
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          {imovel.endereco && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-primary" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">
                      {imovel.endereco.logradouro}, {imovel.endereco.numero}
                      {imovel.endereco.complemento && ` - ${imovel.endereco.complemento}`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {imovel.endereco.bairro}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {imovel.endereco.cidade} - {imovel.endereco.uf}, {imovel.endereco.cep}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observações */}
          {imovel.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {imovel.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Valores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Aluguel</span>
                  <span className="text-lg font-semibold text-green-600">
                    {formatCurrency(imovel.valor_aluguel)}
                  </span>
                </div>

                {imovel.valor_condominio && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Condomínio</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(imovel.valor_condominio)}
                    </span>
                  </div>
                )}

                {imovel.iptu && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">IPTU</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(imovel.iptu)}
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total Mensal</span>
                  <span className="text-xl font-bold text-green-700">
                    {formatCurrency(valorTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Locador */}
          {imovel.locador?.pessoa && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Proprietário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">
                    {imovel.locador.pessoa.nome}
                  </p>
                  {imovel.locador.tipo_pessoa === 'juridica' && imovel.locador.razao_social && (
                    <p className="text-sm text-muted-foreground">
                      {imovel.locador.razao_social}
                    </p>
                  )}
                </div>

                {imovel.locador.pessoa.telefone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{imovel.locador.pessoa.telefone}</span>
                  </div>
                )}

                {imovel.locador.pessoa.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="break-all">{imovel.locador.pessoa.email}</span>
                  </div>
                )}

                {imovel.locador.pessoa.cpf && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="text-sm font-mono">{imovel.locador.pessoa.cpf}</p>
                  </div>
                )}

                {imovel.locador.cnpj && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">CNPJ</p>
                    <p className="text-sm font-mono">{imovel.locador.cnpj}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Informações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {imovel.data_disponibilidade && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Disponível desde
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(imovel.data_disponibilidade)}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Cadastrado em
                </p>
                <p className="text-sm font-medium">
                  {formatDate(imovel.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Última atualização
                </p>
                <p className="text-sm font-medium">
                  {formatDate(imovel.updated_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ImovelDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
