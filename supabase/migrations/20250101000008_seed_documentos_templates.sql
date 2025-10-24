-- =====================================================
-- MIGRATION: SEED - Templates de Documentos (D1-D10)
-- =====================================================
-- Popula a tabela documento_modelo com os 10 templates padrão
-- Baseado nos documentos reais extraídos dos PDFs
-- =====================================================

-- =====================================================
-- D1: DECLARAÇÃO DE ENTREGA DE CONTRATO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D1',
  'Declaração de Entrega de Contrato (Locatário)',
  'Declaração de recebimento de contrato de locação e compromisso de realizar ligações de energia e água',
  '<!DOCTYPE html>
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
</html>',
  '["locatario.nome", "locatario.cpf", "proprietario.nome", "imovel.endereco_completo", "contrato.data_inicio"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D2: FICHA CADASTRO FIADOR
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D2',
  'Ficha Cadastro Fiador',
  'Formulário de cadastro completo do fiador',
  '<!DOCTYPE html>
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
    <div class="campo"><label>Data de Nascimento:</label><span class="valor">{{formatDate fiador.data_nascimento}}</span></div>
    <div class="campo"><label>Estado Civil:</label><span class="valor">{{fiador.estado_civil}}</span></div>
    <div class="campo"><label>Profissão:</label><span class="valor">{{fiador.profissao}}</span></div>
  </div>

  <div class="secao">
    <h2>Contato</h2>
    <div class="campo"><label>Email:</label><span class="valor">{{fiador.email}}</span></div>
    <div class="campo"><label>Telefone:</label><span class="valor">{{fiador.telefone}}</span></div>
  </div>

  <div class="secao">
    <h2>Endereço</h2>
    <div class="campo"><label>Endereço Completo:</label><span class="valor">{{fiador.endereco_completo}}</span></div>
    <div class="campo"><label>CEP:</label><span class="valor">{{formatCEP fiador.cep}}</span></div>
  </div>

  <p style="margin-top: 40px; text-align: center; font-size: 10pt; color: #7f8c8d;">
    Documento gerado em {{formatDate sistema.data_geracao}}
  </p>
