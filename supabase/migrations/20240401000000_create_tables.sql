-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    description TEXT,
    image TEXT,
    category TEXT,
    price NUMERIC,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_keys table
CREATE TABLE IF NOT EXISTS admin_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    access_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create function to create categories table
CREATE OR REPLACE FUNCTION create_categories_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to create products table
CREATE OR REPLACE FUNCTION create_products_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT,
        description TEXT,
        image TEXT,
        category TEXT,
        price NUMERIC,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now()
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to create admin_keys table
CREATE OR REPLACE FUNCTION create_admin_keys_table()
RETURNS void AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS admin_keys (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        access_key TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
    );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_keys ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON products
    FOR DELETE USING (true);

-- Create policies for categories
CREATE POLICY "Enable read access for all users" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON categories
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON categories
    FOR DELETE USING (true);

-- Create policies for admin_keys
CREATE POLICY "Enable read access for all users" ON admin_keys
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON admin_keys
    FOR INSERT WITH CHECK (true); 