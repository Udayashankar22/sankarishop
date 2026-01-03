-- Create enum for jewellery types
CREATE TYPE public.jewellery_type AS ENUM (
  'Gold Ring',
  'Gold Chain',
  'Gold Bangle',
  'Gold Earrings',
  'Gold Necklace',
  'Silver Ring',
  'Silver Chain',
  'Silver Bangle',
  'Diamond Ring',
  'Diamond Necklace',
  'Other'
);

-- Create enum for pawn status
CREATE TYPE public.pawn_status AS ENUM ('Active', 'Redeemed');

-- Create pawn_records table
CREATE TABLE public.pawn_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  pawn_date DATE NOT NULL,
  jewellery_type jewellery_type NOT NULL,
  jewellery_weight DECIMAL(10,2) NOT NULL,
  pawn_amount DECIMAL(12,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  status pawn_status NOT NULL DEFAULT 'Active',
  redeemed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pawn_records ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own pawn records" 
ON public.pawn_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pawn records" 
ON public.pawn_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pawn records" 
ON public.pawn_records 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pawn records" 
ON public.pawn_records 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pawn_records_updated_at
BEFORE UPDATE ON public.pawn_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster searches
CREATE INDEX idx_pawn_records_user_id ON public.pawn_records(user_id);
CREATE INDEX idx_pawn_records_serial_number ON public.pawn_records(serial_number);
CREATE INDEX idx_pawn_records_customer_name ON public.pawn_records(customer_name);
CREATE INDEX idx_pawn_records_phone_number ON public.pawn_records(phone_number);
CREATE INDEX idx_pawn_records_status ON public.pawn_records(status);