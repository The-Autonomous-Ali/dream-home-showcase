import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";

const phoneNumber = "+916393589973";
const whatsappHref = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
  "Hi, I want to schedule a site visit for Urbanaid Uniworld.",
)}`;

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact | Urbanaid Uniworld" },
      {
        name: "description",
        content: "Get in touch to schedule a site visit at Urbanaid Uniworld row houses.",
      },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  mobile: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Enter a valid mobile number"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please allow us to contact you about the project" }),
  }),
});

function Contact() {
  const [form, setForm] = useState({ name: "", mobile: "", consent: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("leads").insert({
        name: parsed.data.name,
        mobile: parsed.data.mobile,
      });

      if (error) {
        throw error;
      }

      setDone(true);
      setForm({ name: "", mobile: "", consent: false });
      toast.success("Thank you! We'll contact you shortly.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />

      <section className="site-shell grid max-w-6xl gap-12 py-16 sm:py-20 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <span className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Contact and site visit
          </span>
          <h1 className="text-5xl font-bold">Let us plan your visit.</h1>
          <p className="mb-8 mt-4 text-muted-foreground">
            Leave your name and mobile number. The team will contact you directly to schedule a personal site visit.
          </p>

          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-1 font-semibold">Quick actions</div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 font-semibold text-foreground transition hover:bg-secondary/50"
                >
                  <PhoneCall className="h-4 w-4" />
                  Call now
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2 font-semibold text-foreground transition hover:bg-secondary/50"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-1 font-semibold">Sales office</div>
              <div className="text-muted-foreground">On-site sales gallery open daily.</div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-1 font-semibold">Site visits</div>
              <div className="text-muted-foreground">Mon to Sun, 9 AM to 7 PM</div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/45 p-4 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>Your details are kept private and used only to contact you about this project.</span>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
              <div className="mb-2 font-semibold">Need more context first?</div>
              <p className="text-muted-foreground">
                You can review the{" "}
                <Link to="/gallery" className="text-primary underline-offset-4 hover:underline">
                  gallery
                </Link>{" "}
                or{" "}
                <Link to="/about" className="text-primary underline-offset-4 hover:underline">
                  project details
                </Link>{" "}
                before sending the form.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Full Name *</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Mobile Number *</label>
            <input
              type="tel"
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              required
              maxLength={20}
              autoComplete="tel"
              placeholder="+91 98765 43210"
            />
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-border bg-secondary/45 p-4 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-0.5"
              required
            />
            <span>I agree to be contacted about this row-house project.</span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Sending..." : done ? "Sent - send another?" : "Submit Enquiry"}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            The form saves directly to the secure lead dashboard, not to a public inbox.
          </p>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
