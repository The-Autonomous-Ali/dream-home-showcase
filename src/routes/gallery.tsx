import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import houseFront from "@/assets/house-front.jpeg";
import a1 from "@/assets/site-aerial-1.jpeg";
import a3 from "@/assets/site-aerial-3.jpeg";
import entrance from "@/assets/site-entrance.jpeg";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Gallery — Urbanaid Uniworld" },
      { name: "description", content: "Photos and videos of Urbanaid Uniworld row houses and the gated community." },
    ],
  }),
});

type Media = { id: string; title: string | null; description: string | null; media_type: string; storage_path: string; created_at: string };

const defaults = [houseFront, entrance, a1, a3];

function Gallery() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("site_media").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  const urlFor = (path: string) => supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="container mx-auto px-6 py-16">
        <h1 className="text-5xl font-bold mb-3">Project Gallery</h1>
        <p className="text-muted-foreground mb-10 max-w-2xl">A look at our row houses, the community, and the surroundings.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaults.map((src, i) => (
            <img key={i} src={src} alt={`Site photo ${i+1}`} className="rounded-xl shadow-[var(--shadow-soft)] w-full h-72 object-cover hover:scale-[1.02] transition" />
          ))}
          {items.map((m) => (
            <div key={m.id} className="rounded-xl overflow-hidden shadow-[var(--shadow-soft)] bg-card border border-border">
              {m.media_type === "video" ? (
                <video src={urlFor(m.storage_path)} controls className="w-full h-72 object-cover bg-black" />
              ) : (
                <img src={urlFor(m.storage_path)} alt={m.title || "Site media"} className="w-full h-72 object-cover" />
              )}
              {(m.title || m.description) && (
                <div className="p-3">
                  {m.title && <div className="font-semibold text-sm">{m.title}</div>}
                  {m.description && <div className="text-xs text-muted-foreground">{m.description}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
        {loading && <div className="text-center text-muted-foreground mt-8">Loading more…</div>}
      </section>
      <SiteFooter />
    </div>
  );
}
