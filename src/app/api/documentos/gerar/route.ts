/**
 * POST /api/documentos/gerar
 * Gera documento a partir de dados
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DocumentoService } from '@/lib/services/DocumentoService';
import { getTemplate } from '@/lib/templates';
import type { DocumentoTipo, GerarDocumentoInput } from '@/lib/types/documento';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verifica autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Parse do body
    const body = await request.json();
    const {
      tipo,
      contrato_id,
      locatario_id,
      fiador_id,
      imovel_id,
      parcela_id,
      dados_customizados,
      requer_assinatura = false,
      prazo_assinatura_dias = 30,
      assinatura_provider = 'manual'
    } = body as {
      tipo: DocumentoTipo;
      contrato_id?: number;
      locatario_id?: number;
      fiador_id?: number;
      imovel_id?: number;
      parcela_id?: number;
      dados_customizados?: Record<string, any>;
      requer_assinatura?: boolean;
      prazo_assinatura_dias?: number;
      assinatura_provider?: string;
    };

    if (!tipo) {
      return NextResponse.json(
        { error: 'Tipo de documento é obrigatório' },
        { status: 400 }
      );
    }

    // Busca template ativo
    const { data: modelos, error: modeloError } = await supabase
      .from('documento_modelo')
      .select('*')
      .eq('tipo', tipo)
      .eq('ativo', true)
      .order('versao', { ascending: false })
      .limit(1);

    if (modeloError || !modelos || modelos.length === 0) {
      return NextResponse.json(
        { error: 'Template não encontrado para este tipo de documento' },
        { status: 404 }
      );
    }

    const modelo = modelos[0];

    // Busca dados do banco conforme tipo de documento
    let dados_documento: Record<string, any> = {};

    // Se dados customizados foram fornecidos, usa eles
    if (dados_customizados) {
      dados_documento = dados_customizados;
    } else {
      // Busca dados do banco baseado nos IDs fornecidos
      const dadosBuscados = await buscarDadosDocumento({
        supabase,
        tipo,
        contrato_id,
        locatario_id,
        fiador_id,
        imovel_id,
        parcela_id
      });

      if (!dadosBuscados) {
        return NextResponse.json(
          { error: 'Dados insuficientes para gerar o documento' },
          { status: 400 }
        );
      }

      dados_documento = dadosBuscados;
    }

    // Adiciona data de emissão/geração
    dados_documento.data_emissao = new Date().toISOString().split('T')[0];
    dados_documento.data_geracao = new Date().toISOString().split('T')[0];

    // Gera o documento usando o service
    const input: GerarDocumentoInput = {
      modelo_id: modelo.id,
      tipo,
      dados_documento,
      contrato_id,
      locatario_id,
      fiador_id,
      imovel_id,
      parcela_id,
      requer_assinatura,
      prazo_assinatura_dias,
      assinatura_provider: assinatura_provider as any,
      gerado_por: user.id
    };

    const documentoGerado = await DocumentoService.gerarDocumento(input, modelo as any);

    // Gera número de documento
    const { data: numeroData } = await supabase
      .rpc('gerar_numero_documento', { p_tipo: tipo });

    if (numeroData) {
      documentoGerado.numero_documento = numeroData;
    }

    // Salva no banco
    const { data: documentoSalvo, error: saveError } = await supabase
      .from('documento_instancia')
      .insert({
        modelo_id: documentoGerado.modelo_id,
        numero_documento: documentoGerado.numero_documento,
        tipo: documentoGerado.tipo,
        status: 'gerado' as any,
        contrato_id: documentoGerado.contrato_id || null,
        parcela_id: documentoGerado.parcela_id || null,
        locatario_id: documentoGerado.locatario_id || null,
        fiador_id: documentoGerado.fiador_id || null,
        imovel_id: documentoGerado.imovel_id || null,
        dados_documento: documentoGerado.dados_documento,
        conteudo_html: documentoGerado.conteudo_html,
        requer_assinatura: documentoGerado.requer_assinatura,
        prazo_assinatura_dias: documentoGerado.prazo_assinatura_dias || null,
        data_limite_assinatura: documentoGerado.data_limite_assinatura?.toISOString() || null,
        assinatura_provider: documentoGerado.assinatura_provider || null,
        observacoes: documentoGerado.observacoes || null,
        gerado_por: documentoGerado.gerado_por,
        gerado_em: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erro ao salvar documento:', saveError);
      return NextResponse.json(
        { error: 'Erro ao salvar documento no banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documento: documentoSalvo
    });

  } catch (error) {
    console.error('Erro ao gerar documento:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar documento' },
      { status: 500 }
    );
  }
}

/**
 * Busca dados necessários para gerar o documento
 */
