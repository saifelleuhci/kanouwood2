import { supabase } from './supabase';

export async function setupDatabase() {
  try {
    // Check if categories table exists
    const { data: categoriesTable, error: checkCategoriesError } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (checkCategoriesError && checkCategoriesError.code === '42P01') {
      // Table doesn't exist, create it
      const { error: createCategoriesError } = await supabase.rpc('create_categories_table');
      if (createCategoriesError) {
        console.error('Error creating categories table:', createCategoriesError);
        return;
      }
      console.log('Categories table created successfully');
    }

    // Check if products table exists
    const { data: productsTable, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      // Create products table
      const { error: createProductsError } = await supabase.rpc('create_products_table');
      if (createProductsError) throw createProductsError;
    }

    // Check if admin_keys table exists
    const { data: adminKeysTable, error: adminKeysError } = await supabase
      .from('admin_keys')
      .select('*')
      .limit(1);

    if (adminKeysError) {
      // Create admin_keys table
      const { error: createAdminKeysError } = await supabase.rpc('create_admin_key_table');
      if (createAdminKeysError) throw createAdminKeysError;

      // Check if any admin keys exist
      const { data: adminKeys, error: checkAdminKeysError } = await supabase
        .from('admin_keys')
        .select('*');

      if (checkAdminKeysError) throw checkAdminKeysError;

      if (!adminKeys || adminKeys.length === 0) {
        // Create default admin key
        const { error: insertAdminKeyError } = await supabase
          .from('admin_keys')
          .insert([{ access_key: 'admin123' }]);

        if (insertAdminKeyError) throw insertAdminKeyError;
      }
    }

    // Check if details table exists
    const { data: detailsTable, error: detailsError } = await supabase
      .from('details')
      .select('*')
      .limit(1);

    if (detailsError) {
      // Create details table
      const { error: createDetailsError } = await supabase.rpc('create_details_table');
      if (createDetailsError) throw createDetailsError;

      // Insert default details
      const { error: insertDetailsError } = await supabase
        .from('details')
        .insert([{
          phone_number: '+216 96 794 242',
          catalog_url: '/CATALOGUE SOCRATE WOOD.pdf',
          hero_images: [
            '/files/WhatsApp Image 2025-06-07 at 20.40.28.jpeg',
            '/files/WhatsApp Image 2025-06-07 at 20.40.31.jpeg',
            '/files/logo.jpeg'
          ]
        }]);

      if (insertDetailsError) throw insertDetailsError;
    }

    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Create the details table function
const createDetailsTableSQL = `
  CREATE OR REPLACE FUNCTION create_details_table()
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    CREATE TABLE IF NOT EXISTS details (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      phone_number TEXT NOT NULL,
      catalog_url TEXT NOT NULL,
      hero_images TEXT[] NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
    );

    -- Enable RLS
    ALTER TABLE details ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Details are viewable by everyone" ON details
      FOR SELECT USING (true);

    CREATE POLICY "Details are editable by authenticated users" ON details
      FOR ALL USING (auth.role() = 'authenticated');
  END;
  $$;
`; 