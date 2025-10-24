'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, User, Shield, DollarSign, Calendar, Edit } from 'lucide-react';
import type { NovaLocacaoState } from '@/hooks/use-create-locacao';

interface ContratoPreviewProps {
  dados: NovaLocacaoState;
  onConfirm: () => void;
  onEdit: (step?: number) => void;
  isLoading?: boolean;
}

export function ContratoPreview({ dados, onConfirm, onEdit, isLoading }: ContratoPreviewProps) {
  const { imovelSelecionado, locatario, garantia, dadosFinanceiros } = dados;

  if (!imovelSelecionado || !locatario || !garantia || !dadosFinanceiros) {
    return <div>Dados incompletos</div>;
  }

  const valorTotal =
    dadosFinanceiros.valor_aluguel + dadosFinanceiros.valor_iptu + dadosFinanceiros.valor_condominio;

  const dataFim = new Date(dadosFinanceiros.data_inicio);
  dataFim.setMonth(dataFim.getMonth() + dadosFinanceiros.duracao_meses);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Preview do Contrato</h2>
        <p className="text-muted-foreground">Revise todas as informações antes de gerar o contrato</p>
      </div>

      {/* Resumo do Contrato */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Resumo do Contrato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Imóvel:</p>
              <p className="font-semibold">{imovelSelecionado.codigo_interno}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Locatário:</p>
              <p className="font-semibold">
                {locatario.tipo === 'novo' ? locatario.dados.nome : locatario.dados.nome}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Valor Mensal:</p>
              <p className="font-semibold text-primary">R$ {valorTotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Duração:</p>
              <p className="font-semibold">{dadosFinanceiros.duracao_meses} meses</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Imóvel */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados do Imóvel
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(0)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Badge>{imovelSelecionado.codigo_interno}</Badge>
            <p className="font-semibold mt-2">{imovelSelecionado.tipo_imovel}</p>
          </div>
          <div className="text-sm">
            <p>
              {imovelSelecionado.endereco.logradouro}, {imovelSelecionado.endereco.numero}
            </p>
            <p className="text-muted-foreground">
              {imovelSelecionado.endereco.bairro} - {imovelSelecionado.endereco.cidade}/
              {imovelSelecionado.endereco.uf}
            </p>
            <p className="text-muted-foreground">{imovelSelecionado.endereco.cep}</p>
          </div>
          <div className="pt-2">
            <p className="text-lg font-bold text-primary">R$ {imovelSelecionado.valor_aluguel.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Valor base do aluguel</p>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Locatário */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados do Locatário
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <p className="font-semibold">{locatario.tipo === 'novo' ? locatario.dados.nome : locatario.dados.nome}</p>
            <p className="text-muted-foreground">
              {locatario.tipo === 'novo' ? locatario.dados.cpf_cnpj : locatario.dados.cpf_cnpj}
            </p>
          </div>
          <div>
            <p>{locatario.tipo === 'novo' ? locatario.dados.email : locatario.dados.email}</p>
            <p>{locatario.tipo === 'novo' ? locatario.dados.telefone : locatario.dados.telefone}</p>
          </div>
          {locatario.tipo === 'novo' && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground">Endereço:</p>
              <p>
                {locatario.dados.endereco.logradouro}, {locatario.dados.endereco.numero}
              </p>
              <p>
                {locatario.dados.endereco.bairro} - {locatario.dados.endereco.cidade}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Garantia */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Garantia
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <Badge variant={garantia.tipo === 'caucao' ? 'default' : 'secondary'}>
              {garantia.tipo === 'caucao' ? 'Caução' : 'Fiador'}
            </Badge>
          </div>

          {garantia.tipo === 'caucao' && (
            <div>
              <p className="text-lg font-bold text-primary">R$ {garantia.valor.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Valor da caução</p>
            </div>
          )}

          {garantia.tipo === 'fiador' && (
            <div className="text-sm space-y-1">
              <p className="font-semibold">{garantia.fiador.nome}</p>
              <p className="text-muted-foreground">{garantia.fiador.cpf}</p>
              <p>{garantia.fiador.email}</p>
              <p>{garantia.fiador.profissao}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dados Financeiros */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Dados Financeiros
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
            <Edit className="h-4 w-4" />
            Editar
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Aluguel:</span>
              <span>R$ {dadosFinanceiros.valor_aluguel.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IPTU:</span>
              <span>R$ {dadosFinanceiros.valor_iptu.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Condomínio:</span>
              <span>R$ {dadosFinanceiros.valor_condominio.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total Mensal:</span>
              <span className="text-primary">R$ {valorTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-muted-foreground">Vencimento:</p>
              <p className="font-semibold">Dia {dadosFinanceiros.dia_vencimento}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Reajuste:</p>
              <p className="font-semibold">{dadosFinanceiros.indice_reajuste}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Início:</p>
              <p className="font-semibold">{dadosFinanceiros.data_inicio.toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Término:</p>
              <p className="font-semibold">{dataFim.toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Duração:</span> {dadosFinanceiros.duracao_meses} meses
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => onEdit()} className="flex-1">
          Voltar e Editar
        </Button>
        <Button onClick={onConfirm} disabled={isLoading} className="flex-1">
          {isLoading ? 'Criando contrato...' : 'Gerar Contrato'}
        </Button>
      </div>
    </div>
  );
}
