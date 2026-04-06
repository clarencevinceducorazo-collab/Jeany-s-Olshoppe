import { ProductGrid } from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/lib/placeholder-images";
import { Heart } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  // This would be fetched from the database based on the user's wishlist.
  const savedProducts = getProducts({ limit: 2 }); 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Your Saved Items</h1>
        <p className="text-muted-foreground mt-2">The treasures you're keeping an eye on.</p>
      </div>

      {isLoggedIn ? (
        <ProductGrid products={savedProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-card border rounded-lg">
          <Heart className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold">Log in to see your saved items</h2>
          <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
            Create an account or log in to save your favorite finds and get restock notifications.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
