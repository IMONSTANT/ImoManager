/**
 * Script de Seed para Templates de Documentos (JavaScript)
 * Popula a tabela documento_modelo com os 10 templates
 *
 * Uso:
 * node scripts/seed-templates.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Importa templates (terá que ser ajustado se usar TypeScript)
const { TEMPLATES } = require('../src/lib/templates/index.ts');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente SUPABASE não encontradas!');
  console.error('Certifique-se que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTemplates() {
  console.log('🌱 Iniciando seed de templates de documentos...\n');

  try {
    const templateEntries = Object.entries(TEMPLATES);
    console.log(`📋 ${templateEntries.length} templates encontrados\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const [tipo, config] of templateEntries) {
      console.log(`📄 Processando ${tipo} - ${config.nome}...`);

      try {
        // Verifica se já existe
        const { data: existing } = await supabase
          .from('documento_modelo')
          .select('id, versao')
          .eq('tipo', tipo)
          .eq('ativo', true)
          .single();

        if (existing) {
          console.log(`   ⚠️  Template ${tipo} já existe (ID: ${existing.id}, versão: ${existing.versao})`);
          console.log(`   ℹ️  Pulando...\n`);
          continue;
        }

        // Insere novo template
        const { data, error } = await supabase
          .from('documento_modelo')
          .insert({
            tipo,
            nome: config.nome,
            descricao: config.descricao,
            template: config.template,
            variaveis_esperadas: config.variaveis_esperadas,
            versao: 1,
            ativo: true,
            data_vigencia_inicio: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        console.log(`   ✅ Template ${tipo} inserido com sucesso! (ID: ${data.id})`);
        console.log(`   📝 ${config.variaveis_esperadas.length} variáveis esperadas\n`);
        successCount++;

      } catch (error) {
        console.error(`   ❌ Erro ao inserir ${tipo}:`, error.message);
        console.error(`      Detalhes:`, error);
        console.log('');
        errorCount++;
      }
    }

    console.log('\n🏁 Seed concluído!');
    console.log(`✅ Sucesso: ${successCount} templates`);
    console.log(`❌ Erros: ${errorCount} templates`);

    if (errorCount === 0) {
      console.log('\n🎉 Todos os templates foram inseridos com sucesso!');
    }

  } catch (error) {
    console.error('❌ Erro fatal durante o seed:', error);
    process.exit(1);
  }
}

// Executa o seed
seedTemplates()
  .then(() => {
    console.log('\n✨ Processo finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal:', error);
    process.exit(1);
  });
