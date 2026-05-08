import { Link } from "@tanstack/react-router";
import { Building2, Home, MessageCircle, PhoneCall } from "lucide-react";

const phoneNumber = "+916393589973";
const whatsappHref = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi, I want to know more about Urbanaid Uniworld.",
)}`;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="site-shell flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Home className="h-5 w-5" />
          </div>
          <div className="font-display text-lg font-bold leading-none">Premium Row Houses</div>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Home
          </Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            About
          </Link>
          <Link to="/gallery" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Gallery
          </Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="transition hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
          >
            <PhoneCall className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="site-shell grid gap-8 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="text-muted-foreground">Premium gated community of row houses with modern architecture and timeless craftsmanship.</p>
        </div>
        <div>
          <div className="mb-2 font-semibold">Quick Links</div>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-primary">
                About the Project
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-primary">
                Photo & Video Gallery
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Schedule a Site Visit
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="mb-2 font-semibold">Contact</div>
          <p className="text-muted-foreground">
            Sales: <a href={`tel:${phoneNumber}`} className="hover:text-primary">{phoneNumber}</a>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-border py-4 text-center text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}

export function FloatingContactBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-3 gap-2 p-3">
        <a
          href={`tel:${phoneNumber}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]"
        >
          <PhoneCall className="h-4 w-4" />
          Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-soft)]"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          <Building2 className="h-4 w-4" />
          Enquire
        </Link>
      </div>
    </div>
  );
}
