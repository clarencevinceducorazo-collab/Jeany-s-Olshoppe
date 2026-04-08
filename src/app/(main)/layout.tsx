import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";
import { getUserRole } from "@/lib/get-user-role";

export const dynamic = 'force-dynamic';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();
  console.log("SERVER evaluates role as:", role);

  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col relative">

      <Header role={role} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <BottomNav role={role} />
    </div>
  );
}
