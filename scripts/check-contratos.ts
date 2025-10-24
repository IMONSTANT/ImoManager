#!/usr/bin/env ts-node
/**
 * Script para verificar contratos no Supabase
 */

async function checkContratos() {
  const SUPABASE_URL = 'https://cjnwewurzkhyeppuvnco.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjU4NTgsImV4cCI6MjA3Njc0MTg1OH0.m2q9U1BpbY8dlR_h2-14MIwcvxlIiL8f_7rD7bS5fdY';

  try {
    // Busca contratos
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contrato_locacao?select=id,numero_contrato,valor,locatario_id,imovel_id&order=id.asc&limit=10`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const contratos = await response.json();

    console.log('\n📋 CONTRATOS NO BANCO DE DADOS:\n');
    console.log('='.repeat(60));

    if (Array.isArray(contratos) && contratos.length > 0) {
      console.log(`✅ Total: ${contratos.length} contratos encontrados\n`);
      contratos.forEach((c: any) => {
        console.log(`ID: ${c.id} | Número: ${c.numero_contrato} | Valor: R$ ${c.valor} | Locatário: ${c.locatario_id} | Imóvel: ${c.imovel_id}`);
      });
    } else {
      console.log('❌ NENHUM CONTRATO ENCONTRADO NO BANCO!\n');
      console.log('💡 Você precisa criar contratos de teste via interface web ou seed');
    }

    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao buscar contratos:', error);
  }
}

checkContratos();
