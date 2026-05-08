import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Login | Urbanaid Uniworld" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const ownerSignupEnabled = String(import.meta.env.VITE_ALLOW_OWNER_SIGNUP || "").trim().toLowerCase() === "true";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (active) {
          setSessionEmail(session?.user.email ?? "");
        }
      } catch {
        if (active) {
          setSessionEmail("");
        }
      }
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setSessionEmail(session?.user.email ?? "");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });

        if (error) {
          throw error;
        }

        toast.success("Signed in. Opening the owner dashboard.");
        navigate({ to: "/admin" });
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        const { data: claimed, error: claimError } = await supabase.rpc("bootstrap_first_admin");

        if (claimError) {
          throw claimError;
        }

        toast.success(
          claimed
            ? "Owner account created and initial admin access claimed."
            : "Owner account created. Admin access was not granted automatically.",
        );
        navigate({ to: "/admin" });
        return;
      }

      toast.success("Owner account created. Confirm the email if required, then sign in.");
      setMode("signin");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not complete sign-in. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success("Signed out.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not sign out.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <section className="site-shell max-w-md py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <span className="mb-4 inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Owner access
          </span>
          <h1 className="mb-2 text-3xl font-bold">Owner Login</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in with your Supabase owner account to open the private lead dashboard.
          </p>

          {sessionEmail ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-secondary/35 p-4 text-sm text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{sessionEmail}</span>.
              </div>
              <Link
                to="/admin"
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Open Owner Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-4 py-3 font-semibold text-foreground transition hover:bg-secondary/50 disabled:opacity-60"
              >
                {loading ? "Working..." : "Sign Out"}
              </button>
            </div>
          ) : (
            <>
              {ownerSignupEnabled && (
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border bg-background p-1">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Create Owner
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoComplete="email"
                    required
                    placeholder="owner@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    minLength={8}
                    required
                    placeholder="Minimum 8 characters"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Working..." : mode === "signup" ? "Create Owner Account" : "Sign In"}
                </button>
              </form>
            </>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Public visitors should use the{" "}
            <Link to="/contact" className="text-primary underline-offset-4 hover:underline">
              contact form
            </Link>
            .
          </p>
          {!ownerSignupEnabled && !sessionEmail && (
            <p className="mt-3 text-xs text-muted-foreground">
              Create the owner user in Supabase Auth first, or temporarily set <code>VITE_ALLOW_OWNER_SIGNUP=true</code> to enable self-service setup.
            </p>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
