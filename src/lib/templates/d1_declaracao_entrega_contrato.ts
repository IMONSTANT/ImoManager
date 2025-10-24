/**
 * Template D1: DECLARAÇÃO DE ENTREGA DE CONTRATO
 * Com reconhecimento de firma
 */

export const D1_DECLARACAO_ENTREGA_CONTRATO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Declaração de Entrega de Contrato</title>
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

    p {
      text-align: justify;
      margin-bottom: 15px;
    }

    .destaque {
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

    .local-data {
      margin-top: 40px;
      margin-bottom: 40px;
    }
  </style>
</head>
<body>
  <h1>DECLARAÇÃO</h1>

  <p>
    {{#if locatarios}}
      {{#each locatarios}}
        {{#if @first}}
          {{#if ../locatarios.[1]}}A Sra.{{else}}{{#if genero_masculino}}O Sr.{{else}}A Sra.{{/if}}{{/if}}
        {{else}}
          {{#if @last}}e {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{else}}, {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{/if}}
        {{/if}}
        <strong>{{nome}}</strong>, {{nacionalidade}}, {{estado_civil}}, {{profissao}},
        RG nº {{formatCPF rg}}, CPF: {{formatCPF cpf}}{{#unless @last}},{{/unless}}
      {{/each}}
    {{/if}}
    DECLARAMOS para os devidos fins que <strong>RECEBEMOS</strong> do(a) Sr(a). <strong>{{locador.nome}}</strong>:
  </p>

  <p>
    <strong>(A)</strong> 02 (duas) vias do contrato de locação;<br>
    <strong>(B)</strong> Via do relatório de vistoria;<br>
    <strong>(C)</strong> Boleto para pagamento da caução no valor de {{formatMoney contrato.valor_caucao}}
    com vencimento para o dia {{formatDate contrato.data_vencimento_caucao}}
  </p>

  <p>
    E que reconheceremos firma em cartório e devolveremos na data {{formatDate contrato.data_devolucao_assinado}}.
  </p>

  <p>
    Estamos, também, cientes que será cobrando o aluguel e encargos proporcional deste mês
    a partir da assinatura desta declaração. Tudo referente ao imóvel que alugo sito a
    <strong>{{imovel.endereco.logradouro}}, {{imovel.endereco.numero}}{{#if imovel.endereco.complemento}}, {{imovel.endereco.complemento}}{{/if}},
    {{imovel.endereco.bairro}}, {{imovel.endereco.cidade}}/{{imovel.endereco.estado}}</strong>.
    Dou tudo por firme e valioso.
  </p>

  <div class="local-data">
    <p>{{imovel.endereco.cidade}}, {{formatDate data_emissao}}.</p>
  </div>

  {{#each locatarios}}
  <div class="assinatura">
    <div class="linha-assinatura">
      {{nome}}
    </div>
    <p class="destaque">Locatário(a)</p>
  </div>
  {{/each}}

</body>
</html>
`;

export const D1_VARIAVEIS_ESPERADAS = [
  'locatarios',
  'locatarios.[].nome',
  'locatarios.[].nacionalidade',
  'locatarios.[].estado_civil',
  'locatarios.[].profissao',
  'locatarios.[].rg',
  'locatarios.[].cpf',
  'locador.nome',
  'contrato.valor_caucao',
  'contrato.data_vencimento_caucao',
  'contrato.data_devolucao_assinado',
  'imovel.endereco.logradouro',
  'imovel.endereco.numero',
  'imovel.endereco.complemento',
  'imovel.endereco.bairro',
  'imovel.endereco.cidade',
  'imovel.endereco.estado',
  'data_emissao'
];
