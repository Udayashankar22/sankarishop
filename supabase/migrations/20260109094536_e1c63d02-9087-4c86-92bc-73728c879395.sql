-- Add paper_loan_interest column (percentage value 0-1)
ALTER TABLE public.pawn_records 
ADD COLUMN paper_loan_interest numeric NOT NULL DEFAULT 0 
CHECK (paper_loan_interest >= 0 AND paper_loan_interest <= 1);