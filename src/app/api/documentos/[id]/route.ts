/**
 * GET /api/documentos/[id]
 * Busca documento gerado por ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verifica autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Busca documento com relacionamentos
    const { data: documento, error } = await supabase
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
          pessoa_view:pessoa_id (
            nome,
            cpf_cnpj,
            email
          )
        ),
        assinaturas:assinatura (
          *,
          pessoa_view:pessoa_id (
            nome,
            cpf_cnpj,
            email
          )
        )
      `)
      .eq('id', parseInt(id))
      .single();

    if (error || !documento) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      documento
    });

  } catch (error) {
    console.error('Erro ao buscar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar documento' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/documentos/[id]
 * Atualiza status ou observações do documento
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verifica autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, observacoes, pdf_url, pdf_storage_path } = body;

    const updates: any = {};
    if (status) updates.status = status;
    if (observacoes !== undefined) updates.observacoes = observacoes;
    if (pdf_url) updates.pdf_url = pdf_url;
    if (pdf_storage_path) updates.pdf_storage_path = pdf_storage_path;

    const { data: documento, error } = await supabase
      .from('documento_instancia')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao atualizar documento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documento
    });

  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documentos/[id]
 * Cancela documento (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verifica autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { motivo } = body;

    const { data: documento, error } = await supabase
      .from('documento_instancia')
      .update({
        status: 'cancelado',
        cancelado_em: new Date().toISOString(),
        cancelado_por: user.id,
        motivo_cancelamento: motivo || 'Cancelado pelo usuário'
      })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao cancelar documento' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      documento
    });

  } catch (error) {
    console.error('Erro ao cancelar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao cancelar documento' },
      { status: 500 }
    );
  }
}
