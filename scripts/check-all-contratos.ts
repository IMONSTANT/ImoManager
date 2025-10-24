#!/usr/bin/env ts-node
/**
 * Script para listar TODOS os contratos sem filtros
 */

async function checkAllContratos() {
  const SUPABASE_URL = 'https://cjnwewurzkhyeppuvnco.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjU4NTgsImV4cCI6MjA3Njc0MTg1OH0.m2q9U1BpbY8dlR_h2-14MIwcvxlIiL8f_7rD7bS5fdY';

  try {
    // Busca TODOS os contratos sem filtros
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contrato_locacao?select=id,numero_contrato,valor,data_inicio_contrato,locatario_id,fiador_id,imovel_id`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const text = await response.text();
    console.log('\n📋 RESPOSTA RAW DO SUPABASE:\n');
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    console.log('Body:', text);
    console.log('\n');

    const contratos = JSON.parse(text);

    console.log('='.repeat(60));

    if (Array.isArray(contratos)) {
      console.log(`✅ Total: ${contratos.length} contratos encontrados\n`);
      contratos.forEach((c: any) => {
        console.log(`ID: ${c.id} | Número: ${c.numero_contrato || 'N/A'} | Valor: R$ ${c.valor || 'N/A'}`);
        console.log(`   Locatário ID: ${c.locatario_id || 'N/A'} | Fiador ID: ${c.fiador_id || 'N/A'} | Imóvel ID: ${c.imovel_id || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ Resposta não é um array:', contratos);
    }

    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao buscar contratos:', error);
  }
}

checkAllContratos();
