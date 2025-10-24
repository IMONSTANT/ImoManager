/**
 * Template D3: CONTRATO DE LOCAÇÃO COMPLETO
 */

export const D3_CONTRATO_LOCACAO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato de Locação</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 25px;
      text-transform: uppercase;
    }

    p {
      text-align: justify;
      margin-bottom: 12px;
    }

    .clausula {
      font-weight: bold;
      margin-top: 15px;
    }

    .destaque {
      font-weight: bold;
    }

    .assinaturas {
      margin-top: 50px;
      page-break-inside: avoid;
    }

    .linha-assinatura {
      border-top: 1px solid #000;
      width: 350px;
      margin-top: 60px;
      margin-bottom: 5px;
      padding-top: 5px;
    }

    ul {
      margin: 10px 0;
      padding-left: 30px;
    }

    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <h1>Contrato de Locação {{#if contrato.tipo_uso}}{{contrato.tipo_uso}}{{else}}Residencial{{/if}}</h1>

  <p class="clausula">1ª) PARTES CONTRATANTES:</p>

  <p>
    Os signatários deste instrumento, de um lado, <strong>{{proprietario.nome}}</strong>,
    {{proprietario.nacionalidade}}, {{proprietario.estado_civil}},
    {{#if proprietario.cpf}}CPF: {{formatCPF proprietario.cpf}}{{else}}CNPJ: {{formatCNPJ proprietario.cnpj}}{{/if}},
    com endereço à {{proprietario.endereco_completo}}, como <strong>LOCADOR</strong>,
  </p>

  <p>
    e como <strong>LOCATÁRIO{{#if locatarios.[1]}}S{{/if}}</strong>:
    {{#each locatarios}}
      {{#if @first}}{{#if ../locatarios.[1]}}a Sra.{{else}}{{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{/if}}{{else}}{{#if @last}} e {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{else}}, {{#if genero_masculino}}o Sr.{{else}}a Sra.{{/if}}{{/if}}{{/if}}
      <strong>{{nome}}</strong>, {{nacionalidade}}, {{estado_civil}}, {{profissao}},
      RG nº {{rg}}, CPF: {{formatCPF cpf}}{{#unless @last}};{{/unless}}
    {{/each}}
    têm justo contratado e aceitam, a saber:
  </p>

  <p>
    <strong>Parágrafo único:</strong> O objeto deste contrato é a locação do imóvel sito a
    <strong>{{imovel.endereco.logradouro}}, {{imovel.endereco.numero}}{{#if imovel.endereco.complemento}}, {{imovel.endereco.complemento}}{{/if}},
    {{imovel.endereco.bairro}}, {{imovel.endereco.cidade}}/{{imovel.endereco.estado}}, CEP: {{formatCEP imovel.endereco.cep}}</strong>,
    mediante cláusulas e condições a seguir:
  </p>

  <p class="clausula">2ª) PRAZO:</p>

  <p>
    O prazo do contrato é de <strong>{{contrato.prazo_meses}} meses ({{contrato.prazo_anos}} anos)</strong>,
    iniciando em <strong>{{formatDate contrato.data_inicio}}</strong> e terminando
    <strong>{{formatDate contrato.data_fim}}</strong>, data em que o(s) LOCATÁRIO(S) se obrigam a devolver
    o imóvel nos termos discriminados no relatório de vistoria datado que faz parte deste contrato,
    independentemente de qualquer aviso, notificação ou interpelação judicial ou extrajudicial.
  </p>

  <p class="clausula">3ª) ALUGUEL E ENCARGOS:</p>

  <p>
    As partes inicialmente estipulam o aluguel em <strong>{{formatMoney contrato.valor}}</strong>,
    que o(s) LOCATÁRIO(S) <em>solidariamente</em> pagam com vencimento no dia
    <strong>{{contrato.dia_vencimento}}</strong> de cada mês, com comodidade de pagamento até o dia
    {{contrato.dia_tolerancia}} do mês seguinte ao vencido, sem multa, por boleto bancário que será
    enviado para o e-mail indicado pelo(s) LOCATÁRIO(S).
  </p>

  <p>
    <strong>Parágrafo primeiro:</strong> Em todas as dívidas, independente de aviso ou cobrança,
    haverá um acréscimo que corresponderá a multa de <strong>10% (dez por cento)</strong> no primeiro
    dia de atraso do valor do débito. Após este dia será acrescida de 1% (um por cento) de juros
    proporcionais aos dias em atraso, mais a inflação completa do mês ({{contrato.indice_reajuste}}).
  </p>

  <p>
    <strong>Parágrafo segundo:</strong> Os reajustes dos aluguéis serão de 12 (doze) em 12 (doze) meses,
    pelo {{contrato.indice_reajuste}}, a contar da data de início deste contrato em
    {{formatDate contrato.data_inicio}}.
  </p>

  <p class="clausula">4ª) DESPESAS:</p>

  <p>
    Os consumos de água/esgoto, luz, bem como todos os impostos (IPTU, contribuição de melhoria,
    taxa de lixo), todas as taxas (alvarás, lixo, incêndio/corpo de bombeiro) serão pagos pelo(s)
    LOCATÁRIO(S), e seu não pagamento na época determinada acarretará a sua cobrança com multas,
    juros, acréscimos e a rescisão.
  </p>

  {{#if fiador}}
  <p class="clausula">5ª) FIADOR:</p>

  <p>
    Neste ato intervém como FIADOR e principal pagador, com renúncia expressa do benefício de ordem,
    respondendo solidariamente com o(s) LOCATÁRIO(S) por todas as obrigações deste contrato,
    {{#if fiador.genero_masculino}}o Sr.{{else}}a Sra.{{/if}} <strong>{{fiador.nome}}</strong>,
    {{fiador.nacionalidade}}, {{fiador.estado_civil}}, {{fiador.profissao}},
    RG nº {{fiador.rg}}, CPF: {{formatCPF fiador.cpf}}, residente à {{fiador.endereco_completo}}.
  </p>
  {{/if}}

  {{#if contrato.caucao}}
  <p class="clausula">{{#if fiador}}6ª{{else}}5ª{{/if}}) CAUÇÃO:</p>

  <p>
    O(s) LOCATÁRIO(S) dão como garantia a importância equivalente de
    <strong>{{formatMoney contrato.caucao}}</strong> que será DEVOLVIDA na entrega das chaves do imóvel,
    corrigido pela poupança, desde que completamente desocupado e pintado, apto a locação digna nos
    termos do relatório de vistoria, sem nenhuma dívida de aluguel, energia elétrica e água/esgoto.
  </p>
  {{/if}}

  {{#if clausulas_especiais}}
  <p class="clausula">CLÁUSULAS ESPECIAIS:</p>
  {{#each clausulas_especiais}}
  <p>{{this}}</p>
  {{/each}}
  {{/if}}

  <p class="clausula">FORO:</p>

  <p>
    Para todas as questões oriundas deste contrato será competente o foro da situação do imóvel locado,
    com renúncia da qualquer outro, por mais especial que se apresente.
  </p>

  <p style="margin-top: 30px;">
    E, por estarem justos e contratados, assinam o presente instrumento em 02 (duas) vias de igual
    teor e forma, juntamente com 02 (duas) testemunhas.
  </p>

  <p style="margin-top: 20px;">
    {{imovel.endereco.cidade}}, {{formatDate contrato.data_assinatura}}.
  </p>

  <div class="assinaturas">
    <div class="linha-assinatura">{{proprietario.nome}}</div>
    <p style="text-align: center;"><strong>LOCADOR</strong></p>

    {{#each locatarios}}
    <div class="linha-assinatura">{{nome}}</div>
    <p style="text-align: center;"><strong>LOCATÁRIO{{#unless @first}} {{@index}}{{/unless}}</strong></p>
    {{/each}}

    {{#if fiador}}
    <div class="linha-assinatura">{{fiador.nome}}</div>
    <p style="text-align: center;"><strong>FIADOR</strong></p>
    {{/if}}

    <div class="linha-assinatura">_____________________</div>
    <p style="text-align: center;"><strong>TESTEMUNHA 1</strong></p>

    <div class="linha-assinatura">_____________________</div>
    <p style="text-align: center;"><strong>TESTEMUNHA 2</strong></p>
  </div>

</body>
</html>
`;

export const D3_VARIAVEIS_ESPERADAS = [
  'contrato.numero',
  'contrato.data_inicio',
  'contrato.data_fim',
  'contrato.valor',
  'contrato.dia_vencimento',
  'contrato.indice_reajuste',
  'proprietario.nome',
  'proprietario.nacionalidade',
  'proprietario.estado_civil',
  'locatarios',
  'imovel.endereco.logradouro',
  'imovel.endereco.numero',
  'imovel.endereco.bairro',
  'imovel.endereco.cidade',
  'imovel.endereco.estado',
  'imovel.endereco.cep'
];
