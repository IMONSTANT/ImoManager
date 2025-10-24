/**
 * BAIXA MANUAL DIALOG COMPONENT
 *
 * Modal para realizar baixa manual de parcela
 * Inclui: formulário, validações, upload de comprovante, breakdown de valores
 */

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { baixaManualSchema, type BaixaManualFormData } from '@/lib/validations/financeiro'
import { useBaixaManual } from '@/hooks/use-parcelas'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'

interface BaixaManualDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parcela: {
    id: number
    numero_parcela: number
    competencia: string
    valor_total: number
    valor_base: number
    valor_multa: number
    valor_juros: number
  } | null
}

export function BaixaManualDialog({
  open,
  onOpenChange,
  parcela,
}: BaixaManualDialogProps) {
  const [comprovante, setComprovante] = useState<File | null>(null)
  const baixaManualMutation = useBaixaManual()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BaixaManualFormData>({
    resolver: zodResolver(baixaManualSchema),
    defaultValues: {
      parcela_id: parcela?.id,
      data_pagamento: new Date(),
      valor_pago: parcela?.valor_total || 0,
    },
  })

  const valorPago = watch('valor_pago')

  // Calcular breakdown (simulação)
  const calcularBreakdown = () => {
    if (!parcela || !valorPago) return null

    let saldo = valorPago
    let jurosRestante = parcela.valor_juros
    let multaRestante = parcela.valor_multa
    let principalRestante = parcela.valor_base

    // Ordem: juros → multa → principal
    const abateJuros = Math.min(saldo, jurosRestante)
    saldo -= abateJuros
    jurosRestante -= abateJuros

    const abateMulta = Math.min(saldo, multaRestante)
    saldo -= abateMulta
    multaRestante -= abateMulta

    const abatePrincipal = Math.min(saldo, principalRestante)
    principalRestante -= abatePrincipal

    const saldoDevedor = jurosRestante + multaRestante + principalRestante

    return {
      abate_juros: abateJuros,
      abate_multa: abateMulta,
      abate_principal: abatePrincipal,
      saldo_devedor: saldoDevedor,
      quitado: saldoDevedor === 0,
    }
  }

  const breakdown = calcularBreakdown()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setComprovante(file)
      setValue('comprovante', file)
    }
  }

  const onSubmit = async (data: BaixaManualFormData) => {
    try {
      await baixaManualMutation.mutateAsync({
        ...data,
        comprovante: comprovante || undefined,
      })

      toast.success('Baixa manual realizada com sucesso')
      reset()
      setComprovante(null)
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao realizar baixa manual')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Baixa Manual de Parcela</DialogTitle>
          <DialogDescription>
            {parcela && (
              <>
                Parcela {parcela.numero_parcela} - Competência{' '}
                {parcela.competencia}
                <br />
                Valor Total Devido: {formatCurrency(parcela.valor_total)}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Data de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="data_pagamento">Data de Pagamento *</Label>
            <Input
              id="data_pagamento"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register('data_pagamento', {
                setValueAs: (v) => (v ? new Date(v) : undefined),
              })}
            />
            {errors.data_pagamento && (
              <p className="text-sm text-red-600">
                {errors.data_pagamento.message}
              </p>
            )}
          </div>

          {/* Valor Pago */}
          <div className="space-y-2">
            <Label htmlFor="valor_pago">Valor Pago *</Label>
            <Input
              id="valor_pago"
              type="number"
              step="0.01"
              min="0.01"
              max={parcela?.valor_total}
              {...register('valor_pago', {
                setValueAs: (v) => (v ? parseFloat(v) : 0),
              })}
            />
            {errors.valor_pago && (
              <p className="text-sm text-red-600">{errors.valor_pago.message}</p>
            )}
          </div>

          {/* Forma de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="forma_pagamento">Forma de Pagamento *</Label>
            <Select
              onValueChange={(value) =>
                setValue('forma_pagamento', value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
              </SelectContent>
            </Select>
            {errors.forma_pagamento && (
              <p className="text-sm text-red-600">
                {errors.forma_pagamento.message}
              </p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              rows={3}
              placeholder="Informações adicionais sobre o pagamento..."
              {...register('observacoes')}
            />
            {errors.observacoes && (
              <p className="text-sm text-red-600">
                {errors.observacoes.message}
              </p>
            )}
          </div>

          {/* Upload de Comprovante */}
          <div className="space-y-2">
            <Label htmlFor="comprovante">
              Comprovante de Pagamento
              {valorPago >= 1000 && ' *'}
            </Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById('comprovante-input')?.click()
                }
              >
                <Upload className="mr-2 h-4 w-4" />
                {comprovante ? 'Alterar Arquivo' : 'Selecionar Arquivo'}
              </Button>
              {comprovante && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {comprovante.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setComprovante(null)
                      setValue('comprovante', undefined)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <input
              id="comprovante-input"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.comprovante && (
              <p className="text-sm text-red-600">
                {errors.comprovante.message}
              </p>
            )}
            {valorPago >= 1000 && (
              <p className="text-xs text-muted-foreground">
                Comprovante obrigatório para valores acima de R$ 1.000,00
              </p>
            )}
          </div>

          {/* Breakdown de Valores */}
          {breakdown && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-3 text-sm font-semibold">
                Distribuição do Pagamento
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Abatimento de Juros:</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.abate_juros)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Abatimento de Multa:</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.abate_multa)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Abatimento do Principal:</span>
                  <span className="font-medium">
                    {formatCurrency(breakdown.abate_principal)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Saldo Devedor:</span>
                    <span
                      className={
                        breakdown.quitado ? 'text-green-600' : 'text-orange-600'
                      }
                    >
                      {formatCurrency(breakdown.saldo_devedor)}
                    </span>
                  </div>
                  {breakdown.quitado && (
                    <p className="mt-1 text-xs text-green-600">
                      Parcela será quitada integralmente
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={baixaManualMutation.isPending}
            >
              {baixaManualMutation.isPending
                ? 'Processando...'
                : 'Confirmar Baixa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
