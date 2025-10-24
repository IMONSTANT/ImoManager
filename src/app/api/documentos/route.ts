/**
 * GET /api/documentos
 * Lista documentos gerados com filtros
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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

    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get('tipo');
    const status = searchParams.get('status');
    const contrato_id = searchParams.get('contrato_id');
    const locatario_id = searchParams.get('locatario_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Monta query
    let query = supabase
      .from('documento_instancia')
      .select(`
        *,
        modelo:modelo_id (
          tipo,
          nome,
          versao
        ),
        contrato:contrato_id (
          numero_contrato,
          valor
        ),
        locatario:locatario_id (
          pessoa:pessoa_id (
            nome,
            cpf_cnpj
          )
        ),
        assinaturas:assinatura (
          count
        )
      `, { count: 'exact' })
      .order('criado_em', { ascending: false });

    // Aplica filtros
    if (tipo) {
      query = query.eq('tipo', tipo as any);
    }
    if (status) {
      query = query.eq('status', status as any);
    }
    if (contrato_id) {
      query = query.eq('contrato_id', parseInt(contrato_id));
    }
    if (locatario_id) {
      query = query.eq('locatario_id', parseInt(locatario_id));
    }

    // Paginação
    query = query.range(offset, offset + limit - 1);

    const { data: documentos, error, count } = await query;

    if (error) {
      console.error('Erro ao buscar documentos:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar documentos' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documentos: documentos || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Erro ao listar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar documentos' },
      { status: 500 }
    );
  }
}
