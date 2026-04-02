import { createClient } from "@/lib/supabase/server";
import { FacebookLoginButton } from "@/components/facebook-login-button";
import { Button } from "@/components/ui/button";
import { User, LogOut, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function MePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const name = user.user_metadata?.full_name || user.email;
    const avatar = user.user_metadata?.avatar_url;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg mb-4">
            {avatar ? (
              <Image src={avatar} alt="Profile Photo" width={128} height={128} className="object-cover h-full w-full" />
            ) : (
              <User className="h-full w-full p-4 bg-muted text-muted-foreground" />
            )}
          </div>
          <h1 className="text-3xl font-bold font-headline mb-8">{name}</h1>

          <div className="flex w-full max-w-sm flex-col gap-4">
            <Button asChild size="lg" className="justify-start gap-4" variant="outline">
              <Link href="/saved">
                <Heart className="h-5 w-5" />
                My Wishlist
              </Link>
            </Button>
            
            <form action={async () => {
              "use server";
              const supabaseAction = await createClient();
              await supabaseAction.auth.signOut();
              redirect('/');
            }}>
              <Button type="submit" size="lg" className="w-full justify-start gap-4" variant="destructive">
                <LogOut className="h-5 w-5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  return (
    <div className="container mx-auto px-4 py-8 h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-6 text-center">
        <div className="mb-4">
          <User className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">My Profile</h2>
          <p className="text-muted-foreground text-sm">
            Log in to manage your wishlist and account.
          </p>
        </div>
        
        <FacebookLoginButton />
        
        <Button asChild variant="ghost" className="mt-2 text-muted-foreground">
          <Link href="/">Browse as Guest</Link>
        </Button>
      </div>
    </div>
  );
}
