import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import aerial from "@/assets/site-aerial-3.jpeg";
import { BadgeCheck, Building2, Shield, Sparkles, Trees } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About | Urbanaid Uniworld" },
      {
        name: "description",
        content: "Learn about Urbanaid Uniworld, a premium row house community by Urbanaid Infratech.",
      },
    ],
  }),
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              About the project
            </span>
            <h1 className="mb-6 text-5xl font-bold">Built for families who want more space, privacy, and character.</h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Urbanaid Uniworld is a premium gated community of independent row houses, developed by Urbanaid Infratech Pvt. Ltd.
              It is designed around strong facades, practical layouts, and a calmer neighborhood feel.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Building2, text: "Independent row houses with multiple configurations" },
                { icon: Shield, text: "Controlled entry, CCTV, and private community access" },
                { icon: Trees, text: "Wide internal roads and landscaped green pockets" },
                { icon: Sparkles, text: "Premium interiors designed for everyday comfort" },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Book a Visit
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-secondary/50"
              >
                View Gallery
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-elegant)]">
            <img src={aerial} alt="Aerial view of Urbanaid Uniworld" className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            "Designed for long-term family living, not short-term rental turnover.",
            "Focus on natural light, broader circulation, and a calmer street feel.",
            "Lead capture is handled through the secure backend contact flow.",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
