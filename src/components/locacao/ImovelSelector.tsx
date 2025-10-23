'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, BedDouble, Car, Maximize } from 'lucide-react';
import type { ImovelSelecionado } from '@/hooks/use-create-locacao';

interface ImovelSelectorProps {
  onSelect: (imovel: ImovelSelecionado) => void;
  selectedId?: string;
}

export function ImovelSelector({ onSelect, selectedId }: ImovelSelectorProps) {
  const supabase = createClient();

  // Filtros
  const [busca, setBusca] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
  const [bairroFiltro, setBairroFiltro] = useState('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [valorMin, setValorMin] = useState('');
  const [valorMax, setValorMax] = useState('');
  const [quartosMin, setQuartosMin] = useState('');
  const [vagasMin, setVagasMin] = useState('');

  // Query dos imóveis
  const { data: imoveis, isLoading } = useQuery({
    queryKey: ['imoveis-disponiveis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imovel')
        .select(`
          id,
          codigo_imovel,
          tipo_imovel:tipo_imovel_id (descricao),
          endereco:endereco_id (logradouro, numero, complemento, bairro, cidade, uf, cep),
          quartos,
          banheiros,
          vagas_garagem,
          area_total,
          valor_aluguel,
          disponivel
        `)
        .eq('disponivel', true)
        .is('deleted_at', null)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Filtrar imóveis
  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return [];

    return imoveis.filter((imovel: any) => {
      // Busca por código ou endereço
      if (busca) {
        const buscaLower = busca.toLowerCase();
        const matchCodigo = imovel.codigo_imovel?.toLowerCase().includes(buscaLower);
        const matchEndereco = imovel.endereco?.logradouro?.toLowerCase().includes(buscaLower);
        if (!matchCodigo && !matchEndereco) return false;
      }

      // Tipo
      if (tipoFiltro !== 'todos') {
        const tipo = imovel.tipo_imovel?.descricao?.toLowerCase();
        if (tipo !== tipoFiltro.toLowerCase()) return false;
      }

      // Bairro
      if (bairroFiltro && !imovel.endereco?.bairro?.toLowerCase().includes(bairroFiltro.toLowerCase())) {
        return false;
      }

      // Cidade
      if (cidadeFiltro && !imovel.endereco?.cidade?.toLowerCase().includes(cidadeFiltro.toLowerCase())) {
        return false;
      }

      // Valor mínimo
      if (valorMin && imovel.valor_aluguel < parseFloat(valorMin)) {
        return false;
      }

      // Valor máximo
      if (valorMax && imovel.valor_aluguel > parseFloat(valorMax)) {
        return false;
      }

      // Quartos mínimos
      if (quartosMin && (!imovel.quartos || imovel.quartos < parseInt(quartosMin))) {
        return false;
      }

      // Vagas mínimas
      if (vagasMin && (!imovel.vagas_garagem || imovel.vagas_garagem < parseInt(vagasMin))) {
        return false;
      }

      return true;
    });
  }, [imoveis, busca, tipoFiltro, bairroFiltro, cidadeFiltro, valorMin, valorMax, quartosMin, vagasMin]);

  const limparFiltros = () => {
    setBusca('');
    setTipoFiltro('todos');
    setBairroFiltro('');
    setCidadeFiltro('');
    setValorMin('');
    setValorMax('');
    setQuartosMin('');
    setVagasMin('');
  };

  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando imóveis disponíveis...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="imoveis-grid">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!imoveis || imoveis.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Nenhum imóvel disponível para locação</p>
        <p className="text-sm text-muted-foreground mt-2">
          Cadastre imóveis com status &quot;Locação&quot; ou &quot;Ambos&quot;
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Filtros</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Busca */}
          <div>
            <Label htmlFor="busca">Buscar Imóvel</Label>
            <Input
              id="busca"
              placeholder="Buscar por código ou endereço"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tipo */}
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger id="tipo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bairro */}
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Filtrar por bairro"
                value={bairroFiltro}
                onChange={(e) => setBairroFiltro(e.target.value)}
              />
            </div>

            {/* Cidade */}
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Filtrar por cidade"
                value={cidadeFiltro}
                onChange={(e) => setCidadeFiltro(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Valor Mínimo */}
            <div>
              <Label htmlFor="valor-min">Valor Mínimo</Label>
              <Input
                id="valor-min"
                type="number"
                placeholder="R$ 0"
                value={valorMin}
                onChange={(e) => setValorMin(e.target.value)}
              />
            </div>

            {/* Valor Máximo */}
            <div>
              <Label htmlFor="valor-max">Valor Máximo</Label>
              <Input
                id="valor-max"
                type="number"
                placeholder="R$ 10.000"
                value={valorMax}
                onChange={(e) => setValorMax(e.target.value)}
              />
            </div>

            {/* Quartos */}
            <div>
              <Label htmlFor="quartos">Quartos (mín)</Label>
              <Input
                id="quartos"
                type="number"
                placeholder="0"
                value={quartosMin}
                onChange={(e) => setQuartosMin(e.target.value)}
              />
            </div>

            {/* Vagas */}
            <div>
              <Label htmlFor="vagas">Vagas (mín)</Label>
              <Input
                id="vagas"
                type="number"
                placeholder="0"
                value={vagasMin}
                onChange={(e) => setVagasMin(e.target.value)}
              />
            </div>
          </div>

          <Button variant="outline" onClick={limparFiltros} className="w-full">
            Limpar Filtros
          </Button>
        </CardContent>
      </Card>

      {/* Grid de Imóveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="imoveis-grid">
        {imoveisFiltrados.map((imovel: any) => (
          <Card
            key={imovel.id}
            data-testid={`imovel-card-${imovel.id}`}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedId === imovel.id ? 'ring-2 ring-primary selected' : ''
            }`}
          >
            {/* Foto ou Placeholder */}
            <div className="relative h-48 bg-muted">
              <div className="flex items-center justify-center h-full">
                <Building2 className="h-16 w-16 text-muted-foreground" />
                <span className="sr-only">Sem foto disponível</span>
              </div>
              <Badge className="absolute top-2 left-2">{imovel.codigo_imovel || `IMV${imovel.id}`}</Badge>
            </div>

            <CardContent className="p-4 space-y-3">
              {/* Tipo */}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{imovel.tipo_imovel?.descricao || 'N/A'}</span>
              </div>

              {/* Endereço */}
              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p data-testid="imovel-nome" className="font-medium">
                      {imovel.endereco?.logradouro}, {imovel.endereco?.numero}
                    </p>
                    <p className="text-muted-foreground">
                      {imovel.endereco?.bairro} - {imovel.endereco?.cidade}/{imovel.endereco?.uf}
                    </p>
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="flex gap-4 text-sm text-muted-foreground">
                {imovel.quartos > 0 && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-4 w-4" />
                    <span>{imovel.quartos} quartos</span>
                  </div>
                )}
                {imovel.vagas_garagem !== undefined && (
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    <span>{imovel.vagas_garagem} vaga{imovel.vagas_garagem !== 1 ? 's' : ''}</span>
                  </div>
                )}
                {imovel.area_total && (
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>{imovel.area_total} m²</span>
                  </div>
                )}
              </div>

              {/* Valor */}
              <div className="pt-2 border-t">
                <p className="text-2xl font-bold text-primary">{formatarValor(imovel.valor_aluguel)}</p>
                <p className="text-xs text-muted-foreground">por mês</p>
              </div>

              {/* Botão Selecionar */}
              <Button
                className="w-full"
                variant={selectedId === imovel.id ? 'default' : 'outline'}
                onClick={() =>
                  onSelect({
                    id: imovel.id,
                    codigo_interno: imovel.codigo_imovel || `IMV${imovel.id}`,
                    tipo_imovel: imovel.tipo_imovel?.descricao || 'N/A',
                    endereco: imovel.endereco,
                    valor_aluguel: imovel.valor_aluguel,
                    caracteristicas: {
                      quartos: imovel.quartos,
                      vagas: imovel.vagas_garagem,
                      area: imovel.area_total
                    },
                  })
                }
                data-testid="imovel-card"
              >
                {selectedId === imovel.id ? 'Selecionado' : 'Selecionar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {imoveisFiltrados.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg font-medium">Nenhum imóvel encontrado</p>
          <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros</p>
        </div>
      )}

      {/* Imóvel Selecionado */}
      {selectedId && (
        <div data-testid="imovel-selecionado" className="sr-only">
          {imoveisFiltrados.find((i: any) => i.id === selectedId)?.endereco?.logradouro}
        </div>
      )}
    </div>
  );
}
