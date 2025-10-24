-- Script de diagnóstico para verificar estado da tabela contrato_locacao

-- 1. Verificar colunas da tabela
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'contrato_locacao'
  AND column_name IN ('created_at', 'updated_at', 'criado_em', 'atualizado_em')
ORDER BY column_name;

-- 2. Verificar triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'contrato_locacao'
ORDER BY trigger_name;

-- 3. Verificar função update_updated_at_column
SELECT
  routine_name,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'update_updated_at_column';
