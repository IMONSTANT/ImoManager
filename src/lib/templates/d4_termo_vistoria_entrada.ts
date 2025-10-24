/**
 * Template D4: TERMO DE VISTORIA DE ENTRADA
 */

export const D4_TERMO_VISTORIA_ENTRADA = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termo de Vistoria de Entrada</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    h2 {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 20px;
      margin-bottom: 10px;
      background-color: #f0f0f0;
      padding: 5px 10px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }

    th, td {
      padding: 8px;
      border: 1px solid #ccc;
      text-align: left;
    }

    th {
      background-color: #e0e0e0;
      font-weight: bold;
    }

    .obs {
      min-height: 40px;
    }

    .assinatura {
      margin-top: 40px;
      display: inline-block;
      width: 45%;
      text-align: center;
    }

    .linha-assinatura {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <h1>Termo de Vistoria de Entrada</h1>

  <table>
    <tr>
      <th style="width: 30%;">Contrato:</th>
      <td>{{contrato.numero}}</td>
    </tr>
    <tr>
      <th>Imóvel:</th>
      <td>{{imovel.endereco.logradouro}}, {{imovel.endereco.numero}}{{#if imovel.endereco.complemento}}, {{imovel.endereco.complemento}}{{/if}} - {{imovel.endereco.bairro}}, {{imovel.endereco.cidade}}/{{imovel.endereco.estado}}</td>
    </tr>
    <tr>
      <th>Locatário(s):</th>
      <td>{{#each locatarios}}{{nome}}{{#unless @last}}, {{/unless}}{{/each}}</td>
    </tr>
    <tr>
      <th>Data da Vistoria:</th>
      <td>{{formatDate data_vistoria}}</td>
    </tr>
  </table>

  <h2>Estado Geral do Imóvel</h2>

  {{#each ambientes}}
  <h3 style="font-size: 11pt; margin-top: 15px; margin-bottom: 5px;">{{nome}}</h3>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="width: 20%;">Estado</th>
        <th>Observações</th>
      </tr>
    </thead>
    <tbody>
      {{#each itens}}
      <tr>
        <td>{{descricao}}</td>
        <td>{{estado}}</td>
        <td class="obs">{{#if observacao}}{{observacao}}{{/if}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  {{/each}}

  {{#if instalacoes}}
  <h2>Instalações</h2>
  <table>
    <thead>
      <tr>
        <th>Instalação</th>
        <th style="width: 20%;">Estado</th>
        <th>Observações</th>
      </tr>
    </thead>
    <tbody>
      {{#each instalacoes}}
      <tr>
        <td>{{tipo}}</td>
        <td>{{estado}}</td>
        <td class="obs">{{#if observacao}}{{observacao}}{{/if}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  {{/if}}

  <h2>Chaves Entregues</h2>
  <table>
    <tr>
      <th style="width: 40%;">Tipo de Chave</th>
      <th>Quantidade</th>
    </tr>
    {{#each chaves}}
    <tr>
      <td>{{tipo}}</td>
      <td>{{quantidade}}</td>
    </tr>
    {{/each}}
  </table>

  {{#if observacoes_gerais}}
  <h2>Observações Gerais</h2>
  <div style="border: 1px solid #ccc; padding: 10px; min-height: 60px;">
    {{observacoes_gerais}}
  </div>
  {{/if}}

  <p style="margin-top: 30px;">
    Declaro que vistoriei o imóvel e o recebi nas condições descritas acima.
  </p>

  <div style="margin-top: 40px;">
    <div class="assinatura">
      <div class="linha-assinatura">Locador(a)</div>
    </div>
    <div class="assinatura" style="float: right;">
      <div class="linha-assinatura">Locatário(a)</div>
    </div>
  </div>

</body>
</html>
`;

export const D4_VARIAVEIS_ESPERADAS = [
  'contrato.numero',
  'imovel.endereco',
  'locatarios',
  'data_vistoria',
  'ambientes',
  'chaves'
];
