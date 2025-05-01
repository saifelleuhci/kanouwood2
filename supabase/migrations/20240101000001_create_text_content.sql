-- Create text_content table
CREATE TABLE IF NOT EXISTS public.text_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_text_content_section ON public.text_content(section);

-- Enable Row Level Security
ALTER TABLE public.text_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.text_content
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.text_content
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON public.text_content
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON public.text_content
    FOR DELETE
    TO authenticated
    USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_text_content_updated_at
    BEFORE UPDATE ON public.text_content
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 