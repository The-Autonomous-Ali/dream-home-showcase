import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin | Urbanaid Uniworld" }] }),
});

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type DashboardState = "loading" | "signed-out" | "member" | "admin" | "error";

function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Admin() {
  const [dashboardState, setDashboardState] = useState<DashboardState>("loading");
  const [dashboardEmail, setDashboardEmail] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const syncDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setDashboardState("signed-out");
        setDashboardEmail("");
        setLeads([]);
        return;
      }

      setDashboardEmail(session.user.email ?? "");

      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (roleError) {
        throw roleError;
      }

      const isAdmin = (roles ?? []).some((role) => role.role === "admin");

      if (!isAdmin) {
        setDashboardState("member");
        setLeads([]);
        return;
      }

      const { data: leadRows, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadError) {
        throw leadError;
      }

      setDashboardState("admin");
      setLeads(leadRows ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load the owner dashboard.";
      setDashboardState("error");
      setLeads([]);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void syncDashboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncDashboard();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleClaimAdmin = async () => {
    setClaiming(true);

    try {
      const { data, error } = await supabase.rpc("bootstrap_first_admin");

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("Admin access was not granted. An admin may already exist.");
      } else {
        toast.success("Admin access claimed.");
      }

      await syncDashboard();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not claim admin access.";
      toast.error(message);
    } finally {
      setClaiming(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this lead permanently?")) {
      return;
    }

    setDeletingId(leadId);

    try {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);

      if (error) {
        throw error;
      }

      setLeads((current) => current.filter((lead) => lead.id !== leadId));
      toast.success("Lead deleted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete the lead.";
      toast.error(message);
    } finally {
      setDeletingId(null);
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
      <section className="container mx-auto max-w-xl px-6 py-20">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <span className="mb-4 inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Owner dashboard
            </span>
            <h1 className="mb-3 text-3xl font-bold">Lead dashboard</h1>
            <p className="text-muted-foreground">
              Review contact enquiries stored in Supabase and keep access restricted to owner accounts with the admin role.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
              Checking owner session and dashboard access...
            </div>
          ) : dashboardState === "signed-out" ? (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Sign in required</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Use the owner login page before opening the private dashboard.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Open Owner Login
              </Link>
            </div>
          ) : dashboardState === "member" ? (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Account signed in</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{dashboardEmail}</span>.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                This account does not currently have the admin role. If this is the first owner account, you can claim it once.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleClaimAdmin}
                  disabled={claiming}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {claiming ? "Claiming..." : "Claim First Admin Access"}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-secondary/50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : dashboardState === "admin" ? (
            <>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Signed in as</div>
                    <div className="font-semibold">{dashboardEmail}</div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void syncDashboard()}
                      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
                    >
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Total enquiries</div>
                  <div className="mt-2 text-3xl font-bold">{leads.length}</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Latest enquiry</div>
                  <div className="mt-2 text-sm font-semibold">
                    {leads[0] ? formatLeadDate(leads[0].created_at) : "No enquiries yet"}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {leads.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
                  No enquiries have been submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold">{lead.name}</div>
                          <a href={`tel:${lead.mobile}`} className="mt-1 inline-block text-sm text-primary hover:underline">
                            {lead.mobile}
                          </a>
                          <div className="mt-2 text-xs text-muted-foreground">{formatLeadDate(lead.created_at)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteLead(lead.id)}
                          disabled={deletingId === lead.id}
                          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50 disabled:opacity-60"
                        >
                          {deletingId === lead.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Dashboard unavailable</h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "The owner dashboard could not be loaded right now. Check the Supabase configuration and try again."}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            If you only need the public site, go back to the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              home page
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
