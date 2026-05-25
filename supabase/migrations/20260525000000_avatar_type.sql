-- Store human avatar gender in existing avatar_color column ('male' | 'female').
-- Optional: backfill legacy hex color values to a default avatar.
UPDATE public.users
SET avatar_color = 'male'
WHERE avatar_color IS NULL
   OR avatar_color NOT IN ('male', 'female');
