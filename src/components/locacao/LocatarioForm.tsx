'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { locatarioFormSchema, type LocatarioFormData } from '@/lib/validations/locacao-forms';

interface LocatarioFormProps {
  onSubmit: (data: LocatarioFormData) => void;
  defaultValues?: Partial<LocatarioFormData>;
}

export function LocatarioForm({ onSubmit, defaultValues }: LocatarioFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(locatarioFormSchema),
    defaultValues: defaultValues || { tipo: 'novo' },
  });

  const tipo = watch('tipo');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Locatário</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={tipo}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="novo" id="novo" {...register('tipo')} />
              <Label htmlFor="novo">Novo Locatário</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existente" id="existente" {...register('tipo')} />
              <Label htmlFor="existente">Locatário Existente</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {tipo === 'novo' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Locatário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input id="nome" {...register('dados.nome')} />
              {errors.dados && 'nome' in errors.dados && errors.dados.nome && (
                <p className="text-sm text-destructive">{(errors.dados.nome as any)?.message as string}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cpf_cnpj">CPF/CNPJ *</Label>
              <Input id="cpf_cnpj" {...register('dados.cpf_cnpj')} />
              {errors.dados && 'cpf_cnpj' in errors.dados && errors.dados.cpf_cnpj && (
                <p className="text-sm text-destructive">{(errors.dados.cpf_cnpj as any)?.message as string}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('dados.email')} />
                {errors.dados && 'email' in errors.dados && errors.dados.email && (
                  <p className="text-sm text-destructive">{(errors.dados.email as any)?.message as string}</p>
                )}
              </div>

              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input id="telefone" {...register('dados.telefone')} />
                {errors.dados && 'telefone' in errors.dados && errors.dados.telefone && (
                  <p className="text-sm text-destructive">{(errors.dados.telefone as any)?.message as string}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profissao">Profissão</Label>
                <Input id="profissao" {...register('dados.profissao')} />
              </div>

              <div>
                <Label htmlFor="renda_mensal">Renda Mensal</Label>
                <Input id="renda_mensal" type="number" {...register('dados.renda_mensal', { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Endereço</h4>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="logradouro">Logradouro *</Label>
                  <Input id="logradouro" {...register('dados.endereco.logradouro')} />
                </div>

                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input id="numero" {...register('dados.endereco.numero')} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input id="bairro" {...register('dados.endereco.bairro')} />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input id="cidade" {...register('dados.endereco.cidade')} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="uf">UF *</Label>
                    <Input id="uf" maxLength={2} {...register('dados.endereco.uf')} />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP *</Label>
                    <Input id="cep" {...register('dados.endereco.cep')} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="documentos">Documentos</Label>
              <Input id="documentos" type="file" aria-label="Adicionar documento" multiple />
              <p className="text-sm text-muted-foreground mt-1">
                Pelo menos 1 documento é obrigatório (RG, CPF, Comprovante de Renda)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {tipo === 'existente' && (
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Locatário</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Buscar por nome ou CPF" />
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full">
        Continuar
      </Button>
    </form>
  );
}
