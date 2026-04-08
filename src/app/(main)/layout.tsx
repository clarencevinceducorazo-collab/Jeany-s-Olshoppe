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
      <div className="absolute top-0 w-full bg-red-600 text-white z-[9999] p-2 text-xs font-mono font-bold text-center">
        DEBUG INFO | EMAIL: {user?.email || "NOT LOGGED IN"} | ROLE: {role === null ? "NULL" : role}
      </div>
      <Header role={role} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <BottomNav role={role} />
    </div>
  );
}
