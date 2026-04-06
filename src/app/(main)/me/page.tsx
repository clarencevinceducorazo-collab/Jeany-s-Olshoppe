import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { FacebookLoginButton } from "@/components/facebook-login-button";

export default async function MePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const name = user.user_metadata?.full_name || user.email;
    const avatar = user.user_metadata?.avatar_url;

    return (
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 pt-8 py-16">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-primary mb-5">Your Profile</h2>
          
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 sm:justify-between shadow-sm">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt="Avatar" 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 rounded-full object-cover border border-border shrink-0" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent text-lg font-medium border border-accent/20 shrink-0">
                  {name ? name.substring(0, 2).toUpperCase() : <User className="h-6 w-6" />}
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-primary">{name}</h3>
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto mt-4 sm:mt-0 border-t border-border sm:border-0 pt-4 sm:pt-0">
              <form action={async () => {
                "use server";
                const supabaseAction = await createClient();
                await supabaseAction.auth.signOut();
                redirect('/');
              }} className="w-full sm:w-auto">
                <Button type="submit" className="w-full justify-center text-xs font-medium bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 h-auto px-4 py-2">
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Log Out
                </Button>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-primary mb-5">Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4">
                 <Link href="/saved" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium">My Wishlist</h3>
                    <p className="text-sm text-muted-foreground">View and manage your saved items.</p>
                </Link>
                <Link href="/privacy" className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h3 className="font-medium">Privacy Policy</h3>
                    <p className="text-sm text-muted-foreground">Read our data and privacy information.</p>
                </Link>
            </div>
        </section>
      </div>
    );
  }

  // Not logged in
  return (
    <div className="container mx-auto px-4 py-8 h-[70vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-xs flex flex-col gap-4 text-center">
          <User className="mx-auto h-12 w-12 text-muted-foreground/50 mb-2" />
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-muted-foreground text-sm">
            Log in to manage your wishlist and account.
          </p>
        
        <div className="mt-4 flex flex-col gap-3">
          <Button asChild>
            <Link href="/login">Email Login</Link>
          </Button>
          <FacebookLoginButton />
        </div>
      </div>
    </div>
  );
}
