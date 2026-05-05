
"use client";

import LinkNext from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, LogOut } from "lucide-react";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { ModeToggle } from "@/components/ModeToggle";

export function Navbar() {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("auth");
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <LinkNext href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12">
                <Image 
                  src="/logo.png" 
                  alt="Tropical Holidays Logo" 
                  fill
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
              <span className="font-bold text-xl text-[#E66E38] hidden sm:block">
                Tropical Holidays
              </span>
            </LinkNext>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <LinkNext href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Vouchers</span>
              </Button>
            </LinkNext>
            <LinkNext href="/vouchers/new">
              <Button size="sm" className="bg-[#E66E38] hover:bg-[#E66E38]/90 text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Voucher</span>
              </Button>
            </LinkNext>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
