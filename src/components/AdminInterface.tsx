import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../lib/supabase";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Product } from '../data/products';

export const AdminInterface: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<{ name: string }>({
    name: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    if (!session) {
      localStorage.removeItem("admin-authenticated");
      navigate("/admin-auth");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw err;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in first');
      return;
    }

    try {
      if (!imageFile) {
        setError('Please select an image file');
        return;
      }

      // Upload the image file
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      console.log('Image upload result:', uploadData, uploadError);
      if (uploadError) throw uploadError;

      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      console.log('Get public URL result:', publicUrlData, publicUrlError);
      if (publicUrlError) throw publicUrlError;

      const imageUrl = publicUrlData.publicUrl;
      if (!imageUrl) {
        setError('Failed to get public URL for uploaded image');
        return;
      }

      const { data: insertData, error: insertError } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          image: imageUrl,
        }]);
      console.log('Insert result:', insertData, insertError);

      if (insertError) throw insertError;

      setNewProduct({ name: '' });
      setImageFile(null);
      fetchProducts();
    } catch (err: any) {
      console.error('Add product error:', err);
      setError(err?.message || JSON.stringify(err) || 'Failed to add product');
    }
  };


  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      if (!isAuthenticated) {
        throw new Error('Not authenticated');
      }

      let imageUrl = updates.image;
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      const { error } = await supabase
        .from('products')
        .update({ ...updates, image: imageUrl })
        .eq('id', id);

      if (error) throw error;

      setProducts(products.map(product =>
        product.id === id ? { ...product, ...updates, image: imageUrl } : product
      ));
      setImageFile(null);
    } catch (err) {
      setError('Failed to update product');
      console.error('Error updating product:', err);
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

      if (error) throw error;

      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin-authenticated");
    navigate("/admin-auth");
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the admin interface.</div>;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold">Administration</h1>
            <div className="flex gap-4">
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? "Cancel" : "Add New Product"}
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>

          {showAddForm && (
            <Card className="mb-10">
              <CardContent className="pt-6">
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageFile">Product Image</Label>
                    <input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                        }
                      }}
                      className="p-2 border rounded"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Product</Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="p-4">
                  <CardContent>
                    <div className="relative aspect-square">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between">
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}; 