import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmpresaForm } from '@/components/imobiliaria/forms/empresa-form'

export default function NovaEmpresaPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Nova Empresa Cliente</h2>
        <p className="text-muted-foreground mt-1">
          Preencha os dados para cadastrar uma nova empresa cliente
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Preencha todas as informações necessárias da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmpresaForm />
        </CardContent>
      </Card>
    </div>
  )
}
