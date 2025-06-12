import { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ProductManagement from '@/components/ProductManagement';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types/database.types';

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      setIsAuthenticated(!!session);
    } catch (err) {
      console.error('Error checking auth:', err);
      setError('Failed to check authentication status');
    }
  };

  const handleAuth = async (password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@oliviawood.com',
        password: password
      });

      if (error) throw error;
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error authenticating:', err);
      setError('Invalid credentials');
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      setProducts(data || []);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      // Validate required fields
      if (!product.name || !product.image) {
        throw new Error('Name and image are required');
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          price: product.price || 0,
          image: product.image,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
      
      if (data) {
        setProducts([data, ...products]);
      }
    } catch (err) {
      console.error('Error in handleAddProduct:', err);
      setError(err instanceof Error ? err.message : 'Failed to add product');
      throw err;
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'created_at'>>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          price: updates.price,
          image: updates.image,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      if (data) {
        setProducts(products.map(p => p.id === id ? data : p));
      }
    } catch (err) {
      console.error('Error in handleUpdateProduct:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error in handleDeleteProduct:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-playfair text-olive-dark mb-6 text-center">Admin Login</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const password = formData.get('password') as string;
            handleAuth(password);
          }} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-olive text-white py-2 px-4 rounded-md hover:bg-olive-dark transition-colors"
            >
              Login
            </button>
            {error && <p className="text-olive text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive mx-auto"></div>
          <p className="mt-4 text-olive-dark">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-olive">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-10 text-center">Administration</h1>
          <ProductManagement 
            products={products} 
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
