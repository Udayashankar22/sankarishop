-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can create their own pawn records" ON public.pawn_records;
DROP POLICY IF EXISTS "Users can view their own pawn records" ON public.pawn_records;
DROP POLICY IF EXISTS "Users can update their own pawn records" ON public.pawn_records;
DROP POLICY IF EXISTS "Users can delete their own pawn records" ON public.pawn_records;

-- Create permissive policies that allow all operations (since auth is handled in-app)
CREATE POLICY "Allow all select" ON public.pawn_records FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.pawn_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.pawn_records FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.pawn_records FOR DELETE USING (true);