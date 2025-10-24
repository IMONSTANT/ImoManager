/**
 * GET /api/documentos/templates
 * Lista templates disponíveis
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { TEMPLATES } from '@/lib/templates';

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

    // Busca templates ativos do banco
    const { data: modelosBanco, error } = await supabase
      .from('documento_modelo')
      .select('*')
      .eq('ativo', true)
      .order('tipo');

    if (error) {
      console.error('Erro ao buscar templates:', error);
    }

    // Combina com templates hardcoded
    const templates = Object.entries(TEMPLATES).map(([tipo, config]) => {
      // Tenta encontrar o modelo correspondente no banco
      const modeloBanco = modelosBanco?.find(m => m.tipo === tipo);

      return {
        tipo,
        nome: config.nome,
        descricao: config.descricao,
        variaveis_esperadas: config.variaveis_esperadas,
        template_id: modeloBanco?.id,
        versao: modeloBanco?.versao || 1,
        ativo: modeloBanco?.ativo !== false
      };
    });

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Erro ao listar templates:', error);
    return NextResponse.json(
      { error: 'Erro ao listar templates' },
      { status: 500 }
    );
  }
}
