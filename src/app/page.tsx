"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { VoucherTable } from "@/components/VoucherTable";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black font-headline text-foreground flex items-center gap-3">
              <LayoutDashboard className="text-primary w-8 h-8" />
              Secure Ledger
            </h1>
            <p className="text-muted-foreground mt-1">Manage multiple holiday payment sheets with real-time sync</p>
          </div>
          <Link href="/vouchers/new">
            <Button className="bg-primary hover:bg-primary/90 shadow-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Voucher
            </Button>
          </Link>
        </div>

        <VoucherTable />
      </main>
    </div>
  );
}
