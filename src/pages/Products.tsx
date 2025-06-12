import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { categories, filterProductsByCategory } from '../data/products';
import { useNavigate } from 'react-router-dom';
import { Filter, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { Database } from '../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;
        // Ensure category is always an array
        const processedData = (data || []).map(product => ({
          ...product,
          category: Array.isArray(product.category) ? product.category : [product.category]
        }));
        setProducts(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = filterProductsByCategory(products, activeCategory);

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
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">Nos Produits en Bois d'Olivier</h1>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Découvrez notre collection d'objets artisanaux en bois d'olivier, fabriqués à la main dans notre atelier.
              Chaque pièce est unique et possède son propre caractère.
            </p>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-center mb-2">
              <Filter size={18} className="mr-2 text-olive" />
              <h2 className="text-lg font-medium">Filtrer par catégorie</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeCategory === 'All' 
                    ? 'bg-olive text-white' 
                    : 'bg-white hover:bg-olive-light hover:text-white'
                }`}
              >
                Tous les produits
              </button>
              
              {categories.map(category => (
                <button 
                  key={category.id}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeCategory === category.name 
                      ? 'bg-olive text-white' 
                      : 'bg-white hover:bg-olive-light hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-center py-4">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-playfair font-bold mb-6">Intéressé par nos produits ?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Contactez-nous pour plus d'informations sur nos produits en bois d'olivier.
              Notre équipe est à votre disposition pour répondre à toutes vos questions.
            </p>
            <a 
              href="tel:+1234567890" 
              className="inline-flex items-center gap-2 bg-olive text-white px-6 py-3 rounded-full text-lg hover:bg-olive-dark transition-colors"
            >
              <Phone size={24} />
              Appelez-nous maintenant
            </a>
          </div>
        </div>
      </main>
      <Footer />

      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Products;
