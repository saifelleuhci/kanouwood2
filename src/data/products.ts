import { Database } from '../types/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export const categories = [
  { id: 'all', name: 'All' }
];

export const filterProductsByCategory = (products: Product[], category: string): Product[] => {
  if (category === 'All') return products;
  return products.filter(product => product.category.includes(category));
};

export const getFeaturedProducts = (products: Product[]): Product[] => {
  return products.filter(product => product.featured);
};
