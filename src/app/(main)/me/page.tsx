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
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 pt-8 py-16">
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-[#4a403a] mb-5">Your Profile</h2>
          
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 sm:justify-between shadow-sm">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {avatar ? (
                <Image 
                  src={avatar} 
                  alt="Avatar" 
                  width={48} 
                  height={48} 
                  className="w-12 h-12 rounded-full object-cover border border-[#e5e7eb] shrink-0" 
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#fb7185]/10 flex items-center justify-center text-[#fb7185] text-lg font-medium border border-[#fb7185]/20 shrink-0">
                  {name ? name.substring(0, 2).toUpperCase() : <User className="h-6 w-6" />}
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-[#4a403a]">{name}</h3>
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto mt-2 sm:mt-0 border-t border-[#e5e7eb] sm:border-0 pt-4 sm:pt-0">
              <form action={async () => {
                "use server";
                const supabaseAction = await createClient();
                await supabaseAction.auth.signOut();
                redirect('/');
              }} className="w-full sm:w-auto">
                <button type="submit" className="w-full flex-1 sm:flex-none text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors flex justify-center items-center gap-1.5">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </section>
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
