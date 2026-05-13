import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/supabase/provider";
import { useRole } from "@/lib/role-context";

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useSessionTimeout() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { setRole } = useRole();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      localStorage.removeItem("auth");
      setRole(null);
      await supabase.auth.signOut();
      router.push("/login?reason=timeout");
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    const handler = () => resetTimer();
    
    events.forEach(e => window.addEventListener(e, handler));
    resetTimer();
    
    return () => {
      events.forEach(e => window.removeEventListener(e, handler));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, supabase, setRole]);
}
