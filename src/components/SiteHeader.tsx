import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">Urbanaid Uniworld</div>
            <div className="text-xs text-muted-foreground">Premium Row Houses</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Home</Link>
          <Link to="/about" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">About</Link>
          <Link to="/gallery" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Gallery</Link>
          <Link to="/contact" activeProps={{ className: "text-primary" }} className="hover:text-primary transition">Contact</Link>
        </nav>
        <Link to="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-[var(--shadow-soft)]">
          Enquire Now
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="font-display text-xl font-bold mb-2">Urbanaid Uniworld</div>
          <p className="text-muted-foreground">Premium gated community of row houses with modern architecture and timeless craftsmanship.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Quick Links</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About the Project</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Photo & Video Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Schedule a Site Visit</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <p className="text-muted-foreground">Urbanaid Infratech Pvt. Ltd.<br/>Sales: +91 — call to enquire</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">© {new Date().getFullYear()} Urbanaid Uniworld. All rights reserved.</div>
    </footer>
  );
}
