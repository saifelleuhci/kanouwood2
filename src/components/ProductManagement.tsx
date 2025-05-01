import { useState } from 'react';
import { categories } from '@/data/products';
import type { Product } from '@/types/database.types';
import { Folder, PlusCircle, Edit2, Trash2 } from 'lucide-react';

type ProductFormData = {
  name: string;
  category: string;
  image: string;
  description: string;
  price: number;
  featured: boolean;
};

type ProductManagementProps = {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
};

const ProductManagement = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: ProductManagementProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: 'kitchen',
    image: '',
    description: '',
    price: 0,
    featured: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          image: formData.image,
          description: formData.description,
          price: formData.price,
          featured: formData.featured,
        });
      } else {
        await onAddProduct({
          name: formData.name,
          category: formData.category,
          image: formData.image,
          description: formData.description,
          price: formData.price,
          featured: formData.featured,
        });
      }

      setFormData({
        name: '',
        category: 'kitchen',
        image: '',
        description: '',
        price: 0,
        featured: false,
      });
      setEditingProduct(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      image: product.image,
      description: product.description,
      price: product.price,
      featured: product.featured,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await onDeleteProduct(id);
    }
  };

  return (
    <div className="bg-earth-light p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-playfair text-olive-dark">Gestion des Produits</h3>
        <button 
          className="flex items-center gap-2 bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-full transition-colors"
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              category: 'kitchen',
              image: '',
              description: '',
              price: 0,
              featured: false,
            });
            setIsFormOpen(!isFormOpen);
          }}
        >
          <PlusCircle size={20} />
          <span>{isFormOpen ? 'Fermer' : 'Ajouter un produit'}</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nom du produit</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-1">URL de l'image</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">Prix</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="featured" className="text-sm font-medium">Produit en vedette</label>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md h-40"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              type="button" 
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: '',
                  category: 'kitchen',
                  image: '',
                  description: '',
                  price: 0,
                  featured: false,
                });
                setIsFormOpen(false);
              }}
              className="mr-4 px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
            >
              {editingProduct ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Folder size={20} className="text-olive" />
            <h4 className="font-medium">Catégories</h4>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <div key={category.id} className="bg-white px-3 py-1 rounded-full text-sm border border-olive">
                {category.name} ({products.filter(p => p.category === category.id).length})
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Aperçu des produits ({products.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.slice(0, 8).map(product => (
              <div key={product.id} className="bg-white p-2 rounded-md shadow-sm relative group">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{categories.find(c => c.id === product.category)?.name}</p>
                <p className="text-sm font-medium text-olive">€{product.price.toFixed(2)}</p>
                {product.featured && (
                  <span className="absolute top-2 left-2 bg-olive text-white text-xs px-2 py-1 rounded-full">
                    Vedette
                  </span>
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Edit2 size={16} className="text-olive" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
