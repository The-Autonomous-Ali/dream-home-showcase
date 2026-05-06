import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { buildBackendUrl } from "@/lib/backend";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Login | Urbanaid Uniworld" }] }),
});

function AuthPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-md px-6 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <span className="mb-4 inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Owner access
          </span>
          <h1 className="mb-2 text-3xl font-bold">Owner Login</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The private lead dashboard is protected by the secure backend, not by the public frontend.
          </p>
          <a
            href={buildBackendUrl("/admin/login")}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Open Secure Admin Login
          </a>
          <p className="mt-4 text-xs text-muted-foreground">
            Public visitors should use the{" "}
            <Link to="/contact" className="text-primary underline-offset-4 hover:underline">
              contact form
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
