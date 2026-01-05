-- Fix insert failures for local-login mode by removing auth.users dependency
ALTER TABLE public.pawn_records
  DROP CONSTRAINT IF EXISTS pawn_records_user_id_fkey;

-- Store the shop "user" identifier as plain text (since we are not using backend auth)
ALTER TABLE public.pawn_records
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- Allow fully custom jewellery types
ALTER TABLE public.pawn_records
  ALTER COLUMN jewellery_type TYPE text USING jewellery_type::text;