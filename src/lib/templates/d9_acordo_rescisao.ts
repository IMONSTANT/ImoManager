/**
 * Template D9: ACORDO DE RESCISÃO DE CONTRATO
 */

export const D9_ACORDO_RESCISAO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acordo de Rescisão</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 30px;
      text-transform: uppercase;
    }

    p {
      text-align: justify;
      margin-bottom: 15px;
    }

    .clausula {
      font-weight: bold;
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    td {
      padding: 8px;
      border: 1px solid #333;
    }

    .label {
      font-weight: bold;
      width: 40%;
      background-color: #f5f5f5;
    }

    .assinatura {
      margin-top: 50px;
      text-align: center;
    }

    .linha-assinatura {
      border-top: 1px solid #000;
      width: 350px;
      margin: 0 auto 5px;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <h1>ACORDO - Rescisão de Contrato de Locação</h1>

  <p class="clausula">1º) PARTES:</p>

  <p>
    <strong>{{locador.nome}}</strong>, {{locador.nacionalidade}}, {{locador.estado_civil}},
    {{locador.profissao}}, com escritório sito à {{locador.endereco_completo}}, como LOCADOR,
  </p>

  <p>
    e {{#each locatarios}}{{#if @first}}{{#if ../locatarios.[1]}}a Sra.{{else}}{{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{/if}}{{else}}{{#if @last}} e {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{else}}, {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{/if}}{{/if}}
    <strong>{{nome}}</strong>, {{nacionalidade}}, {{profissao}}, RG nº {{rg}}, CPF: {{formatCPF cpf}}{{#unless @last}};{{/unless}}{{/each}},
    como LOCATÁRIO{{#if locatarios.[1]}}S{{/if}}, têm justo e <strong>PACTUADO</strong> pelo presente termo
    a rescisão da locação do imóvel residencial sito à
    <strong>{{imovel.endereco.logradouro}}, {{imovel.endereco.numero}}{{#if imovel.endereco.complemento}}, {{imovel.endereco.complemento}}{{/if}},
    {{imovel.endereco.bairro}}, {{imovel.endereco.cidade}}/{{imovel.endereco.estado}}</strong>,
    de conformidade com o que segue:
  </p>

  <p class="clausula">2º) ENTREGA DO IMÓVEL:</p>

  <p>
    O(s) LOCATÁRIO(S) entregaram ao LOCADOR as chaves do imóvel acima referido, que está vazio e
    desocupado em {{formatDate data_entrega_imovel}}.
  </p>

  <p class="clausula">3º) RESPONSABILIDADES:</p>

  <p>
    O(s) LOCATÁRIO(S) são responsáveis por todo o consumo de energia elétrica (ENEL) e água/esgoto
    (CAGECE) do imóvel, enquanto estiver com a titularidade ou até a presente data.
  </p>

  <p class="clausula">4º) ACERTO FINANCEIRO:</p>

  <table>
    <tr>
      <td class="label">Valor da Caução Original:</td>
      <td>{{formatMoney acerto.caucao_original}}</td>
    </tr>
    {{#if acerto.multa_rescisao}}
    <tr>
      <td class="label">Multa de Rescisão:</td>
      <td>({{formatMoney acerto.multa_rescisao}})</td>
    </tr>
    {{/if}}
    {{#if acerto.reparos}}
    <tr>
      <td class="label">Reparos e Pinturas:</td>
      <td>({{formatMoney acerto.reparos}})</td>
    </tr>
    {{/if}}
    {{#if acerto.debitos_pendentes}}
    <tr>
      <td class="label">Débitos Pendentes:</td>
      <td>({{formatMoney acerto.debitos_pendentes}})</td>
    </tr>
    {{/if}}
    {{#if acerto.outras_deducoes}}
    <tr>
      <td class="label">Outras Deduções:</td>
      <td>({{formatMoney acerto.outras_deducoes}})</td>
    </tr>
    {{/if}}
    <tr style="font-weight: bold; background-color: #f0f0f0;">
      <td class="label">VALOR A SER {{#if acerto.valor_final_positivo}}DEVOLVIDO{{else}}PAGO{{/if}}:</td>
      <td>{{formatMoney acerto.valor_final}}</td>
    </tr>
  </table>

  {{#if acerto.forma_pagamento}}
  <p>
    <strong>Forma de pagamento:</strong> {{acerto.forma_pagamento}}
    {{#if acerto.data_pagamento}} até {{formatDate acerto.data_pagamento}}{{/if}}.
  </p>
  {{/if}}

  {{#if pendencias_listadas}}
  <p class="clausula">5º) PENDÊNCIAS ACORDADAS:</p>
  <ul style="margin-left: 30px;">
    {{#each pendencias_listadas}}
    <li>{{this}}</li>
    {{/each}}
  </ul>
  {{/if}}

  <p class="clausula">{{#if pendencias_listadas}}6º{{else}}5º{{/if}}) LIBERAÇÃO DO IMÓVEL:</p>

  <p>
    O LOCADOR fica desde já liberado pelo(s) LOCATÁRIO(S) a dar ao imóvel o uso e o destino que
    lhe aprouver em face da cessação do vínculo locatício.
  </p>

  <p class="clausula">{{#if pendencias_listadas}}7º{{else}}6º{{/if}}) QUITAÇÃO MÚTUA:</p>

  <p>
    As partes concordam que não há mais nada a requerer em qualquer tempo ou local, pois com este
    acordo/rescisão todos se dão por satisfeitos e <strong>O LOCADOR RECEBE O IMÓVEL OBJETO DA
    LOCAÇÃO NO ESTADO EM QUE SE ENCONTRA</strong>.
  </p>

  <p style="margin-top: 30px;">
    E, por estarem justos, acordados e satisfeitos, assinam o presente acordo/rescisão em duas vias
    de igual teor para igual distribuição, a fim de produzirem seus jurídicos e legais efeitos.
  </p>

  <p style="margin-top: 20px;">
    {{imovel.endereco.cidade}}, {{formatDate data_rescisao}}.
  </p>

  <div class="assinatura">
    <div class="linha-assinatura">{{locador.nome}}</div>
    <p><strong>LOCADOR</strong></p>
  </div>

  {{#each locatarios}}
  <div class="assinatura">
    <div class="linha-assinatura">{{nome}}</div>
    <p><strong>LOCATÁRIO{{#unless @first}} {{@index}}{{/unless}}</strong></p>
  </div>
  {{/each}}

  {{#if testemunhas}}
  {{#each testemunhas}}
  <div class="assinatura">
    <div class="linha-assinatura">{{nome}}</div>
    <p><strong>TESTEMUNHA {{@index}}</strong><br>CPF: {{formatCPF cpf}}</p>
  </div>
  {{/each}}
  {{/if}}

</body>
</html>
`;

export const D9_VARIAVEIS_ESPERADAS = [
  'locador.nome',
  'locatarios',
  'contrato.numero',
  'imovel.endereco',
  'data_entrega_imovel',
  'data_rescisao',
  'acerto.caucao_original',
  'acerto.valor_final',
  'motivo_rescisao'
];
