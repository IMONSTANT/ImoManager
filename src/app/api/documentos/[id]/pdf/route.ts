/**
 * POST /api/documentos/[id]/pdf
 * Converte HTML para PDF e retorna como download
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { DocumentoService } from '@/lib/services/DocumentoService';

export async function POST(
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

    // Busca documento
    const { data: documento, error } = await supabase
      .from('documento_instancia')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !documento) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    if (!documento.conteudo_html) {
      return NextResponse.json(
        { error: 'Documento não possui conteúdo HTML gerado' },
        { status: 400 }
      );
    }

    // Gera PDF
    const pdfBuffer = await DocumentoService.htmlParaPdf(documento.conteudo_html);

    // Retorna o PDF como download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${documento.numero_documento}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/documentos/[id]/pdf
 * Visualiza PDF inline no navegador
 */
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

    // Busca documento
    const { data: documento, error } = await supabase
      .from('documento_instancia')
      .select('*')
      .eq('id', parseInt(id))
      .single();

    if (error || !documento) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    if (!documento.conteudo_html) {
      return NextResponse.json(
        { error: 'Documento não possui conteúdo HTML gerado' },
        { status: 400 }
      );
    }

    // Gera PDF
    const pdfBuffer = await DocumentoService.htmlParaPdf(documento.conteudo_html);

    // Retorna o PDF inline para visualização
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${documento.numero_documento}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Erro ao visualizar PDF:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao visualizar PDF' },
      { status: 500 }
    );
  }
}
