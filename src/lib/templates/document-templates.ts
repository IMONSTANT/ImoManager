/**
 * Templates de Documentos Hardcoded
 * Extraído de: supabase/migrations/20250101000008_seed_documentos_templates.sql
 */

export type DocumentoTipo = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8' | 'D9' | 'D10';

export interface DocumentTemplate {
  tipo: DocumentoTipo;
  nome: string;
  descricao: string;
  template: string;
  variaveis_esperadas: string[];
}

export const DOCUMENT_TEMPLATES: Record<DocumentoTipo, DocumentTemplate> = {
  D1: {
    tipo: 'D1',
    nome: 'Declaração de Entrega de Contrato (Locatário)',
    descricao: 'Declaração de recebimento de contrato de locação e compromisso de realizar ligações de energia e água',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Declaração de Entrega de Contrato</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 14pt; margin: 40px; }
    h1 { text-align: center; font-size: 18pt; margin-bottom: 30px; }
    p { text-align: justify; line-height: 1.8; margin-bottom: 15px; }
    .assinatura { margin-top: 60px; text-align: center; }
    .linha { border-top: 1px solid #000; width: 400px; margin: 0 auto; }
    .data { margin-top: 40px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>DECLARAÇÃO</h1>

  <p>
    <strong>{{locatario.nome}}</strong>, CPF: <strong>{{formatCPF locatario.cpf}}</strong>, DECLARO para os devidos fins
    que RECEBI da(s) Sra.(s) {{proprietario.nome}}, uma (01) via do contrato de locação do imóvel com reconhecida a firma
    da locador(a) e depois realizarei as ligações da energia elétrica (ENEL) e de água/esgoto (CAGECE), dentro do prazo
    de 15 (quinze) dias no máximo em meu nome, do imóvel residencial que alugo sito a <strong>{{imovel.endereco_completo}}</strong>.
  </p>

  <p class="data">
    Fortaleza, {{formatDate contrato.data_inicio}}.
  </p>

  <div class="assinatura">
    <div class="linha"></div>
    <p><strong>{{locatario.nome}}</strong></p>
    <p>(Representante dos locatários, unicamente, neste ato)</p>
  </div>
</body>
</html>`,
    variaveis_esperadas: ['locatario.nome', 'locatario.cpf', 'proprietario.nome', 'imovel.endereco_completo', 'contrato.data_inicio']
  },

  D2: {
    tipo: 'D2',
    nome: 'Ficha Cadastro Fiador',
    descricao: 'Formulário de cadastro completo do fiador',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Ficha Cadastro Fiador</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 30px; }
    h1 { text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    .secao { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #3498db; }
    .campo { margin: 10px 0; }
    label { font-weight: bold; color: #34495e; }
    .valor { margin-left: 10px; }
  </style>
</head>
<body>
  <h1>FICHA CADASTRAL - FIADOR</h1>

  <div class="secao">
    <h2>Dados Pessoais</h2>
    <div class="campo"><label>Nome Completo:</label><span class="valor">{{fiador.nome}}</span></div>
    <div class="campo"><label>CPF:</label><span class="valor">{{formatCPF fiador.cpf}}</span></div>
    <div class="campo"><label>RG:</label><span class="valor">{{fiador.rg}}</span></div>
    <div class="campo"><label>Profissão:</label><span class="valor">{{fiador.profissao}}</span></div>
  </div>

  <div class="secao">
    <h2>Contato</h2>
    <div class="campo"><label>Email:</label><span class="valor">{{fiador.email}}</span></div>
    <div class="campo"><label>Telefone:</label><span class="valor">{{fiador.telefone}}</span></div>
  </div>
</body>
</html>`,
    variaveis_esperadas: ['fiador.nome', 'fiador.cpf', 'fiador.rg', 'fiador.profissao', 'fiador.email', 'fiador.telefone']
  },

  D3: {
    tipo: 'D3',
    nome: 'Contrato de Locação',
    descricao: 'Contrato de locação residencial completo',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contrato de Locação</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; margin: 40px; line-height: 1.6; }
    h1 { text-align: center; font-size: 16pt; margin-bottom: 20px; }
    .clausula { margin: 15px 0; text-align: justify; }
    .assinaturas { margin-top: 50px; }
    .assinatura-bloco { margin: 30px 0; text-align: center; }
    .linha { border-top: 1px solid #000; width: 400px; margin: 10px auto; }
  </style>
</head>
<body>
  <h1>CONTRATO DE LOCAÇÃO RESIDENCIAL</h1>

  <div class="clausula">
    <strong>LOCADOR:</strong> {{proprietario.nome}}<br>
    <strong>LOCATÁRIO:</strong> {{locatario.nome}}, CPF: {{formatCPF locatario.cpf}}<br>
    <strong>IMÓVEL:</strong> {{imovel.endereco_completo}}<br>
    <strong>VALOR:</strong> {{formatCurrency contrato.valor}}<br>
    <strong>VIGÊNCIA:</strong> {{formatDate contrato.data_inicio}} a {{formatDate contrato.data_fim}}
  </div>

  <div class="assinaturas">
    <div class="assinatura-bloco">
      <div class="linha"></div>
      <p>{{proprietario.nome}}<br>LOCADOR</p>
    </div>
    <div class="assinatura-bloco">
      <div class="linha"></div>
      <p>{{locatario.nome}}<br>LOCATÁRIO</p>
    </div>
  </div>
</body>
</html>`,
    variaveis_esperadas: ['proprietario.nome', 'locatario.nome', 'locatario.cpf', 'imovel.endereco_completo', 'contrato.valor', 'contrato.data_inicio', 'contrato.data_fim']
  },

  D4: {
    tipo: 'D4',
    nome: 'Termo de Vistoria de Entrada',
    descricao: 'Vistoria detalhada do imóvel na entrada',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Vistoria de Entrada</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11pt; margin: 30px; }
    h1 { text-align: center; color: #2c3e50; }
    .info { margin: 20px 0; }
    .campo { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>TERMO DE VISTORIA - ENTRADA</h1>

  <div class="info">
    <div class="campo"><strong>Imóvel:</strong> {{imovel.endereco_completo}}</div>
    <div class="campo"><strong>Locatário:</strong> {{locatario.nome}}</div>
    <div class="campo"><strong>Data:</strong> {{formatDate contrato.data_inicio}}</div>
  </div>

  <p>Vistoria realizada em {{formatDate contrato.data_inicio}} no imóvel acima identificado.</p>
</body>
</html>`,
    variaveis_esperadas: ['imovel.endereco_completo', 'locatario.nome', 'contrato.data_inicio']
  },

  D5: {
    tipo: 'D5',
    nome: 'Termo de Vistoria de Saída',
    descricao: 'Vistoria detalhada do imóvel na saída',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Vistoria de Saída</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11pt; margin: 30px; }
    h1 { text-align: center; color: #2c3e50; }
    .info { margin: 20px 0; }
    .campo { margin: 8px 0; }
  </style>
</head>
<body>
  <h1>TERMO DE VISTORIA - SAÍDA</h1>

  <div class="info">
    <div class="campo"><strong>Imóvel:</strong> {{imovel.endereco_completo}}</div>
    <div class="campo"><strong>Locatário:</strong> {{locatario.nome}}</div>
    <div class="campo"><strong>Data:</strong> {{formatDate contrato.data_fim}}</div>
  </div>

  <p>Vistoria de saída realizada em {{formatDate contrato.data_fim}} no imóvel acima identificado.</p>
</body>
</html>`,
    variaveis_esperadas: ['imovel.endereco_completo', 'locatario.nome', 'contrato.data_fim']
  },

  D6: {
    tipo: 'D6',
    nome: 'Autorização de Débito Automático',
    descricao: 'Autorização para débito automático do aluguel',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Autorização de Débito Automático</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; }
    p { margin: 15px 0; text-align: justify; }
  </style>
</head>
<body>
  <h1>AUTORIZAÇÃO DE DÉBITO AUTOMÁTICO</h1>

  <p>
    Eu, <strong>{{locatario.nome}}</strong>, CPF <strong>{{formatCPF locatario.cpf}}</strong>,
    AUTORIZO o débito automático do valor de <strong>{{formatCurrency contrato.valor}}</strong>
    referente ao aluguel do imóvel localizado em <strong>{{imovel.endereco_completo}}</strong>.
  </p>

  <p>Data: {{formatDate contrato.data_inicio}}</p>
</body>
</html>`,
    variaveis_esperadas: ['locatario.nome', 'locatario.cpf', 'contrato.valor', 'imovel.endereco_completo', 'contrato.data_inicio']
  },

  D7: {
    tipo: 'D7',
    nome: 'Termo de Entrega de Chaves',
    descricao: 'Termo de entrega de chaves do imóvel',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Entrega de Chaves</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; }
    p { margin: 15px 0; text-align: justify; }
  </style>
</head>
<body>
  <h1>TERMO DE ENTREGA DE CHAVES</h1>

  <p>
    Declaro que recebi as chaves do imóvel localizado em <strong>{{imovel.endereco_completo}}</strong>,
    objeto do contrato de locação firmado em {{formatDate contrato.data_inicio}}.
  </p>

  <p>
    <strong>Locatário:</strong> {{locatario.nome}}<br>
    <strong>Data:</strong> {{formatDate contrato.data_inicio}}
  </p>
</body>
</html>`,
    variaveis_esperadas: ['imovel.endereco_completo', 'contrato.data_inicio', 'locatario.nome']
  },

  D8: {
    tipo: 'D8',
    nome: 'Notificação de Atraso de Pagamento',
    descricao: 'Notificação ao locatário sobre atraso no pagamento',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Notificação de Atraso</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; color: #c0392b; }
    p { margin: 15px 0; text-align: justify; }
    .destaque { background: #ffe6e6; padding: 10px; border-left: 4px solid #c0392b; }
  </style>
</head>
<body>
  <h1>NOTIFICAÇÃO DE ATRASO</h1>

  <p>Prezado(a) <strong>{{locatario.nome}}</strong>,</p>

  <p class="destaque">
    Informamos que o pagamento referente ao aluguel do imóvel <strong>{{imovel.endereco_completo}}</strong>
    encontra-se em atraso.
  </p>

  <p>
    <strong>Valor devido:</strong> {{formatCurrency contrato.valor}}<br>
    <strong>Vencimento:</strong> Dia {{contrato.dia_vencimento}} de cada mês
  </p>
</body>
</html>`,
    variaveis_esperadas: ['locatario.nome', 'imovel.endereco_completo', 'contrato.valor', 'contrato.dia_vencimento']
  },

  D9: {
    tipo: 'D9',
    nome: 'Acordo de Rescisão de Contrato',
    descricao: 'Termo de rescisão antecipada do contrato de locação',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Acordo de Rescisão</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; }
    p { margin: 15px 0; text-align: justify; line-height: 1.6; }
  </style>
</head>
<body>
  <h1>ACORDO DE RESCISÃO CONTRATUAL</h1>

  <p>
    As partes <strong>{{proprietario.nome}}</strong> (LOCADOR) e <strong>{{locatario.nome}}</strong> (LOCATÁRIO),
    de comum acordo, resolvem rescindir o contrato de locação do imóvel situado em
    <strong>{{imovel.endereco_completo}}</strong>.
  </p>

  <p>
    <strong>Data da rescisão:</strong> {{formatDate contrato.data_fim}}
  </p>
</body>
</html>`,
    variaveis_esperadas: ['proprietario.nome', 'locatario.nome', 'imovel.endereco_completo', 'contrato.data_fim']
  },

  D10: {
    tipo: 'D10',
    nome: 'Recibo de Pagamento',
    descricao: 'Recibo de pagamento de aluguel',
    template: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recibo de Pagamento</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; color: #27ae60; }
    .recibo { border: 2px solid #27ae60; padding: 20px; margin: 20px 0; }
    .campo { margin: 10px 0; }
  </style>
</head>
<body>
  <h1>RECIBO DE PAGAMENTO</h1>

  <div class="recibo">
    <div class="campo"><strong>Recebemos de:</strong> {{locatario.nome}}</div>
    <div class="campo"><strong>CPF:</strong> {{formatCPF locatario.cpf}}</div>
    <div class="campo"><strong>Valor:</strong> {{formatCurrency contrato.valor}}</div>
    <div class="campo"><strong>Referente:</strong> Aluguel do imóvel {{imovel.endereco_completo}}</div>
    <div class="campo"><strong>Competência:</strong> {{formatDate contrato.data_inicio}}</div>
  </div>
</body>
</html>`,
    variaveis_esperadas: ['locatario.nome', 'locatario.cpf', 'contrato.valor', 'imovel.endereco_completo', 'contrato.data_inicio']
  }
};
