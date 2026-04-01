import type { Product } from '@/lib/types';
import data from './placeholder-images.json';

// This is a temporary function to simulate fetching products from a database.
// It will be replaced by actual Supabase calls.

const products: Product[] = (data.placeholderImages as any[]).map(p => ({
  ...p,
  // ensure images are correctly formatted, since the json doesn't have real URLs
  images: p.images.map((_: any, i:number) => `https://picsum.photos/seed/${p.id.slice(-4)}${i}/800/800`),
  imageHint: p.imageHint,
}));

export const getProducts = (options?: { featured?: boolean; limit?: number }): Product[] => {
  let filteredProducts = products.filter(p => !p.is_archived);
  
  if (options?.featured) {
    filteredProducts = filteredProducts.filter(p => p.is_featured);
  }

  if (options?.limit) {
    return filteredProducts.slice(0, options.limit);
  }

  return filteredProducts;
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id && !p.is_archived);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category && !p.is_archived);
};
