#!/usr/bin/env ts-node
/**
 * Script para verificar contrato ID 1 em detalhes
 */

async function checkContrato1() {
  const SUPABASE_URL = 'https://cjnwewurzkhyeppuvnco.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjU4NTgsImV4cCI6MjA3Njc0MTg1OH0.m2q9U1BpbY8dlR_h2-14MIwcvxlIiL8f_7rD7bS5fdY';

  try {
    // Busca contrato 1 com todos os relacionamentos
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contrato_locacao?id=eq.1&select=*,imovel:imovel_id(*,endereco:endereco_id(*)),locatario:locatario_id(*,pessoa:pessoa_id(*)),fiador:fiador_id(*,pessoa:pessoa_id(*))`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    const contratos = await response.json();

    console.log('\n📋 CONTRATO ID 1:\n');
    console.log('='.repeat(60));

    if (Array.isArray(contratos) && contratos.length > 0) {
      const contrato = contratos[0];
      console.log('✅ CONTRATO ENCONTRADO!\n');
      console.log(JSON.stringify(contrato, null, 2));
    } else {
      console.log('❌ CONTRATO ID 1 NÃO ENCONTRADO!\n');
      console.log('Resposta:', JSON.stringify(contratos, null, 2));
    }

    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao buscar contrato:', error);
  }
}

checkContrato1();