</body>
</html>',
  '["fiador.nome", "fiador.cpf", "fiador.rg", "fiador.data_nascimento", "fiador.estado_civil", "fiador.profissao", "fiador.email", "fiador.telefone", "fiador.endereco_completo", "fiador.cep", "sistema.data_geracao"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D3: CONTRATO DE LOCAÇÃO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D3',
  'Contrato de Locação Residencial',
  'Contrato completo de locação com todas as cláusulas',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contrato de Locação</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 11pt; margin: 30px 50px; line-height: 1.6; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 20px; }
    .clausula { margin: 15px 0; text-align: justify; }
    .assinaturas { margin-top: 60px; }
    .assinatura { margin: 30px 0; text-align: center; }
    .linha { border-top: 1px solid #000; width: 350px; margin: 0 auto; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>CONTRATO DE LOCAÇÃO RESIDENCIAL</h1>

  <p class="clausula">
    <strong>1ª)</strong> Os signatários deste instrumento, de um lado, <strong>{{proprietario.nome}}</strong>,
    como LOCADOR(A), e de outro lado <strong>{{locatario.nome}}</strong>, {{locatario.profissao}},
    RG nº {{locatario.rg}}, CPF: {{formatCPF locatario.cpf}}, como LOCATÁRIO(A), têm justo contratado e aceitam, a saber:
  </p>

  <p class="clausula">
    <strong>Parágrafo único:</strong> O objeto deste contrato é a locação do imóvel sito à
    <strong>{{imovel.endereco_completo}}</strong> mediante cláusulas e condições a seguir:
  </p>

  <p class="clausula">
    <strong>2ª)</strong> O prazo do contrato é de <strong>{{contrato.prazo_meses}} meses</strong>,
    iniciando em <strong>{{formatDate contrato.data_inicio}}</strong> e terminando
    <strong>{{formatDate contrato.data_fim}}</strong>, data em que o(s) LOCATÁRIO(S) se obrigam a devolver o imóvel
    nos termos discriminados no relatório de vistoria, independentemente de qualquer aviso, notificação ou interpelação
    judicial ou extrajudicial.
  </p>

  <p class="clausula">
    <strong>3ª)</strong> As partes inicialmente estipulam o aluguel em <strong>{{formatMoney contrato.valor_aluguel}}</strong>,
    que o(s) LOCATÁRIO(S) pagarão com vencimento no dia <strong>{{contrato.dia_vencimento}}</strong> de cada mês.
  </p>

  <p class="clausula">
    <strong>Parágrafo primeiro:</strong> Em todas as dívidas, independente de aviso ou cobrança haverá um acréscimo
    que corresponderá a multa de <strong>10% (dez por cento)</strong> no primeiro dia de atraso, do valor do débito,
    por cada mês atrasado. Após este dia será acrescida de 1% (um por cento) de juros proporcionais aos dias em atraso.
  </p>

  <p class="clausula">
    <strong>4ª)</strong> Os consumos de água/esgoto (CAGECE), luz (ENEL), bem como todos os impostos (IPTU, contribuição
    de melhoria, taxa de lixo) serão pagos pelo(s) LOCATÁRIO(S).
  </p>

  <p class="clausula" style="margin-top: 40px;">
    Fortaleza, {{formatDate contrato.data_assinatura}}.
  </p>

  <div class="assinaturas">
    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{proprietario.nome}}</strong> - Locador(a)</p>
    </div>

    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{locatario.nome}}</strong> - Locatário(a)</p>
    </div>

    {{#if fiador.nome}}
    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{fiador.nome}}</strong> - Fiador(a)</p>
    </div>
    {{/if}}
  </div>
</body>
</html>',
  '["proprietario.nome", "locatario.nome", "locatario.profissao", "locatario.rg", "locatario.cpf", "imovel.endereco_completo", "contrato.prazo_meses", "contrato.data_inicio", "contrato.data_fim", "contrato.valor_aluguel", "contrato.dia_vencimento", "contrato.data_assinatura", "fiador.nome"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D4: TERMO DE VISTORIA DE ENTRADA
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D4',
  'Termo de Vistoria de Entrada',
  'Relatório de vistoria do imóvel na entrada do locatário',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Vistoria de Entrada</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11pt; margin: 30px; }
    h1 { text-align: center; color: #2c3e50; }
    .info { margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #bdc3c7; padding: 10px; text-align: left; }
    th { background: #34495e; color: white; }
    .assinaturas { margin-top: 60px; display: flex; justify-content: space-around; }
    .assinatura { text-align: center; }
    .linha { border-top: 1px solid #000; width: 250px; margin: 10px auto; }
  </style>
</head>
<body>
  <h1>TERMO DE VISTORIA DE ENTRADA</h1>

  <div class="info">
    <p><strong>Imóvel:</strong> {{imovel.endereco_completo}}</p>
    <p><strong>Contrato:</strong> {{contrato.numero}}</p>
    <p><strong>Locatário:</strong> {{locatario.nome}}</p>
    <p><strong>Data da Vistoria:</strong> {{formatDate vistoria.data}}</p>
  </div>

  <h2>Estado de Conservação</h2>
  <table>
    <thead>
      <tr>
        <th>Cômodo/Item</th>
        <th>Estado</th>
        <th>Observações</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Paredes</td>
        <td>{{vistoria.paredes_estado}}</td>
        <td>{{vistoria.paredes_obs}}</td>
      </tr>
      <tr>
        <td>Piso</td>
        <td>{{vistoria.piso_estado}}</td>
        <td>{{vistoria.piso_obs}}</td>
      </tr>
      <tr>
        <td>Portas</td>
        <td>{{vistoria.portas_estado}}</td>
        <td>{{vistoria.portas_obs}}</td>
      </tr>
      <tr>
        <td>Janelas</td>
        <td>{{vistoria.janelas_estado}}</td>
        <td>{{vistoria.janelas_obs}}</td>
      </tr>
      <tr>
        <td>Instalações Elétricas</td>
        <td>{{vistoria.eletrica_estado}}</td>
        <td>{{vistoria.eletrica_obs}}</td>
      </tr>
      <tr>
        <td>Instalações Hidráulicas</td>
        <td>{{vistoria.hidraulica_estado}}</td>
        <td>{{vistoria.hidraulica_obs}}</td>
      </tr>
    </tbody>
  </table>

  <p style="margin-top: 30px;">
    <strong>Observações Gerais:</strong><br>
    {{vistoria.observacoes}}
  </p>

  <div class="assinaturas">
    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>Locador</strong></p>
    </div>

    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>Locatário</strong></p>
    </div>
  </div>
</body>
</html>',
  '["imovel.endereco_completo", "contrato.numero", "locatario.nome", "vistoria.data", "vistoria.paredes_estado", "vistoria.paredes_obs", "vistoria.piso_estado", "vistoria.piso_obs", "vistoria.portas_estado", "vistoria.portas_obs", "vistoria.janelas_estado", "vistoria.janelas_obs", "vistoria.eletrica_estado", "vistoria.eletrica_obs", "vistoria.hidraulica_estado", "vistoria.hidraulica_obs", "vistoria.observacoes"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D5: TERMO DE VISTORIA DE SAÍDA
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D5',
  'Termo de Vistoria de Saída',
  'Relatório de vistoria do imóvel na saída do locatário',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Vistoria de Saída</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 11pt; margin: 30px; }
    h1 { text-align: center; color: #c0392b; }
    .info { margin: 20px 0; padding: 15px; background: #fadbd8; border-radius: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #bdc3c7; padding: 10px; text-align: left; }
    th { background: #e74c3c; color: white; }
    .pendencias { margin: 20px 0; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; }
    .assinaturas { margin-top: 60px; display: flex; justify-content: space-around; }
    .assinatura { text-align: center; }
    .linha { border-top: 1px solid #000; width: 250px; margin: 10px auto; }
  </style>
</head>
<body>
  <h1>TERMO DE VISTORIA DE SAÍDA</h1>

  <div class="info">
    <p><strong>Imóvel:</strong> {{imovel.endereco_completo}}</p>
    <p><strong>Contrato:</strong> {{contrato.numero}}</p>
    <p><strong>Locatário:</strong> {{locatario.nome}}</p>
    <p><strong>Data da Vistoria:</strong> {{formatDate vistoria.data}}</p>
    <p><strong>Data de Encerramento:</strong> {{formatDate contrato.data_fim}}</p>
  </div>

  <h2>Estado de Conservação</h2>
  <table>
    <thead>
      <tr>
        <th>Cômodo/Item</th>
        <th>Estado Entrada</th>
        <th>Estado Saída</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Paredes</td>
        <td>{{vistoria_entrada.paredes_estado}}</td>
        <td>{{vistoria.paredes_estado}}</td>
        <td>{{vistoria.paredes_status}}</td>
      </tr>
      <tr>
        <td>Piso</td>
        <td>{{vistoria_entrada.piso_estado}}</td>
        <td>{{vistoria.piso_estado}}</td>
        <td>{{vistoria.piso_status}}</td>
      </tr>
      <tr>
        <td>Portas</td>
        <td>{{vistoria_entrada.portas_estado}}</td>
        <td>{{vistoria.portas_estado}}</td>
        <td>{{vistoria.portas_status}}</td>
      </tr>
      <tr>
        <td>Janelas</td>
        <td>{{vistoria_entrada.janelas_estado}}</td>
        <td>{{vistoria.janelas_estado}}</td>
        <td>{{vistoria.janelas_status}}</td>
      </tr>
    </tbody>
  </table>

  {{#if vistoria.tem_pendencias}}
  <div class="pendencias">
    <h3>⚠️ Pendências Identificadas</h3>
    <p>{{vistoria.pendencias_descricao}}</p>
    <p><strong>Valor Estimado de Reparos:</strong> {{formatMoney vistoria.valor_reparos}}</p>
  </div>
  {{/if}}

  <div class="assinaturas">
    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>Locador</strong></p>
    </div>

    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>Locatário</strong></p>
    </div>
  </div>
</body>
</html>',
  '["imovel.endereco_completo", "contrato.numero", "locatario.nome", "vistoria.data", "contrato.data_fim", "vistoria_entrada.paredes_estado", "vistoria.paredes_estado", "vistoria.paredes_status", "vistoria_entrada.piso_estado", "vistoria.piso_estado", "vistoria.piso_status", "vistoria_entrada.portas_estado", "vistoria.portas_estado", "vistoria.portas_status", "vistoria_entrada.janelas_estado", "vistoria.janelas_estado", "vistoria.janelas_status", "vistoria.tem_pendencias", "vistoria.pendencias_descricao", "vistoria.valor_reparos"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D6: AUTORIZAÇÃO DÉBITO AUTOMÁTICO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D6',
  'Autorização de Débito Automático',
  'Autorização para débito em conta bancária',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Autorização de Débito Automático</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 10px; }
    .conteudo { margin: 30px 0; line-height: 1.8; text-align: justify; }
    .dados-conta { margin: 30px 0; padding: 20px; background: #e8f8f5; border-left: 4px solid #27ae60; }
    .assinatura { margin-top: 80px; text-align: center; }
    .linha { border-top: 1px solid #000; width: 400px; margin: 0 auto; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>AUTORIZAÇÃO DE DÉBITO AUTOMÁTICO</h1>

  <div class="conteudo">
    <p>
      Eu, <strong>{{locatario.nome}}</strong>, CPF <strong>{{formatCPF locatario.cpf}}</strong>,
      locatário do imóvel situado à <strong>{{imovel.endereco_completo}}</strong>,
      conforme contrato nº <strong>{{contrato.numero}}</strong>, AUTORIZO o débito automático
      do valor mensal do aluguel e encargos na conta bancária abaixo discriminada:
    </p>
  </div>

  <div class="dados-conta">
    <h3>Dados Bancários</h3>
    <p><strong>Banco:</strong> {{conta.banco}} - {{conta.nome_banco}}</p>
    <p><strong>Agência:</strong> {{conta.agencia}}</p>
    <p><strong>Conta:</strong> {{conta.numero}} ({{conta.tipo}})</p>
    <p><strong>Titular:</strong> {{conta.titular}}</p>
  </div>

  <div class="conteudo">
    <p>
      Esta autorização é válida a partir de <strong>{{formatDate autorizacao.data_inicio}}</strong>
      e poderá ser cancelada mediante comunicação por escrito com antecedência mínima de 30 (trinta) dias.
    </p>

    <p>
      O débito será realizado mensalmente no dia <strong>{{contrato.dia_vencimento}}</strong> de cada mês.
    </p>
  </div>

  <p style="margin-top: 40px;">
    Fortaleza, {{formatDate autorizacao.data_assinatura}}.
  </p>

  <div class="assinatura">
    <div class="linha"></div>
    <p><strong>{{locatario.nome}}</strong></p>
    <p>CPF: {{formatCPF locatario.cpf}}</p>
  </div>
</body>
</html>',
  '["locatario.nome", "locatario.cpf", "imovel.endereco_completo", "contrato.numero", "conta.banco", "conta.nome_banco", "conta.agencia", "conta.numero", "conta.tipo", "conta.titular", "autorizacao.data_inicio", "contrato.dia_vencimento", "autorizacao.data_assinatura"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D7: TERMO DE ENTREGA DE CHAVES
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D7',
  'Termo de Entrega de Chaves',
  'Declaração de entrega de chaves do imóvel',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Termo de Entrega de Chaves</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 13pt; margin: 40px; }
    h1 { text-align: center; font-size: 18pt; margin-bottom: 30px; }
    .conteudo { text-align: justify; line-height: 1.8; margin-bottom: 20px; }
    .destaque { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
    .assinatura { margin-top: 60px; text-align: center; }
    .linha { border-top: 1px solid #000; width: 400px; margin: 0 auto; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>DECLARAÇÃO DE ENTREGA PROVISÓRIA DE CHAVES</h1>

  <p class="conteudo">
    <strong>{{locatario.nome}}</strong>, brasileiro(a), RG nº <strong>{{locatario.rg}}</strong>
    SSPDS-CE, CPF: <strong>{{formatCPF locatario.cpf}}</strong>, locatário(a) do imóvel situado à
    <strong>{{imovel.endereco_completo}}</strong>, declaro para todos os fins que entrego a título
    provisório, as chaves para simples verificação por parte do(s) locador(es).
  </p>

  <div class="destaque">
    <p style="text-align: center; font-weight: bold;">
      FICAM PERMANECENDO, EM PLENO VIGOR, TODAS AS OBRIGAÇÕES CONTRATUAIS E LEGAIS
    </p>
  </div>

  <p class="conteudo">
    As quais cessarão, tão somente quando da entrega definitiva do mencionado imóvel nas condições
    que recebi. Ressalto que entrarei em contato com o(s) locador(es) no prazo máximo de 03 (três)
    dias úteis, para tomar ciência do que foi constatado no imóvel.
  </p>

  <p class="conteudo">
    <strong>Quantidade de Chaves Entregues:</strong> {{chaves.quantidade}} ({{chaves.quantidade_extenso}})
  </p>

  <p class="conteudo">
    <strong>Data da Entrega:</strong> {{formatDate entrega.data}}
  </p>

  <p class="conteudo">
    Concluída a vistoria, e existindo danos (consertos e pinturas) serão realizados ou pagos pelo(s)
    locatário(s) e também as prováveis pendências (multa de rescisão contratual, aluguel, impostos,
    água, taxa de manutenção, energia elétrica, condomínio...).
  </p>

  <p class="conteudo" style="margin-top: 30px;">
    <strong>Novo endereço:</strong> {{locatario.novo_endereco}}<br>
    <strong>Telefone:</strong> {{locatario.telefone}}
  </p>

  <p style="margin-top: 40px;">
    Fortaleza, {{formatDate entrega.data_assinatura}}.
  </p>

  <div class="assinatura">
    <div class="linha"></div>
    <p><strong>{{locatario.nome}}</strong></p>
  </div>
</body>
</html>',
  '["locatario.nome", "locatario.rg", "locatario.cpf", "imovel.endereco_completo", "chaves.quantidade", "chaves.quantidade_extenso", "entrega.data", "locatario.novo_endereco", "locatario.telefone", "entrega.data_assinatura"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D8: NOTIFICAÇÃO DE ATRASO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D8',
  'Notificação de Atraso de Pagamento',
  'Notificação extrajudicial de atraso no pagamento do aluguel',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Notificação de Atraso</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    h1 { text-align: center; color: #c0392b; border-bottom: 3px solid #c0392b; padding-bottom: 10px; }
    .alerta { background: #f8d7da; border-left: 5px solid #c0392b; padding: 20px; margin: 20px 0; }
    .debito { background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #dee2e6; padding: 12px; text-align: left; }
    th { background: #c0392b; color: white; }
    .total { font-size: 14pt; font-weight: bold; color: #c0392b; }
    .prazo { background: #d1ecf1; border-left: 4px solid #0c5460; padding: 15px; margin: 20px 0; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>⚠️ NOTIFICAÇÃO DE DÉBITO EM ATRASO</h1>

  <div class="alerta">
    <p style="text-align: center; font-size: 14pt; margin: 0;">
      <strong>ATENÇÃO: DÉBITO PENDENTE</strong>
    </p>
  </div>

  <p>
    <strong>Locatário:</strong> {{locatario.nome}}<br>
    <strong>CPF:</strong> {{formatCPF locatario.cpf}}<br>
    <strong>Imóvel:</strong> {{imovel.endereco_completo}}<br>
    <strong>Contrato:</strong> {{contrato.numero}}
  </p>

  <div class="debito">
    <h2>Débitos em Aberto</h2>
    <table>
      <thead>
        <tr>
          <th>Competência</th>
          <th>Vencimento</th>
          <th>Dias de Atraso</th>
          <th>Valor Original</th>
          <th>Multa/Juros</th>
          <th>Valor Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{parcela.competencia}}</td>
          <td>{{formatDate parcela.vencimento}}</td>
          <td><strong>{{parcela.dias_atraso}} dias</strong></td>
          <td>{{formatMoney parcela.valor_original}}</td>
          <td>{{formatMoney parcela.valor_multa_juros}}</td>
          <td class="total">{{formatMoney parcela.valor_total}}</td>
        </tr>
      </tbody>
    </table>

    <p class="total" style="text-align: right; margin-top: 20px;">
      TOTAL A PAGAR: {{formatMoney parcela.valor_total}}
    </p>
  </div>

  <div class="prazo">
    <p>
      <strong>PRAZO PARA REGULARIZAÇÃO:</strong>
      O pagamento deverá ser efetuado até <strong>{{formatDate notificacao.prazo_pagamento}}</strong>,
      sob pena de inclusão do nome nos órgãos de proteção ao crédito (SPC/SERASA) e tomada de medidas
      judiciais cabíveis, incluindo ação de despejo por falta de pagamento.
    </p>
  </div>

  <p style="margin-top: 30px;">
    <strong>Dados para Pagamento:</strong><br>
    Boleto disponível no email cadastrado ou PIX: {{pagamento.chave_pix}}
  </p>

  <p style="margin-top: 40px; font-size: 10pt; color: #6c757d;">
    Notificação emitida em {{formatDate notificacao.data_emissao}}<br>
    Documento gerado automaticamente pelo sistema
  </p>
</body>
</html>',
  '["locatario.nome", "locatario.cpf", "imovel.endereco_completo", "contrato.numero", "parcela.competencia", "parcela.vencimento", "parcela.dias_atraso", "parcela.valor_original", "parcela.valor_multa_juros", "parcela.valor_total", "notificacao.prazo_pagamento", "pagamento.chave_pix", "notificacao.data_emissao"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D9: ACORDO DE RESCISÃO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D9',
  'Acordo de Rescisão de Contrato',
  'Termo de rescisão amigável do contrato de locação',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Acordo de Rescisão</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 11pt; margin: 30px 50px; line-height: 1.6; }
    h1 { text-align: center; font-size: 14pt; margin-bottom: 30px; }
    .clausula { margin: 15px 0; text-align: justify; }
    .assinaturas { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .assinatura { text-align: center; }
    .linha { border-top: 1px solid #000; width: 300px; margin: 0 auto; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <h1>ACORDO – RESCISÃO DE CONTRATO DE LOCAÇÃO</h1>

  <p class="clausula">
    <strong>01°)</strong> <strong>{{proprietario.nome}}</strong>, como locador(a), e
    <strong>{{locatario.nome}}</strong>, brasileiro(a), {{locatario.profissao}},
    RG nº: {{locatario.rg}}, CPF: {{formatCPF locatario.cpf}}, como locatário(a),
    têm justo e PACTUADO pelo presente termo a rescisão da locação do imóvel residencial sito à
    <strong>{{imovel.endereco_completo}}</strong> de conformidade com o que segue:
  </p>

  <p class="clausula">
    <strong>02°)</strong> O(A) locatário(a) entregou ao(à) locador(a), as chaves do imóvel acima referido,
    que está vazio e desocupado em <strong>{{formatDate rescisao.data_entrega_chaves}}</strong>.
  </p>

  <p class="clausula">
    <strong>03°)</strong> O(A) locatário(a) é responsável por todo o consumo de energia elétrica (ENEL)
    e água/esgoto (CAGECE) do imóvel, enquanto estiver com a titularidade ou até a presente data.
  </p>

  <p class="clausula">
    <strong>04°)</strong> AS PARTES ACORDAM em abater o valor da caução e mais a importância de
    <strong>{{formatMoney rescisao.valor_abatimento}}</strong> para pagar a multa contratual proporcional
    (rescisão) e o material e mão de obra de pequenas pinturas necessárias para concluir a reforma do imóvel
    deixando nos termos do relatório de vistoria.
  </p>

  {{#if rescisao.debitos_pendentes}}
  <p class="clausula">
    <strong>05°)</strong> Ficam pendentes de quitação os seguintes débitos: {{rescisao.descricao_debitos}},
    no valor total de <strong>{{formatMoney rescisao.valor_debitos}}</strong>, com vencimento em
    <strong>{{formatDate rescisao.prazo_quitacao}}</strong>.
  </p>
  {{/if}}

  <p class="clausula">
    <strong>{{rescisao.clausula_final}}°)</strong> As partes concordam que não há mais nada a requerer em
    qualquer tempo ou local, pois com este acordo/rescisão todos se dão por satisfeitos e
    <strong>O(S) LOCADOR(ES) RECEBE(M) O IMÓVEL OBJETO DA LOCAÇÃO NO ESTADO EM QUE SE ENCONTRA</strong>.
  </p>

  <p class="clausula">
    <strong>Motivo da Rescisão:</strong> {{rescisao.motivo}}
  </p>

  <p style="margin-top: 40px;">
    Fortaleza, {{formatDate rescisao.data_assinatura}}.
  </p>

  <div class="assinaturas">
    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{proprietario.nome}}</strong><br>Locador(a)</p>
    </div>

    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{locatario.nome}}</strong><br>Locatário(a)</p>
    </div>
  </div>
</body>
</html>',
  '["proprietario.nome", "locatario.nome", "locatario.profissao", "locatario.rg", "locatario.cpf", "imovel.endereco_completo", "rescisao.data_entrega_chaves", "rescisao.valor_abatimento", "rescisao.debitos_pendentes", "rescisao.descricao_debitos", "rescisao.valor_debitos", "rescisao.prazo_quitacao", "rescisao.clausula_final", "rescisao.motivo", "rescisao.data_assinatura"]'::jsonb,
  1,
  true
);

-- =====================================================
-- D10: RECIBO DE PAGAMENTO
-- =====================================================
INSERT INTO documento_modelo (tipo, nome, descricao, template, variaveis_esperadas, versao, ativo)
VALUES (
  'D10',
  'Recibo de Pagamento',
  'Comprovante de pagamento de aluguel e encargos',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Recibo de Pagamento</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12pt; margin: 40px; }
    .recibo { border: 3px solid #27ae60; padding: 30px; border-radius: 10px; }
    h1 { text-align: center; color: #27ae60; margin-bottom: 5px; }
    .numero { text-align: center; font-size: 10pt; color: #6c757d; margin-bottom: 30px; }
    .valor-destaque { text-align: center; font-size: 20pt; font-weight: bold; color: #27ae60;
                       background: #d5f4e6; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .info { margin: 15px 0; line-height: 1.8; }
    .assinatura { margin-top: 60px; text-align: center; }
    .linha { border-top: 1px solid #000; width: 350px; margin: 0 auto; }
    strong { font-weight: bold; }
  </style>
</head>
<body>
  <div class="recibo">
    <h1>✓ RECIBO DE PAGAMENTO</h1>
    <p class="numero">Nº {{pagamento.numero_recibo}}</p>

    <div class="valor-destaque">
      {{formatMoney pagamento.valor}}
    </div>

    <div class="info">
      <p>
        Recebi de <strong>{{locatario.nome}}</strong>, CPF <strong>{{formatCPF locatario.cpf}}</strong>,
        a importância acima descrita, referente ao pagamento de:
      </p>

      <p style="margin-left: 20px;">
        <strong>Competência:</strong> {{pagamento.competencia}}<br>
        <strong>Descrição:</strong> {{pagamento.descricao}}<br>
        <strong>Imóvel:</strong> {{imovel.endereco_completo}}<br>
        <strong>Contrato:</strong> {{contrato.numero}}
      </p>

      <p>
        <strong>Forma de Pagamento:</strong> {{pagamento.forma_pagamento}}<br>
        <strong>Data do Pagamento:</strong> {{formatDate pagamento.data}}<br>
        {{#if pagamento.numero_transacao}}
        <strong>Nº Transação:</strong> {{pagamento.numero_transacao}}<br>
        {{/if}}
      </p>

      {{#if pagamento.observacoes}}
      <p>
        <strong>Observações:</strong> {{pagamento.observacoes}}
      </p>
      {{/if}}
    </div>

    <p style="margin-top: 40px;">
      Fortaleza, {{formatDate pagamento.data_emissao}}.
    </p>

    <div class="assinatura">
      <div class="linha"></div>
      <p><strong>{{proprietario.nome}}</strong></p>
      <p>Locador(a) / Recebedor(a)</p>
    </div>

    <p style="text-align: center; margin-top: 40px; font-size: 9pt; color: #6c757d;">
      Este documento tem validade jurídica como comprovante de pagamento
    </p>
  </div>
</body>
</html>',
  '["pagamento.numero_recibo", "pagamento.valor", "locatario.nome", "locatario.cpf", "pagamento.competencia", "pagamento.descricao", "imovel.endereco_completo", "contrato.numero", "pagamento.forma_pagamento", "pagamento.data", "pagamento.numero_transacao", "pagamento.observacoes", "pagamento.data_emissao", "proprietario.nome"]'::jsonb,
  1,
  true
);

-- =====================================================
-- COMENTÁRIOS
-- =====================================================
COMMENT ON TABLE documento_modelo IS 'Templates base para os 10 documentos obrigatórios do sistema';
