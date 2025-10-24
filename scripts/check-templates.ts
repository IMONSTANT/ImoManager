#!/usr/bin/env ts-node
/**
 * Script para verificar templates no Supabase
 */

async function checkTemplates() {
  const SUPABASE_URL = 'https://cjnwewurzkhyeppuvnco.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjU4NTgsImV4cCI6MjA3Njc0MTg1OH0.m2q9U1BpbY8dlR_h2-14MIwcvxlIiL8f_7rD7bS5fdY';

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/documento_modelo?select=tipo,nome,versao,ativo&order=tipo.asc,versao.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    const templates = await response.json();

    console.log('\n📋 TEMPLATES NO BANCO DE DADOS:\n');
    console.log('='.repeat(60));

    if (Array.isArray(templates) && templates.length > 0) {
      console.log(`✅ Total: ${templates.length} templates encontrados\n`);
      templates.forEach((t: any) => {
        console.log(`${t.ativo ? '✅' : '❌'} ${t.tipo} - ${t.nome} (v${t.versao})`);
      });
    } else {
      console.log('❌ NENHUM TEMPLATE ENCONTRADO NO BANCO!\n');
      console.log('💡 Solução: Execute a migration de seed:');
      console.log('   npx supabase db push');
    }

    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao buscar templates:', error);
  }
}

checkTemplates();
