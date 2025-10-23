import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContratoForm } from '@/components/imobiliaria/forms/contrato-form'

export default function NovoContratoPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Novo Contrato de Locação</h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados para criar um novo contrato de locação
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Contrato</CardTitle>
          <CardDescription>
            Preencha todas as informações necessárias para o contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContratoForm />
        </CardContent>
      </Card>
    </div>
  )
}
