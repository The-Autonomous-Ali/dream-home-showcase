import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import houseFront from "@/assets/house-front.jpeg";
import aerial1 from "@/assets/site-aerial-1.jpeg";
import aerial3 from "@/assets/site-aerial-3.jpeg";
import entrance from "@/assets/site-entrance.jpeg";
import { MapPin, Shield, Sparkles, Trees, Building2, KeySquare } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Urbanaid Uniworld — Premium Row Houses" },
      { name: "description", content: "Premium row houses in a gated community. Elegant facades, modern interiors, ready to move." },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 pt-10 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/30 text-accent-foreground text-xs font-semibold tracking-wide uppercase mb-5">Now Selling · Limited Inventory</span>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
              Where craftsmanship meets <span className="text-primary">modern living</span>.
            </h1>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-[var(--gradient-hero)] rounded-3xl blur-2xl opacity-30" />
            <img src={houseFront} alt="Premium row house facade at Urbanaid Uniworld" className="relative rounded-2xl shadow-[var(--shadow-elegant)] w-full object-cover aspect-[16/10]" />
          </div>
          <div className="max-w-3xl mx-auto text-center mt-10">
            <p className="text-lg text-muted-foreground mb-8">
              Urbanaid Uniworld presents a thoughtfully designed enclave of premium row houses — handcrafted facades, spacious interiors, and a gated community lifestyle.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 shadow-[var(--shadow-elegant)] transition">Book a Site Visit</Link>
              <Link to="/gallery" className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 font-semibold hover:bg-secondary transition">View Gallery</Link>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border">
              <div><div className="text-3xl font-display font-bold text-primary">50+</div><div className="text-xs text-muted-foreground mt-1">Row Houses</div></div>
              <div><div className="text-3xl font-display font-bold text-primary">24/7</div><div className="text-xs text-muted-foreground mt-1">Gated Security</div></div>
              <div><div className="text-3xl font-display font-bold text-primary">Ready</div><div className="text-xs text-muted-foreground mt-1">To Move In</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl font-bold mb-4">A community designed around you</h2>
          <p className="text-muted-foreground">Every detail — from the carved stone facades to the wide internal roads — is built with care.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Building2, title: "Designer Facades", desc: "Hand-carved sandstone elevations that age beautifully." },
            { icon: Shield, title: "Gated & Secure", desc: "24/7 security, controlled access and CCTV coverage." },
            { icon: Trees, title: "Green Boulevards", desc: "Wide tree-lined streets and landscaped pockets." },
            { icon: KeySquare, title: "Ready Possession", desc: "Move into a finished home — no waiting on construction." },
            { icon: Sparkles, title: "Premium Interiors", desc: "Wooden joinery, modular fittings, large windows." },
            { icon: MapPin, title: "Prime Location", desc: "Connected to the city, surrounded by open fields." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-card border border-border hover:shadow-[var(--shadow-soft)] transition">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Showcase strip */}
      <section className="bg-[var(--gradient-warm)] py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-4">
            {[aerial1, entrance, aerial3].map((src, i) => (
              <img key={i} src={src} alt={`Urbanaid Uniworld view ${i + 1}`} className="rounded-xl shadow-[var(--shadow-soft)] w-full h-72 object-cover" />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 transition">Explore Full Gallery</Link>
          </div>
        </div>
      </section>

      {/* Cinematic video */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[70vh] min-h-[480px] w-full">
          <video
            src="/site-flythrough.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold tracking-[0.2em] uppercase mb-6 border border-white/20">
              A Cinematic Walkthrough
            </span>
            <h2 className="font-display text-4xl md:text-7xl font-bold text-white leading-[1.05] max-w-4xl drop-shadow-lg">
              Step inside <span className="text-accent">Urbanaid Uniworld</span>
            </h2>
            <p className="mt-6 max-w-2xl text-white/85 text-base md:text-lg">
              An aerial tour of the community — wide boulevards, grand entrance, and rows of crafted homes.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20">
        <div className="rounded-3xl bg-[var(--gradient-hero)] p-12 md:p-16 text-center text-primary-foreground shadow-[var(--shadow-elegant)]">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Find your forever home today</h2>
          <p className="opacity-90 max-w-xl mx-auto mb-8">Share your details and our team will reach out to schedule a personal site walkthrough.</p>
          <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-background px-8 py-3 font-semibold text-foreground hover:opacity-95 transition">Get in Touch</Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
