-- ==========================================================================
-- Migration: Make update_updated_at_column resilient
-- Description: Replace the generic update trigger function so it safely
-- updates either 'atualizado_em' or 'updated_at' if present, avoiding
-- runtime errors when a table has one name but not the other.
-- Date: 2025-10-24
-- ==========================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to set Portuguese column name if it exists; ignore undefined column error
  BEGIN
    NEW.atualizado_em := NOW();
  EXCEPTION WHEN undefined_column THEN
    -- ignore if column doesn't exist on this table
    NULL;
  END;

  -- Try to set English column name if it exists; ignore undefined column error
  BEGIN
    NEW.updated_at := NOW();
  EXCEPTION WHEN undefined_column THEN
    NULL;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column IS 'Resilient trigger: updates atualizado_em or updated_at when present';
