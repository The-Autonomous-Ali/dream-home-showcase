import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBackendUrl } from "@/lib/backend";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin | Urbanaid Uniworld" }] }),
});

function Admin() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <span className="mb-4 inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Owner dashboard
          </span>
          <h1 className="mb-3 text-3xl font-bold">Lead dashboard access</h1>
          <p className="mb-6 text-muted-foreground">
            Lead management stays on the secure backend so public visitors cannot access it through the frontend app.
          </p>
          <a
            href={buildBackendUrl("/admin/login")}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Open Secure Lead Dashboard
          </a>
          <p className="mt-4 text-sm text-muted-foreground">
            If you only need the public site, go back to the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              home page
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
