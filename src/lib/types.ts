export type ProductCategory = 'Clothes' | 'Shoes' | 'Bags' | 'Accessories' | 'Electronics' | 'Others';
export type ProductCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  stock_qty: number;
  images: string[];
  imageHint?: string;
  is_featured: boolean;
  is_archived: boolean;
  created_at: string; // ISO date string
};
