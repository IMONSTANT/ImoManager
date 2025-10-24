/**
 * Template D5: TERMO DE VISTORIA DE SAÍDA
 */

export const D5_TERMO_VISTORIA_SAIDA = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termo de Vistoria de Saída</title>
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

    .pendencia {
      background-color: #fff3cd;
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
  <h1>Termo de Vistoria de Saída</h1>

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
    <tr>
      <th>Data de Entrega:</th>
      <td>{{formatDate data_entrega}}</td>
    </tr>
  </table>

  <h2>Estado do Imóvel na Entrega</h2>

  {{#each ambientes}}
  <h3 style="font-size: 11pt; margin-top: 15px; margin-bottom: 5px;">{{nome}}</h3>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="width: 20%;">Estado</th>
        <th>Pendências/Danos</th>
      </tr>
    </thead>
    <tbody>
      {{#each itens}}
      <tr {{#if tem_pendencia}}class="pendencia"{{/if}}>
        <td>{{descricao}}</td>
        <td>{{estado}}</td>
        <td class="obs">{{#if observacao}}{{observacao}}{{/if}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  {{/each}}

  {{#if pendencias}}
  <h2>Pendências e Reparos Necessários</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Descrição</th>
        <th style="width: 25%;">Valor Estimado</th>
        <th>Responsável</th>
      </tr>
    </thead>
    <tbody>
      {{#each pendencias}}
      <tr>
        <td>{{descricao}}</td>
        <td>{{formatMoney valor_estimado}}</td>
        <td>{{responsavel}}</td>
      </tr>
      {{/each}}
      <tr style="font-weight: bold; background-color: #f0f0f0;">
        <td>TOTAL:</td>
        <td>{{formatMoney total_pendencias}}</td>
        <td></td>
      </tr>
    </tbody>
  </table>
  {{/if}}

  <h2>Chaves Devolvidas</h2>
  <table>
    <tr>
      <th style="width: 40%;">Tipo de Chave</th>
      <th>Quantidade Devolvida</th>
      <th>Quantidade Original</th>
    </tr>
    {{#each chaves}}
    <tr {{#if faltante}}class="pendencia"{{/if}}>
      <td>{{tipo}}</td>
      <td>{{quantidade_devolvida}}</td>
      <td>{{quantidade_original}}</td>
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
    Declaro que vistoriei o imóvel e o recebi de volta nas condições descritas acima.
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

export const D5_VARIAVEIS_ESPERADAS = [
  'contrato.numero',
  'imovel.endereco',
  'locatarios',
  'data_vistoria',
  'data_entrega',
  'ambientes',
  'chaves'
];
