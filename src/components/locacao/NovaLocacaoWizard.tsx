'use client';

import { useCreateLocacao } from '@/hooks/use-create-locacao';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { ImovelSelector } from './ImovelSelector';
import { LocatarioForm } from './LocatarioForm';
import { GarantiaSelector } from './GarantiaSelector';
import { DadosFinanceirosForm } from './DadosFinanceirosForm';
import { ContratoPreview } from './ContratoPreview';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const STEPS = [
  { id: 0, title: 'Seleção de Imóvel', description: 'Escolha o imóvel para locação' },
  { id: 1, title: 'Dados do Locatário', description: 'Informações do locatário' },
  { id: 2, title: 'Escolha de Garantia', description: 'Caução ou fiador' },
  { id: 3, title: 'Dados Financeiros', description: 'Valores e prazos' },
  { id: 4, title: 'Preview e Confirmação', description: 'Revise e confirme' },
];

interface NovaLocacaoWizardProps {
  onSaveDraft?: (data: any) => void;
  onCancel?: () => void;
  onCreate?: (contrato: any) => void;
}

export function NovaLocacaoWizard({ onSaveDraft, onCancel, onCreate }: NovaLocacaoWizardProps) {
  const router = useRouter();
  const {
    currentStep,
    imovelSelecionado,
    locatario,
    garantia,
    dadosFinanceiros,
    nextStep,
    prevStep,
    goToStep,
    setImovelSelecionado,
    setLocatario,
    setGarantia,
    setDadosFinanceiros,
    isCurrentStepValid,
    progress,
    createContrato,
    isLoading,
    isSuccess,
  } = useCreateLocacao();

  const handleSaveDraft = () => {
    const draftData = {
      imovelSelecionado,
      locatario,
      garantia,
      dadosFinanceiros,
      currentStep,
    };
    onSaveDraft?.(draftData);
    toast.success('Rascunho salvo com sucesso!');
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dashboard');
    }
  };

  const handleConfirm = async () => {
    try {
      const contrato = await createContrato();
      toast.success('Contrato criado com sucesso!');
      onCreate?.(contrato);
      router.push(`/contratos/${contrato.id}`);
    } catch (error) {
      toast.error('Erro ao criar contrato. Tente novamente.');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Nova Locação</h1>
        <p className="text-muted-foreground">Preencha os dados para criar um novo contrato de locação</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} aria-label="Progresso do cadastro" role="progressbar" aria-valuenow={progress} />
        <p className="text-sm text-muted-foreground text-center">
          Passo {currentStep + 1} de {STEPS.length}
        </p>
      </div>

      {/* Steps Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2 flex-1"
                data-testid={`step-${step.id}`}
              >
                <button
                  onClick={() => index <= currentStep && goToStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    index < currentStep
                      ? 'border-primary bg-primary text-primary-foreground'
                      : index === currentStep
                      ? 'border-primary bg-background active'
                      : 'border-muted bg-background text-muted-foreground'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" fill={index === currentStep ? 'currentColor' : 'none'} />
                  )}
                </button>
                <div className="text-center hidden md:block">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`hidden md:block absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                      index < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                    style={{ width: 'calc(100% / 5)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[500px]">
        {currentStep === 0 && (
          <ImovelSelector
            onSelect={(imovel) => {
              setImovelSelecionado(imovel);
            }}
            selectedId={imovelSelecionado?.id}
          />
        )}

        {currentStep === 1 && <LocatarioForm onSubmit={(data) => setLocatario(data)} />}

        {currentStep === 2 && imovelSelecionado && (
          <GarantiaSelector
            onSubmit={(data) => setGarantia(data)}
            valorAluguel={imovelSelecionado.valor_aluguel}
          />
        )}

        {currentStep === 3 && imovelSelecionado && (
          <DadosFinanceirosForm
            onSubmit={(data) => setDadosFinanceiros(data)}
            valorAluguel={imovelSelecionado.valor_aluguel}
          />
        )}

        {currentStep === 4 && (
          <ContratoPreview
            dados={{ imovelSelecionado, locatario, garantia, dadosFinanceiros, currentStep }}
            onConfirm={handleConfirm}
            onEdit={(step) => (step !== undefined ? goToStep(step) : prevStep())}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep < 4 && (
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>

          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}

          <div className="flex-1" />

          <Button variant="outline" onClick={handleSaveDraft}>
            Salvar Rascunho
          </Button>

          <Button onClick={nextStep} disabled={!isCurrentStepValid()}>
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
