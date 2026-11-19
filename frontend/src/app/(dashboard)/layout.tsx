import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <div className="mx-auto min-h-screen max-w-md">
        <Header/>
        <main className="px-5 pb-28 pt-6">{children}</main>
        <BottomNav/>
    </div>
   );
}