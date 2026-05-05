import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Urbanaid Uniworld" },
      { name: "description", content: "Get in touch to schedule a site visit at Urbanaid Uniworld row houses." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  mobile: z.string().trim().regex(/^[+\d\s-]{7,20}$/, "Enter a valid mobile number"),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

function Contact() {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", message: "" });
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
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      email: parsed.data.email || null,
      message: parsed.data.message || null,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not submit. Please try again.");
      return;
    }
    setDone(true);
    setForm({ name: "", mobile: "", email: "", message: "" });
    toast.success("Thank you! We'll contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <section className="container mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 max-w-6xl">
        <div>
          <h1 className="text-5xl font-bold mb-4">Let's talk</h1>
          <p className="text-muted-foreground mb-8">Leave your details and our sales team will reach out to schedule a personal site visit at Urbanaid Uniworld.</p>
          <div className="space-y-4 text-sm">
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="font-semibold mb-1">Sales Office</div>
              <div className="text-muted-foreground">Urbanaid Infratech Pvt. Ltd.<br/>On-site sales gallery open daily.</div>
            </div>
            <div className="p-5 rounded-xl bg-card border border-border">
              <div className="font-semibold mb-1">Site Visits</div>
              <div className="text-muted-foreground">Mon — Sun, 9 AM to 7 PM</div>
            </div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="p-8 rounded-2xl bg-card border border-border shadow-[var(--shadow-soft)] space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
            <input className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Mobile Number *</label>
            <input type="tel" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} required maxLength={20} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email <span className="text-muted-foreground">(optional)</span></label>
            <input type="email" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Message <span className="text-muted-foreground">(optional)</span></label>
            <textarea rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={1000} />
          </div>
          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 transition shadow-[var(--shadow-soft)]">
            {loading ? "Sending..." : done ? "Sent — send another?" : "Submit Enquiry"}
          </button>
          <p className="text-xs text-muted-foreground text-center">Your details are kept private and used only to contact you about this project.</p>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
