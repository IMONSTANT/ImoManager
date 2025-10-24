/**
 * Template D6: AUTORIZAÇÃO DE DÉBITO AUTOMÁTICO
 */

export const D6_AUTORIZACAO_DEBITO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Autorização de Débito Automático</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 30px;
      text-transform: uppercase;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }

    td {
      padding: 10px;
      border: 1px solid #333;
    }

    .label {
      font-weight: bold;
      width: 35%;
      background-color: #f5f5f5;
    }

    .assinatura {
      margin-top: 60px;
      text-align: center;
    }

    .linha-assinatura {
      border-top: 1px solid #000;
      width: 400px;
      margin: 0 auto 5px;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <h1>Autorização de Débito Automático</h1>

  <p>
    Eu, <strong>{{locatario.nome}}</strong>, portador(a) do CPF nº {{formatCPF locatario.cpf}},
    AUTORIZO o débito automático mensal do valor do aluguel e encargos referente ao contrato de
    locação nº <strong>{{contrato.numero}}</strong>, do imóvel situado à
    <strong>{{imovel.endereco_completo}}</strong>.
  </p>

  <h2 style="margin-top: 30px; font-size: 13pt;">Dados Bancários:</h2>

  <table>
    <tr>
      <td class="label">Banco:</td>
      <td>{{conta.banco_codigo}} - {{conta.banco_nome}}</td>
    </tr>
    <tr>
      <td class="label">Agência:</td>
      <td>{{conta.agencia}}{{#if conta.agencia_dv}}-{{conta.agencia_dv}}{{/if}}</td>
    </tr>
    <tr>
      <td class="label">Conta Corrente:</td>
      <td>{{conta.numero}}{{#if conta.numero_dv}}-{{conta.numero_dv}}{{/if}}</td>
    </tr>
    <tr>
      <td class="label">Tipo de Conta:</td>
      <td>{{conta.tipo}}</td>
    </tr>
    <tr>
      <td class="label">Titular:</td>
      <td>{{conta.titular}}</td>
    </tr>
    <tr>
      <td class="label">CPF do Titular:</td>
      <td>{{formatCPF conta.cpf_titular}}</td>
    </tr>
  </table>

  <h2 style="margin-top: 30px; font-size: 13pt;">Informações do Débito:</h2>

  <table>
    <tr>
      <td class="label">Valor Mensal:</td>
      <td>{{formatMoney contrato.valor}}</td>
    </tr>
    <tr>
      <td class="label">Dia do Débito:</td>
      <td>Todo dia {{contrato.dia_vencimento}} de cada mês</td>
    </tr>
    <tr>
      <td class="label">Data de Início:</td>
      <td>{{formatDate debito.data_inicio}}</td>
    </tr>
    {{#if debito.data_fim}}
    <tr>
      <td class="label">Data de Término:</td>
      <td>{{formatDate debito.data_fim}}</td>
    </tr>
    {{/if}}
  </table>

  <p style="margin-top: 30px;">
    Declaro estar ciente de que:
  </p>

  <ul style="margin-left: 30px; line-height: 1.8;">
    <li>O débito será efetuado mensalmente na data especificada;</li>
    <li>Em caso de saldo insuficiente, poderei estar sujeito a multa e juros conforme contrato;</li>
    <li>Esta autorização permanecerá válida até o término do contrato de locação ou até comunicação por escrito de cancelamento com 30 dias de antecedência;</li>
    <li>É de minha responsabilidade manter saldo suficiente na conta para o débito.</li>
  </ul>

  <p style="margin-top: 30px;">
    {{locatario.cidade}}, {{formatDate data_emissao}}.
  </p>

  <div class="assinatura">
    <div class="linha-assinatura">
      {{locatario.nome}}
    </div>
    <p><strong>Locatário(a)</strong></p>
    <p>CPF: {{formatCPF locatario.cpf}}</p>
  </div>

</body>
</html>
`;

export const D6_VARIAVEIS_ESPERADAS = [
  'locatario.nome',
  'locatario.cpf',
  'contrato.numero',
  'contrato.valor',
  'contrato.dia_vencimento',
  'imovel.endereco_completo',
  'conta.banco_codigo',
  'conta.banco_nome',
  'conta.agencia',
  'conta.numero',
  'conta.titular',
  'conta.cpf_titular',
  'data_emissao'
];
