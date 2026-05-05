"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { VoucherTable } from "@/components/VoucherTable";
import { getVouchers } from "@/lib/voucher-actions";
import { Voucher } from "@/lib/types";
import { Loader2, PlusCircle, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      fetchVouchers();
    }
  }, [router]);

  async function fetchVouchers() {
    setLoading(true);
    const data = await getVouchers();
    setVouchers(data);
    setLoading(false);
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black font-headline text-foreground flex items-center gap-3">
              <LayoutDashboard className="text-primary w-8 h-8" />
              Voucher History
            </h1>
            <p className="text-muted-foreground mt-1">Manage and track all Tropical Holidays payments</p>
          </div>
          <Link href="/vouchers/new">
            <Button className="bg-primary hover:bg-primary/90 shadow-md">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Voucher
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground animate-pulse">Loading secure ledger...</p>
          </div>
        ) : (
          <VoucherTable vouchers={vouchers} />
        )}
      </main>
    </div>
  );
}
