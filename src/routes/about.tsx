import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import aerial from "@/assets/site-aerial-3.jpeg";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Urbanaid Uniworld" },
      { name: "description", content: "Learn about Urbanaid Uniworld, a premium row house community by Urbanaid Infratech." },
    ],
  }),
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-6 py-16 max-w-5xl">
        <h1 className="text-5xl font-bold mb-6">About the Project</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Urbanaid Uniworld is a premium gated community of independent row houses, developed by Urbanaid Infratech Pvt. Ltd. Designed for families who appreciate craftsmanship and privacy, every home blends timeless sandstone architecture with modern interior comfort.
        </p>
        <img src={aerial} alt="Aerial view of Urbanaid Uniworld" className="rounded-2xl shadow-[var(--shadow-elegant)] w-full mb-10" />
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-muted-foreground">To build communities that feel like home from the very first step. Wide internal roads, landscaped greens, and homes that stand the test of time.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Specifications</h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside">
              <li>Independent row houses, multiple configurations</li>
              <li>Hand-carved sandstone facades</li>
              <li>Premium wooden joinery and modular kitchens</li>
              <li>Gated entry, 24/7 security, CCTV</li>
              <li>Wide tree-lined internal roads</li>
            </ul>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
