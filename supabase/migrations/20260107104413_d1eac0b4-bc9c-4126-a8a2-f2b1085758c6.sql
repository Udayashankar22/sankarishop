-- Add storage location columns to pawn_records table
ALTER TABLE public.pawn_records 
ADD COLUMN storage_location TEXT DEFAULT NULL,
ADD COLUMN storage_serial_number TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.pawn_records.storage_location IS 'Storage location: Locker, GRS, or Bank';
COMMENT ON COLUMN public.pawn_records.storage_serial_number IS 'Serial number for GRS or Bank storage (not required for Locker)';