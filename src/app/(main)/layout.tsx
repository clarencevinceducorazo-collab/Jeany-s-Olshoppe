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
      <main className="flex-1">{children}</main>
      <div className="h-16 md:hidden" /> {/* Spacer for bottom nav */}
      <BottomNav />
    </div>
  );
}
