import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import heroHouse from "@/assets/hero-house.jpeg";
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

      {/* Hero — cinematic full-bleed */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[88vh] min-h-[560px] w-full">
          <img
            src={heroHouse}
            alt="Signature row house at Urbanaid Uniworld — hand-carved sandstone facade"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Cinematic gradients for depth + legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-end pb-16 md:pb-24">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm text-white text-[11px] md:text-xs font-semibold tracking-[0.25em] uppercase mb-6 border border-white/25">
                Now Selling · Limited Inventory
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]">
                Where craftsmanship<br/>meets <span className="text-accent italic">modern living</span>.
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/85 max-w-xl">
                A thoughtfully designed enclave of premium row houses — hand-carved sandstone facades, spacious interiors, and a gated community lifestyle.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 shadow-[var(--shadow-elegant)] transition">Book a Site Visit</Link>
                <Link to="/gallery" className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 backdrop-blur-sm px-6 py-3 font-semibold text-white hover:bg-white/20 transition">View Gallery</Link>
              </div>
            </div>
          </div>

          {/* Soft fade into next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        {/* Stats strip */}
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            <div><div className="text-3xl md:text-4xl font-display font-bold text-primary">100+</div><div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Row Houses</div></div>
            <div><div className="text-3xl md:text-4xl font-display font-bold text-primary">50 ft</div><div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Main Road</div></div>
            <div><div className="text-3xl md:text-4xl font-display font-bold text-primary">30 ft</div><div className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Branch Road</div></div>
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
