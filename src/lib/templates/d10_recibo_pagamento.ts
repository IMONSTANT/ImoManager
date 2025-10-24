/**
 * Template D10: RECIBO DE PAGAMENTO
 */

export const D10_RECIBO_PAGAMENTO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recibo de Pagamento</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .numero-recibo {
      text-align: center;
      font-size: 12pt;
      margin-bottom: 30px;
      color: #666;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
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

    .valor-principal {
      font-size: 16pt;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      background-color: #e8f4f8;
      border: 2px solid #0066cc;
      margin: 20px 0;
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

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px dashed #999;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>RECIBO DE PAGAMENTO</h1>
  <p class="numero-recibo">Nº {{recibo_numero}}</p>

  <div class="valor-principal">
    {{formatMoney pagamento.valor}}
  </div>

  <p style="text-align: center; font-size: 12pt; margin: 20px 0;">
    <strong>Recebi de:</strong> {{locatario.nome}}<br>
    CPF: {{formatCPF locatario.cpf}}
  </p>

  <h2 style="margin-top: 30px; font-size: 12pt; background-color: #f0f0f0; padding: 8px;">
    Dados do Pagamento:
  </h2>

  <table>
    <tr>
      <td class="label">Referente a:</td>
      <td>{{pagamento.referente}}</td>
    </tr>
    <tr>
      <td class="label">Contrato:</td>
      <td>{{contrato.numero}}</td>
    </tr>
    <tr>
      <td class="label">Imóvel:</td>
      <td>{{imovel.endereco_completo}}</td>
    </tr>
    <tr>
      <td class="label">Competência:</td>
      <td>{{pagamento.competencia}}</td>
    </tr>
    <tr>
      <td class="label">Data do Pagamento:</td>
      <td>{{formatDate pagamento.data}}</td>
    </tr>
    <tr>
      <td class="label">Forma de Pagamento:</td>
      <td>{{pagamento.forma_pagamento}}</td>
    </tr>
    {{#if pagamento.numero_transacao}}
    <tr>
      <td class="label">Número da Transação:</td>
      <td>{{pagamento.numero_transacao}}</td>
    </tr>
    {{/if}}
  </table>

  <h2 style="margin-top: 30px; font-size: 12pt; background-color: #f0f0f0; padding: 8px;">
    Discriminação dos Valores:
  </h2>

  <table>
    <tr>
      <td class="label">Valor do Aluguel:</td>
      <td>{{formatMoney pagamento.principal}}</td>
    </tr>
    {{#if pagamento.condominio}}
    <tr>
      <td class="label">Condomínio:</td>
      <td>{{formatMoney pagamento.condominio}}</td>
    </tr>
    {{/if}}
    {{#if pagamento.iptu}}
    <tr>
      <td class="label">IPTU:</td>
      <td>{{formatMoney pagamento.iptu}}</td>
    </tr>
    {{/if}}
    {{#if pagamento.multa}}
    <tr>
      <td class="label">Multa:</td>
      <td>{{formatMoney pagamento.multa}}</td>
    </tr>
    {{/if}}
    {{#if pagamento.juros}}
    <tr>
      <td class="label">Juros:</td>
      <td>{{formatMoney pagamento.juros}}</td>
    </tr>
    {{/if}}
    {{#if pagamento.correcao}}
    <tr>
      <td class="label">Correção Monetária:</td>
      <td>{{formatMoney pagamento.correcao}}</td>
    </tr>
    {{/if}}
    {{#if pagamento.desconto}}
    <tr>
      <td class="label">Desconto:</td>
      <td>({{formatMoney pagamento.desconto}})</td>
    </tr>
    {{/if}}
    <tr style="font-weight: bold; font-size: 12pt; background-color: #e8f4f8;">
      <td class="label">VALOR TOTAL PAGO:</td>
      <td>{{formatMoney pagamento.valor}}</td>
    </tr>
  </table>

  {{#if observacoes}}
  <h2 style="margin-top: 30px; font-size: 12pt; background-color: #f0f0f0; padding: 8px;">
    Observações:
  </h2>
  <div style="border: 1px solid #333; padding: 15px; min-height: 50px;">
    {{observacoes}}
  </div>
  {{/if}}

  <p style="margin-top: 30px; text-align: justify;">
    E, por ser verdade, firmo o presente recibo para que produza os seus efeitos legais,
    dando plena, geral e irrevogável quitação do valor acima especificado.
  </p>

  <p style="margin-top: 20px;">
    {{locador.cidade}}, {{formatDate data_emissao}}.
  </p>

  <div class="assinatura">
    <div class="linha-assinatura">
      {{locador.nome}}
    </div>
    <p><strong>LOCADOR / RECEBEDOR</strong></p>
    <p>{{#if locador.cpf}}CPF: {{formatCPF locador.cpf}}{{else}}CNPJ: {{formatCNPJ locador.cnpj}}{{/if}}</p>
  </div>

  <div class="footer">
    <p>Este documento foi gerado eletronicamente e é válido sem assinatura digital.</p>
    <p>Data de emissão: {{formatDate data_emissao}} | Recibo nº {{recibo_numero}}</p>
  </div>

  <!-- Segunda via (opcional - para destaque) -->
  <div style="page-break-before: always; border-top: 2px dashed #999; padding-top: 40px; margin-top: 40px;">
    <p style="text-align: center; font-size: 10pt; color: #999; margin-bottom: 20px;">
      SEGUNDA VIA - LOCATÁRIO
    </p>

    <h1>RECIBO DE PAGAMENTO</h1>
    <p class="numero-recibo">Nº {{recibo_numero}}</p>

    <div class="valor-principal">
      {{formatMoney pagamento.valor}}
    </div>

    <p style="text-align: center; margin: 20px 0;">
      Pagamento referente a: <strong>{{pagamento.referente}}</strong><br>
      Competência: <strong>{{pagamento.competencia}}</strong><br>
      Data: <strong>{{formatDate pagamento.data}}</strong><br>
      Forma: <strong>{{pagamento.forma_pagamento}}</strong>
    </p>

    <p style="text-align: center; margin-top: 40px; font-size: 10pt;">
      {{locador.nome}}<br>
      {{#if locador.cpf}}CPF: {{formatCPF locador.cpf}}{{else}}CNPJ: {{formatCNPJ locador.cnpj}}{{/if}}
    </p>
  </div>

</body>
</html>
`;

export const D10_VARIAVEIS_ESPERADAS = [
  'recibo_numero',
  'locatario.nome',
  'locatario.cpf',
  'locador.nome',
  'contrato.numero',
  'imovel.endereco_completo',
  'pagamento.valor',
  'pagamento.data',
  'pagamento.forma_pagamento',
  'pagamento.referente',
  'pagamento.principal',
  'data_emissao'
];