async function buscarDadosDocumento({
  supabase,
  tipo,
  contrato_id,
  locatario_id,
  fiador_id,
  imovel_id,
  parcela_id
}: {
  supabase: any;
  tipo: DocumentoTipo;
  contrato_id?: number;
  locatario_id?: number;
  fiador_id?: number;
  imovel_id?: number;
  parcela_id?: number;
}): Promise<Record<string, any> | null> {

  const dados: Record<string, any> = {};

  try {
    // Busca dados do contrato
    if (contrato_id) {
      const { data: contrato } = await supabase
        .from('contrato_locacao')
        .select(`
          *,
          imovel:imovel_id (
            *,
            endereco:endereco_id (*)
          ),
          locatarios:locatario (
            *,
            pessoa:pessoa_id (*)
          ),
          fiadores:fiador (
            *,
            pessoa:pessoa_id (*)
          )
        `)
        .eq('id', contrato_id)
        .single();

      if (contrato) {
        dados.contrato = {
          numero: contrato.numero_contrato,
          data_inicio: contrato.data_inicio,
          data_fim: contrato.data_fim,
          valor: parseFloat(contrato.valor),
          dia_vencimento: contrato.dia_vencimento,
          indice_reajuste: contrato.indice_reajuste || 'IGPM',
          prazo_meses: contrato.prazo_meses,
          tipo_garantia: contrato.tipo_garantia
        };

        if (contrato.imovel) {
          dados.imovel = {
            tipo: contrato.imovel.tipo,
            endereco: contrato.imovel.endereco,
            endereco_completo: formatarEnderecoCompleto(contrato.imovel.endereco)
          };
        }

        if (contrato.locatarios && contrato.locatarios.length > 0) {
          dados.locatarios = contrato.locatarios.map((loc: any) => ({
            nome: loc.pessoa.nome,
            cpf: loc.pessoa.cpf_cnpj,
            rg: loc.pessoa.rg || '',
            email: loc.pessoa.email,
            telefone: loc.pessoa.telefone,
            nacionalidade: loc.pessoa.nacionalidade || 'Brasileiro(a)',
            estado_civil: loc.pessoa.estado_civil || '',
            profissao: loc.pessoa.profissao || ''
          }));

          // Se só tem um locatário, também disponibiliza como objeto único
          if (dados.locatarios.length === 1) {
            dados.locatario = dados.locatarios[0];
          }
        }

        if (contrato.fiadores && contrato.fiadores.length > 0) {
          const fiadorData = contrato.fiadores[0];
          dados.fiador = {
            nome: fiadorData.pessoa.nome,
            cpf: fiadorData.pessoa.cpf_cnpj,
            rg: fiadorData.pessoa.rg || '',
            email: fiadorData.pessoa.email,
            telefone: fiadorData.pessoa.telefone,
            nacionalidade: fiadorData.pessoa.nacionalidade || 'Brasileiro(a)',
            estado_civil: fiadorData.pessoa.estado_civil || '',
            profissao: fiadorData.pessoa.profissao || ''
          };
        }
      }
    }

    // Busca dados do locatário (se não veio do contrato)
    if (locatario_id && !dados.locatario) {
      const { data: locatario } = await supabase
        .from('locatario')
        .select('*, pessoa:pessoa_id (*)')
        .eq('id', locatario_id)
        .single();

      if (locatario && locatario.pessoa) {
        dados.locatario = {
          nome: locatario.pessoa.nome,
          cpf: locatario.pessoa.cpf_cnpj,
          rg: locatario.pessoa.rg || '',
          email: locatario.pessoa.email,
          telefone: locatario.pessoa.telefone,
          nacionalidade: locatario.pessoa.nacionalidade || 'Brasileiro(a)',
          estado_civil: locatario.pessoa.estado_civil || '',
          profissao: locatario.pessoa.profissao || '',
          renda_mensal: parseFloat(locatario.renda_mensal || '0')
        };
      }
    }

    // Busca dados do fiador (se não veio do contrato)
    if (fiador_id && !dados.fiador) {
      const { data: fiador } = await supabase
        .from('fiador')
        .select('*, pessoa:pessoa_id (*)')
        .eq('id', fiador_id)
        .single();

      if (fiador && fiador.pessoa) {
        dados.fiador = {
          nome: fiador.pessoa.nome,
          cpf: fiador.pessoa.cpf_cnpj,
          rg: fiador.pessoa.rg || '',
          email: fiador.pessoa.email,
          telefone: fiador.pessoa.telefone,
          nacionalidade: fiador.pessoa.nacionalidade || 'Brasileiro(a)',
          estado_civil: fiador.pessoa.estado_civil || '',
          profissao: fiador.pessoa.profissao || '',
          renda_mensal: parseFloat(fiador.renda_mensal || '0')
        };
      }
    }

    // Busca dados do imóvel (se não veio do contrato)
    if (imovel_id && !dados.imovel) {
      const { data: imovel } = await supabase
        .from('imovel')
        .select('*, endereco:endereco_id (*)')
        .eq('id', imovel_id)
        .single();

      if (imovel) {
        dados.imovel = {
          tipo: imovel.tipo,
          endereco: imovel.endereco,
          endereco_completo: formatarEnderecoCompleto(imovel.endereco)
        };
      }
    }

    // Busca dados da parcela (para D8 e D10)
    if (parcela_id) {
      const { data: parcela } = await supabase
        .from('parcela')
        .select('*')
        .eq('id', parcela_id)
        .single();

      if (parcela) {
        const valorTotal = parseFloat(parcela.valor_total || '0');
        const valorPrincipal = parseFloat(parcela.valor || '0');
        const multa = parseFloat(parcela.multa || '0');
        const juros = parseFloat(parcela.juros || '0');

        dados.parcela = {
          competencia: parcela.competencia,
          vencimento: parcela.vencimento,
          valor: valorPrincipal,
          principal: valorPrincipal,
          multa: multa,
          juros: juros,
          valor_total: valorTotal,
          dias_atraso: parcela.dias_atraso || 0,
          status: parcela.status
        };
      }
    }

    // Busca dados do proprietário/locador (mockado por enquanto)
    dados.locador = {
      nome: 'Imonstant Gestão Imobiliária',
      cnpj: '12345678000190',
      endereco_completo: 'Rua Amadeu Furtado, 85, Sala 05, São Gerardo, Fortaleza/CE'
    };

    dados.proprietario = dados.locador;

    return Object.keys(dados).length > 0 ? dados : null;

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return null;
  }
}

function formatarEnderecoCompleto(endereco: any): string {
  if (!endereco) return '';

  const partes = [
    endereco.logradouro,
    endereco.numero,
    endereco.complemento,
    endereco.bairro,
    `${endereco.cidade}/${endereco.estado}`
  ].filter(Boolean);

  return partes.join(', ');
}
