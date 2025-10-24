/**
 * Template D7: TERMO DE ENTREGA DE CHAVES
 */

export const D7_TERMO_ENTREGA_CHAVES = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termo de Entrega de Chaves</title>
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

    th, td {
      padding: 10px;
      border: 1px solid #333;
      text-align: left;
    }

    th {
      background-color: #f0f0f0;
      font-weight: bold;
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

    .box {
      border: 2px solid #333;
      padding: 15px;
      margin: 20px 0;
      background-color: #f9f9f9;
    }
  </style>
</head>
<body>
  <h1>Termo de Entrega de Chaves</h1>

  <div class="box">
    <p style="margin: 0;"><strong>Tipo de Entrega:</strong> {{tipo_entrega}}</p>
  </div>

  <p>
    Eu, <strong>{{locatario.nome}}</strong>, portador(a) do CPF nº {{formatCPF locatario.cpf}},
    {{#if tipo_entrega_definitiva}}
    DECLARO que estou devolvendo DEFINITIVAMENTE as chaves do imóvel
    {{else}}
    DECLARO que estou entregando PROVISORIAMENTE as chaves do imóvel
    {{/if}}
    situado à <strong>{{imovel.endereco.logradouro}}, {{imovel.endereco.numero}}{{#if imovel.endereco.complemento}}, {{imovel.endereco.complemento}}{{/if}},
    {{imovel.endereco.bairro}}, {{imovel.endereco.cidade}}/{{imovel.endereco.estado}}</strong>,
    objeto do contrato de locação nº <strong>{{contrato.numero}}</strong>.
  </p>

  <h2 style="margin-top: 30px; font-size: 13pt;">Relação de Chaves Entregues:</h2>

  <table>
    <thead>
      <tr>
        <th style="width: 60%;">Tipo de Chave</th>
        <th style="width: 40%;">Quantidade</th>
      </tr>
    </thead>
    <tbody>
      {{#each chaves}}
      <tr>
        <td>{{tipo}}</td>
        <td style="text-align: center;">{{quantidade}}</td>
      </tr>
      {{/each}}
      <tr style="font-weight: bold; background-color: #f0f0f0;">
        <td>TOTAL DE CHAVES:</td>
        <td style="text-align: center;">{{total_chaves}}</td>
      </tr>
    </tbody>
  </table>

  {{#if tipo_entrega_definitiva}}
  <p>
    Declaro que o imóvel foi desocupado completamente e que não possuo mais nenhuma chave ou
    dispositivo de acesso ao mesmo.
  </p>

  <p>
    Estou ciente de que a entrega das chaves não me exonera das responsabilidades assumidas
    no contrato de locação até a efetiva assinatura do Termo de Rescisão e quitação de
    todas as pendências.
  </p>
  {{else}}
  <p>
    Declaro que esta entrega é PROVISÓRIA para fins de vistoria e que aguardo o retorno
    das chaves ou a confirmação da entrega definitiva após vistoria final.
  </p>

  <p>
    <strong>Prazo para devolução das chaves:</strong> {{formatDate data_prevista_devolucao}}
  </p>
  {{/if}}

  {{#if observacoes}}
  <h2 style="margin-top: 30px; font-size: 13pt;">Observações:</h2>
  <div style="border: 1px solid #333; padding: 15px; min-height: 60px;">
    {{observacoes}}
  </div>
  {{/if}}

  {{#if pendencias}}
  <div class="box" style="background-color: #fff3cd; border-color: #856404;">
    <p style="margin: 0; font-weight: bold;">PENDÊNCIAS:</p>
    <ul style="margin: 10px 0 0 20px;">
      {{#each pendencias}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/if}}

  <p style="margin-top: 30px;">
    {{imovel.endereco.cidade}}, {{formatDate data_entrega}}.
  </p>

  <div class="assinatura">
    <div class="linha-assinatura">
      {{locatario.nome}}
    </div>
    <p><strong>Locatário(a) - Entregou as chaves</strong></p>
  </div>

  <div class="assinatura">
    <div class="linha-assinatura">
      {{locador.nome}}
    </div>
    <p><strong>Locador(a) - Recebeu as chaves</strong></p>
  </div>

</body>
</html>
`;

export const D7_VARIAVEIS_ESPERADAS = [
  'tipo_entrega',
  'locatario.nome',
  'locatario.cpf',
  'locador.nome',
  'contrato.numero',
  'imovel.endereco',
  'chaves',
  'data_entrega'
];
