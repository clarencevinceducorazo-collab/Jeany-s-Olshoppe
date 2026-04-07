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

  return (
    <div className="flex min-h-screen flex-col">
      <Header role={role} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <BottomNav role={role} />
    </div>
  );
}
