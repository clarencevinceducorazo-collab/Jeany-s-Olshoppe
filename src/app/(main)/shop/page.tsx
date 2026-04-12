import { createClient } from '@/lib/supabase/server';
import { ShopClient } from './shop-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Find your next treasure from our full collection.',
};

export const revalidate = 0; // ensure shop is always fresh or rely on caching appropriately

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return (
    <ShopClient initialProducts={products || []} />
  );
}
