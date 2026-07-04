import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {/* เว้นที่ด้านล่างให้ bottom nav บนมือถือ */}
        <main className="flex-1 pb-24 lg:pb-8">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
