/**
 * Template D8: NOTIFICAÇÃO DE ATRASO DE PAGAMENTO
 */

export const D8_NOTIFICACAO_ATRASO = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Notificação de Atraso</title>
  <style>
    @page {
      size: A4;
      margin: 2cm 1.5cm;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      color: #c00;
    }

    .alerta {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      color: #c00;
      margin-bottom: 30px;
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
      width: 40%;
      background-color: #f5f5f5;
    }

    .valor-destaque {
      font-size: 14pt;
      font-weight: bold;
      color: #c00;
    }

    .box-aviso {
      border: 2px solid #c00;
      padding: 15px;
      margin: 20px 0;
      background-color: #ffe6e6;
    }

    .instrucoes {
      background-color: #e6f3ff;
      border: 1px solid #0066cc;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>NOTIFICAÇÃO DE ATRASO DE PAGAMENTO</h1>
  <p class="alerta">SEGUNDA VIA - DÉBITO EM ABERTO</p>

  <p>
    <strong>Prezado(a) Sr(a). {{locatario.nome}},</strong>
  </p>

  <p>
    Vimos por meio desta NOTIFICAR que o pagamento do aluguel referente ao imóvel situado à
    <strong>{{imovel.endereco_completo}}</strong>, objeto do contrato de locação
    nº <strong>{{contrato.numero}}</strong>, encontra-se em ATRASO.
  </p>

  <h2 style="margin-top: 30px; font-size: 13pt;">Dados do Locatário:</h2>

  <table>
    <tr>
      <td class="label">Nome:</td>
      <td>{{locatario.nome}}</td>
    </tr>
    <tr>
      <td class="label">CPF:</td>
      <td>{{formatCPF locatario.cpf}}</td>
    </tr>
    <tr>
      <td class="label">Endereço do Imóvel:</td>
      <td>{{imovel.endereco_completo}}</td>
    </tr>
  </table>

  <h2 style="margin-top: 30px; font-size: 13pt;">Detalhamento do Débito:</h2>

  <table>
    <tr>
      <td class="label">Competência:</td>
      <td>{{parcela.competencia}}</td>
    </tr>
    <tr>
      <td class="label">Data de Vencimento:</td>
      <td>{{formatDate parcela.vencimento}}</td>
    </tr>
    <tr>
      <td class="label">Dias em Atraso:</td>
      <td class="valor-destaque">{{parcela.dias_atraso}} dias</td>
    </tr>
    <tr style="background-color: #f0f0f0;">
      <td class="label">Valor do Aluguel:</td>
      <td>{{formatMoney parcela.principal}}</td>
    </tr>
    <tr>
      <td class="label">Multa (10%):</td>
      <td>{{formatMoney parcela.multa}}</td>
    </tr>
    <tr>
      <td class="label">Juros (1% a.m.):</td>
      <td>{{formatMoney parcela.juros}}</td>
    </tr>
    {{#if parcela.correcao}}
    <tr>
      <td class="label">Correção Monetária:</td>
      <td>{{formatMoney parcela.correcao}}</td>
    </tr>
    {{/if}}
    <tr style="background-color: #ffe6e6; font-weight: bold; font-size: 12pt;">
      <td class="label">VALOR TOTAL ATUALIZADO:</td>
      <td class="valor-destaque">{{formatMoney parcela.valor_total}}</td>
    </tr>
  </table>

  <div class="box-aviso">
    <p style="margin: 0; font-weight: bold; font-size: 12pt;">ATENÇÃO:</p>
    <p style="margin: 10px 0 0 0;">
      O não pagamento deste débito no prazo de <strong>05 (cinco) dias úteis</strong> a contar
      do recebimento desta notificação poderá acarretar:
    </p>
    <ul style="margin: 10px 0 0 20px;">
      <li>Inclusão do nome nos órgãos de proteção ao crédito (SPC/SERASA);</li>
      <li>Protesto do título em cartório;</li>
      <li>Ação de despejo por falta de pagamento;</li>
      <li>Acréscimo de custas judiciais e honorários advocatícios (20%).</li>
    </ul>
  </div>

  <div class="instrucoes">
    <p style="margin: 0; font-weight: bold;">INSTRUÇÕES PARA PAGAMENTO:</p>
    <ul style="margin: 10px 0 0 20px;">
      <li>Entre em contato pelos telefones: {{contato.telefones}}</li>
      <li>Horário de atendimento: {{contato.horario}}</li>
      <li>E-mail: {{contato.email}}</li>
      <li>Solicite a 2ª via do boleto atualizado com os encargos</li>
    </ul>
  </div>

  <p style="margin-top: 30px;">
    Ressaltamos que este débito está registrado em nosso sistema e será cobrado conforme
    previsto no contrato de locação e na legislação vigente.
  </p>

  <p style="margin-top: 30px;">
    Atenciosamente,
  </p>

  <p style="margin-top: 40px;">
    {{locador.nome}}<br>
    <strong>LOCADOR</strong>
  </p>

  <p style="margin-top: 30px; font-size: 9pt; color: #666;">
    {{imovel.endereco.cidade}}, {{formatDate data_notificacao}}<br>
    Documento gerado eletronicamente - Notificação nº {{numero_notificacao}}
  </p>

</body>
</html>
`;

export const D8_VARIAVEIS_ESPERADAS = [
  'locatario.nome',
  'locatario.cpf',
  'contrato.numero',
  'imovel.endereco_completo',
  'parcela.competencia',
  'parcela.vencimento',
  'parcela.dias_atraso',
  'parcela.principal',
  'parcela.multa',
  'parcela.juros',
  'parcela.valor_total',
  'locador.nome',
  'data_notificacao'
];
