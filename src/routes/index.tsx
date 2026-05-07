import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import aerial1 from "@/assets/site-aerial-1.jpeg";
import aerial3 from "@/assets/site-aerial-3.jpeg";
import entrance from "@/assets/site-entrance.jpeg";
import heroHouse from "@/assets/hero-house.jpeg";
import { BadgeCheck, Building2, KeySquare, MapPin, PhoneCall, Shield, Sparkles, Trees } from "lucide-react";

const phoneNumber = "+916393589973";
const whatsappHref = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi, I want to know more about Urbanaid Uniworld.",
)}`;

const faqs = [
  {
    question: "How do I book a site visit?",
    answer: "Use the contact form or the call and WhatsApp buttons. Our team will confirm a visit time directly with you.",
  },
  {
    question: "What makes this project different?",
    answer: "It combines premium row-house facades, a gated layout, and a family-friendly community plan instead of a generic apartment setup.",
  },
  {
    question: "Can I speak to someone before submitting the form?",
    answer: "Yes. Call the sales number or message on WhatsApp first if you prefer a quick conversation.",
  },
  {
    question: "Is the lead form connected to a secure dashboard?",
    answer: "Yes. The contact page saves enquiries directly into the secure Supabase lead dashboard used by the owner account.",
  },
];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Urbanaid Uniworld | Premium Row Houses" },
      {
        name: "description",
        content:
          "Premium row houses in a gated community with elegant facades, modern interiors, and a direct lead form for site visits.",
      },
      { property: "og:title", content: "Urbanaid Uniworld | Premium Row Houses" },
      { property: "og:description", content: "Premium row houses with a polished public site, gallery, FAQ, and direct inquiry flow." },
      { property: "og:type", content: "website" },
    ],
  }),
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative w-full overflow-hidden">
        <div className="relative h-[88vh] min-h-[560px] w-full">
          <img
            src={heroHouse}
            alt="Signature row house at Urbanaid Uniworld with a hand-carved sandstone facade"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

          <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6 pb-16 md:pb-24">
            <div className="max-w-3xl">
              <span className="mb-6 inline-block rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm md:text-xs">
                Now Selling
              </span>
              <h1 className="font-display text-5xl font-bold leading-[1.02] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)] md:text-7xl lg:text-8xl">
                Where craftsmanship
                <br />
                meets <span className="text-accent italic">modern living</span>.
              </h1>
              <p className="mt-6 max-w-xl text-base text-white/85 md:text-lg">
                A thoughtfully designed enclave of premium row houses, hand-carved sandstone facades, spacious interiors, and a gated community lifestyle.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:opacity-90"
                >
                  Book a Site Visit
                </Link>
                <Link
                  to="/gallery"
                  className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  View Gallery
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 bg-white/15 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-6 py-10">
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-[var(--shadow-soft)]">
              <div className="font-display text-3xl font-bold text-primary md:text-4xl">100+</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Row Houses</div>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-[var(--shadow-soft)]">
              <div className="font-display text-3xl font-bold text-primary md:text-4xl">50 ft</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Main Road</div>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-5 shadow-[var(--shadow-soft)]">
              <div className="font-display text-3xl font-bold text-primary md:text-4xl">24/7</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Secure Access</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Direct lead form connected to the owner dashboard",
            "Quick call and WhatsApp contact options",
            "Mobile-first layout with local gallery assets",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
              <BadgeCheck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-bold">A community designed around you</h2>
          <p className="text-muted-foreground">
            Every detail, from the carved stone facades to the wide internal roads, is built with care.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Building2, title: "Designer Facades", desc: "Hand-carved sandstone elevations that age beautifully." },
            { icon: Shield, title: "Gated & Secure", desc: "24/7 security, controlled access, and CCTV coverage." },
            { icon: Trees, title: "Green Boulevards", desc: "Wide tree-lined streets and landscaped pockets." },
            { icon: KeySquare, title: "Ready Possession", desc: "Move into a finished home with no waiting on construction." },
            { icon: Sparkles, title: "Premium Interiors", desc: "Wooden joinery, modular fittings, and large windows." },
            { icon: MapPin, title: "Prime Location", desc: "Connected to the city and surrounded by open fields." },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-border bg-card p-6 transition hover:shadow-[var(--shadow-soft)]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--gradient-warm)] py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[aerial1, entrance, aerial3].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Urbanaid Uniworld view ${i + 1}`}
                className="h-72 w-full rounded-xl object-cover shadow-[var(--shadow-soft)]"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="relative w-full overflow-hidden">
        <div className="relative h-[70vh] min-h-[480px] w-full">
          <video
            src="/site-flythrough.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              A Cinematic Walkthrough
            </span>
            <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white drop-shadow-lg md:text-7xl">
              Step inside <span className="text-accent">Urbanaid Uniworld</span>
            </h2>
            <p className="mt-6 max-w-2xl text-base text-white/85 md:text-lg">
              An aerial tour of the community, wide boulevards, grand entrance, and rows of crafted homes.
            </p>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-6 py-20">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-4xl font-bold">Frequently asked questions</h2>
          <p className="text-muted-foreground">A few quick answers before you book a site visit.</p>
        </div>
        <Accordion type="single" collapsible className="rounded-3xl border border-border bg-card px-6 shadow-[var(--shadow-soft)]">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="rounded-3xl bg-[var(--gradient-hero)] p-12 text-center text-primary-foreground shadow-[var(--shadow-elegant)] md:p-16">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Find your forever home today</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            Share your details and our team will reach out to schedule a personal site walkthrough.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md bg-background px-8 py-3 font-semibold text-foreground transition hover:opacity-95"
            >
              Get in Touch
            </Link>
            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center justify-center rounded-md border border-white/40 bg-white/10 px-8 py-3 font-semibold text-white transition hover:bg-white/20"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              Call Now
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
