'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { GarantiaFormData } from '@/lib/validations/locacao-forms';

interface GarantiaSelectorProps {
  onSubmit: (data: GarantiaFormData) => void;
  valorAluguel: number;
}

export function GarantiaSelector({ onSubmit, valorAluguel }: GarantiaSelectorProps) {
  const [tipo, setTipo] = useState<'caucao' | 'fiador'>('caucao');
  const [valorCaucao, setValorCaucao] = useState('');
  const [fiador, setFiador] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    profissao: '',
    renda_mensal: '',
  });

  const sugestao = valorAluguel * 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === 'caucao') {
      onSubmit({
        tipo: 'caucao',
        valor: parseFloat(valorCaucao),
      });
    } else {
      onSubmit({
        tipo: 'fiador',
        fiador: {
          ...fiador,
          renda_mensal: parseFloat(fiador.renda_mensal),
          endereco: {
            logradouro: '',
            numero: '',
            bairro: '',
            cidade: '',
            uf: 'SP',
            cep: '',
          },
          documentos: [],
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Garantia</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="caucao" id="caucao" />
              <Label htmlFor="caucao">Caução</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fiador" id="fiador" />
              <Label htmlFor="fiador">Fiador</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {tipo === 'caucao' && (
        <Card>
          <CardHeader>
            <CardTitle>Valor da Caução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valor">Valor da Caução *</Label>
              <Input
                id="valor"
                type="number"
                value={valorCaucao}
                onChange={(e) => setValorCaucao(e.target.value)}
                placeholder={`Mínimo: R$ ${valorAluguel.toFixed(2)}`}
              />
              {parseFloat(valorCaucao) < valorAluguel && valorCaucao && (
                <p className="text-sm text-destructive">Valor mínimo: R$ {valorAluguel.toFixed(2)}</p>
              )}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Sugestão: R$ {sugestao.toFixed(2)}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValorCaucao(sugestao.toString())}
              >
                Aplicar Sugestão
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              A caução será devolvida ao final do contrato, deduzidos eventuais débitos.
            </p>
          </CardContent>
        </Card>
      )}

      {tipo === 'fiador' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Fiador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={fiador.nome}
                onChange={(e) => setFiador({ ...fiador, nome: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={fiador.cpf}
                onChange={(e) => setFiador({ ...fiador, cpf: e.target.value })}
              />
              {fiador.cpf && fiador.cpf.length > 0 && fiador.cpf.length < 11 && (
                <p className="text-sm text-destructive">CPF inválido</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={fiador.email}
                  onChange={(e) => setFiador({ ...fiador, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={fiador.telefone}
                  onChange={(e) => setFiador({ ...fiador, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profissao">Profissão *</Label>
                <Input
                  id="profissao"
                  value={fiador.profissao}
                  onChange={(e) => setFiador({ ...fiador, profissao: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="renda_mensal">Renda Mensal *</Label>
                <Input
                  id="renda_mensal"
                  type="number"
                  value={fiador.renda_mensal}
                  onChange={(e) => setFiador({ ...fiador, renda_mensal: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Endereço do Fiador</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input id="logradouro" />
                </div>
                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" />
                </div>
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" />
                </div>
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" />
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4">
              Mínimo 2 documentos (RG e comprovante de renda) são obrigatórios para o fiador.
            </p>

            <p className="text-sm text-muted-foreground">
              O fiador se compromete a responder solidariamente pelas obrigações do locatário.
            </p>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full">
        Continuar
      </Button>
    </form>
  );
}
