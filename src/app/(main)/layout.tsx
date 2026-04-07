import { BottomNav } from "@/components/bottom-nav";
import { Header } from "@/components/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  );
}
