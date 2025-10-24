'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { DadosFinanceirosFormData } from '@/lib/validations/locacao-forms';

interface DadosFinanceirosFormProps {
  onSubmit: (data: DadosFinanceirosFormData) => void;
  valorAluguel: number;
}

export function DadosFinanceirosForm({ onSubmit, valorAluguel }: DadosFinanceirosFormProps) {
  const [valorIPTU, setValorIPTU] = useState('0');
  const [valorCondominio, setValorCondominio] = useState('0');
  const [diaVencimento, setDiaVencimento] = useState('10');
  const [indiceReajuste, setIndiceReajuste] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [duracaoMeses, setDuracaoMeses] = useState('12');
  const [observacoes, setObservacoes] = useState('');

  const [valorTotal, setValorTotal] = useState(valorAluguel);
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const total = valorAluguel + parseFloat(valorIPTU || '0') + parseFloat(valorCondominio || '0');
    setValorTotal(total);
  }, [valorAluguel, valorIPTU, valorCondominio]);

  useEffect(() => {
    if (dataInicio && duracaoMeses) {
      const inicio = new Date(dataInicio);
      inicio.setMonth(inicio.getMonth() + parseInt(duracaoMeses));
      setDataFim(inicio.toLocaleDateString('pt-BR'));
    }
  }, [dataInicio, duracaoMeses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      valor_aluguel: valorAluguel,
      valor_iptu: parseFloat(valorIPTU),
      valor_condominio: parseFloat(valorCondominio),
      dia_vencimento: parseInt(diaVencimento),
      indice_reajuste: indiceReajuste as any,
      data_inicio: new Date(dataInicio),
      duracao_meses: parseInt(duracaoMeses),
      observacoes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Valores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="valor_aluguel">Valor do Aluguel</Label>
            <Input
              id="valor_aluguel"
              value={`R$ ${valorAluguel.toFixed(2)}`}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_iptu">Valor IPTU Mensal</Label>
              <Input
                id="valor_iptu"
                type="number"
                step="0.01"
                value={valorIPTU}
                onChange={(e) => setValorIPTU(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="valor_condominio">Valor Condomínio Mensal</Label>
              <Input
                id="valor_condominio"
                type="number"
                step="0.01"
                value={valorCondominio}
                onChange={(e) => setValorCondominio(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <p className="text-sm font-medium">Resumo Financeiro</p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Aluguel:</span>
                <span>R$ {valorAluguel.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>IPTU:</span>
                <span>R$ {parseFloat(valorIPTU).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Condomínio:</span>
                <span>R$ {parseFloat(valorCondominio).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total:</span>
                <span>R$ {valorTotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Valor total mensal: R$ {valorTotal.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Condições do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dia_vencimento">Dia de Vencimento (1-31) *</Label>
            <Input
              id="dia_vencimento"
              type="number"
              min="1"
              max="31"
              value={diaVencimento}
              onChange={(e) => setDiaVencimento(e.target.value)}
            />
            {(parseInt(diaVencimento) < 1 || parseInt(diaVencimento) > 31) && (
              <p className="text-sm text-destructive">Dia deve ser entre 1 e 31</p>
            )}
          </div>

          <div>
            <Label htmlFor="indice_reajuste">Índice de Reajuste *</Label>
            <Select value={indiceReajuste} onValueChange={setIndiceReajuste}>
              <SelectTrigger id="indice_reajuste">
                <SelectValue placeholder="Selecione o índice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IGPM">IGPM</SelectItem>
                <SelectItem value="IPCA">IPCA</SelectItem>
                <SelectItem value="INPC">INPC</SelectItem>
                <SelectItem value="Nenhum">Nenhum</SelectItem>
              </SelectContent>
            </Select>
            {!indiceReajuste && (
              <p className="text-sm text-muted-foreground">Índice de reajuste é obrigatório</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data Início *</Label>
              <Input
                id="data_inicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              {dataInicio && new Date(dataInicio) < new Date() && (
                <p className="text-sm text-destructive">Data de início não pode ser no passado</p>
              )}
            </div>

            <div>
              <Label htmlFor="duracao_meses">Duração (meses) *</Label>
              <Input
                id="duracao_meses"
                type="number"
                min="6"
                value={duracaoMeses}
                onChange={(e) => setDuracaoMeses(e.target.value)}
              />
              {parseInt(duracaoMeses) < 6 && (
                <p className="text-sm text-destructive">Mínimo 6 meses</p>
              )}
            </div>
          </div>

          {dataFim && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">Data Fim:</span>{' '}
                {dataFim} ({duracaoMeses} meses)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Período: {new Date(dataInicio).toLocaleDateString('pt-BR')} até {dataFim}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Cláusulas especiais, condições adicionais, etc."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Continuar
      </Button>
    </form>
  );
}
