-- Verificar estado atual
SELECT 'Colunas da tabela contrato_locacao:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'contrato_locacao'
  AND column_name IN ('created_at', 'updated_at', 'criado_em', 'atualizado_em')
ORDER BY column_name;

SELECT 'Função update_updated_at_column:' as info;
SELECT pg_get_functiondef((
  SELECT oid FROM pg_proc
  WHERE proname = 'update_updated_at_column'
  LIMIT 1
));

SELECT 'Triggers da tabela contrato_locacao:' as info;
SELECT trigger_name, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'contrato_locacao'
ORDER BY trigger_name;
