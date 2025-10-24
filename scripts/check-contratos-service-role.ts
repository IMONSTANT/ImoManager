#!/usr/bin/env ts-node
/**
 * Script para listar contratos usando SERVICE_ROLE key (bypass RLS)
 */

async function checkContratosServiceRole() {
  const SUPABASE_URL = 'https://cjnwewurzkhyeppuvnco.supabase.co';
  const SUPABASE_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqbndld3VyemtoeWVwcHV2bmNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE2NTg1OCwiZXhwIjoyMDc2NzQxODU4fQ.DX7Wqn3RTNgIjIbWNp4Qj5TVNlDzyXR_vVOPGRacJgA';

  try {
    console.log('\n🔑 Usando SERVICE_ROLE key (bypass RLS)...\n');

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contrato_locacao?select=id,numero_contrato,valor,data_inicio_contrato,locatario_id,fiador_id,imovel_id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE}`,
          'Accept': 'application/json'
        }
      }
    );

    const contratos = await response.json();

    console.log('='.repeat(60));

    if (Array.isArray(contratos) && contratos.length > 0) {
      console.log(`✅ Total: ${contratos.length} contratos encontrados\n`);
      contratos.forEach((c: any) => {
        console.log(`ID: ${c.id} | Número: ${c.numero_contrato || 'N/A'} | Valor: R$ ${c.valor || 'N/A'}`);
        console.log(`   Locatário ID: ${c.locatario_id || 'N/A'} | Fiador ID: ${c.fiador_id || 'N/A'} | Imóvel ID: ${c.imovel_id || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum contrato encontrado (array vazio)\n');
      console.log('Você precisa criar contratos via interface web primeiro.');
    }

    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Erro ao buscar contratos:', error);
  }
}

checkContratosServiceRole();
