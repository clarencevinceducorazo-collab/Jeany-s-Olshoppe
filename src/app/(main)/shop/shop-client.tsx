'use client';

import { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/product-grid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product, ProductCategory, ProductCondition } from '@/lib/types';
import { CATEGORIES, CONDITIONS } from '@/lib/constants';
import { Search } from 'lucide-react';

interface ShopClientProps {
  initialProducts: Product[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const allProducts = initialProducts;
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [condition, setCondition] = useState<ProductCondition | 'all'>('all');

  const filteredProducts = useMemo(() => {
    return allProducts
      // The PRD says to exclude sold out from *filter* results.
      // If any filter is active, we hide sold-out items.
      .filter(p => {
        const isFiltering = searchTerm || category !== 'all' || condition !== 'all';
        if (isFiltering) {
          return p.stock_qty > 0;
        }
        return true;
      })
      .filter(p => 
        searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
      )
      .filter(p => 
        category !== 'all' ? p.category === category : true
      )
      .filter(p => 
        condition !== 'all' ? p.condition === condition : true
      );
  }, [allProducts, searchTerm, category, condition]);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="text-left mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop All</h1>
        <p className="text-muted-foreground mt-2">Find your next treasure from our full collection.</p>
      </div>

      <div className="mb-8 p-4 bg-card rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="relative md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Keyword</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform mt-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
            <Select value={category} onValueChange={(value) => setCategory(value as ProductCategory | 'all')}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-muted-foreground mb-1">Condition</label>
             <Select value={condition} onValueChange={(value) => setCondition(value as ProductCondition | 'all')}>
              <SelectTrigger id="condition">
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Condition</SelectItem>
                {CONDITIONS.map(con => <SelectItem key={con} value={con}>{con}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  );
}
