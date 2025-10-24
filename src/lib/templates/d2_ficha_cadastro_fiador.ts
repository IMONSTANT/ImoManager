/**
 * Template D2: FICHA CADASTRO FIADOR
 */

export const D2_FICHA_CADASTRO_FIADOR = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ficha Cadastro Fiador</title>
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
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
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

    td {
      padding: 8px;
      border: 1px solid #ccc;
    }

    .label {
      font-weight: bold;
      width: 30%;
      background-color: #f9f9f9;
    }

    .observacoes {
      margin-top: 20px;
      padding: 10px;
      border: 1px solid #ccc;
      min-height: 100px;
    }
  </style>
</head>
<body>
  <h1>Ficha Cadastral de Fiador</h1>

  <h2>Dados Pessoais</h2>
  <table>
    <tr>
      <td class="label">Nome Completo:</td>
      <td>{{fiador.nome}}</td>
    </tr>
    <tr>
      <td class="label">CPF:</td>
      <td>{{formatCPF fiador.cpf}}</td>
    </tr>
    <tr>
      <td class="label">RG:</td>
      <td>{{fiador.rg}} - {{fiador.orgao_expedidor}}</td>
    </tr>
    <tr>
      <td class="label">Data de Nascimento:</td>
      <td>{{formatDate fiador.data_nascimento}}</td>
    </tr>
    <tr>
      <td class="label">Nacionalidade:</td>
      <td>{{fiador.nacionalidade}}</td>
    </tr>
    <tr>
      <td class="label">Estado Civil:</td>
      <td>{{fiador.estado_civil}}</td>
    </tr>
    <tr>
      <td class="label">Profissão:</td>
      <td>{{fiador.profissao}}</td>
    </tr>
    <tr>
      <td class="label">Renda Mensal:</td>
      <td>{{formatMoney fiador.renda_mensal}}</td>
    </tr>
  </table>

  <h2>Contato</h2>
  <table>
    <tr>
      <td class="label">E-mail:</td>
      <td>{{fiador.email}}</td>
    </tr>
    <tr>
      <td class="label">Telefone:</td>
      <td>{{fiador.telefone}}</td>
    </tr>
    {{#if fiador.telefone_secundario}}
    <tr>
      <td class="label">Telefone Secundário:</td>
      <td>{{fiador.telefone_secundario}}</td>
    </tr>
    {{/if}}
  </table>

  <h2>Endereço Residencial</h2>
  <table>
    <tr>
      <td class="label">Logradouro:</td>
      <td>{{fiador.endereco.logradouro}}, {{fiador.endereco.numero}}</td>
    </tr>
    {{#if fiador.endereco.complemento}}
    <tr>
      <td class="label">Complemento:</td>
      <td>{{fiador.endereco.complemento}}</td>
    </tr>
    {{/if}}
    <tr>
      <td class="label">Bairro:</td>
      <td>{{fiador.endereco.bairro}}</td>
    </tr>
    <tr>
      <td class="label">Cidade/Estado:</td>
      <td>{{fiador.endereco.cidade}}/{{fiador.endereco.estado}}</td>
    </tr>
    <tr>
      <td class="label">CEP:</td>
      <td>{{formatCEP fiador.endereco.cep}}</td>
    </tr>
  </table>

  {{#if fiador.empresa}}
  <h2>Dados Profissionais</h2>
  <table>
    <tr>
      <td class="label">Empresa:</td>
      <td>{{fiador.empresa.nome}}</td>
    </tr>
    <tr>
      <td class="label">Cargo:</td>
      <td>{{fiador.empresa.cargo}}</td>
    </tr>
    <tr>
      <td class="label">Telefone Comercial:</td>
      <td>{{fiador.empresa.telefone}}</td>
    </tr>
    <tr>
      <td class="label">Tempo de Serviço:</td>
      <td>{{fiador.empresa.tempo_servico}}</td>
    </tr>
  </table>
  {{/if}}

  {{#if fiador.imovel_proprio}}
  <h2>Imóvel Próprio (Garantia)</h2>
  <table>
    <tr>
      <td class="label">Endereço:</td>
      <td>{{fiador.imovel_proprio.endereco}}</td>
    </tr>
    <tr>
      <td class="label">Matrícula:</td>
      <td>{{fiador.imovel_proprio.matricula}}</td>
    </tr>
    <tr>
      <td class="label">Valor Estimado:</td>
      <td>{{formatMoney fiador.imovel_proprio.valor_estimado}}</td>
    </tr>
  </table>
  {{/if}}

  <h2>Observações</h2>
  <div class="observacoes">
    {{#if observacoes}}{{observacoes}}{{else}}Nenhuma observação adicional.{{/if}}
  </div>

  <p style="margin-top: 30px; text-align: center; font-size: 9pt; color: #666;">
    Documento gerado em {{formatDate data_geracao}}
  </p>
</body>
</html>
`;

export const D2_VARIAVEIS_ESPERADAS = [
  'fiador.nome',
  'fiador.cpf',
  'fiador.rg',
  'fiador.orgao_expedidor',
  'fiador.data_nascimento',
  'fiador.nacionalidade',
  'fiador.estado_civil',
  'fiador.profissao',
  'fiador.renda_mensal',
  'fiador.email',
  'fiador.telefone',
  'fiador.endereco.logradouro',
  'fiador.endereco.numero',
  'fiador.endereco.bairro',
  'fiador.endereco.cidade',
  'fiador.endereco.estado',
  'fiador.endereco.cep',
  'data_geracao'
];
