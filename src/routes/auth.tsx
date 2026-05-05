import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Login — Urbanaid Uniworld" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "login" ? supabase.auth.signInWithPassword({ email, password }) : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    const { error } = await fn;
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mode === "login" ? "Welcome back" : "Account created");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <section className="container mx-auto px-6 py-20 max-w-md">
        <div className="p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)]">
          <h1 className="text-3xl font-bold mb-2">Admin {mode === "login" ? "Login" : "Sign Up"}</h1>
          <p className="text-sm text-muted-foreground mb-6">Restricted area for site owners.</p>
          <form onSubmit={submit} className="space-y-4">
            <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
            <input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm" />
            <button disabled={loading} className="w-full rounded-md bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
              {loading ? "Please wait…" : mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="mt-4 text-sm text-primary hover:underline w-full text-center">
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Login"}
          </button>
        </div>
      </section>
    </div>
  );
}
