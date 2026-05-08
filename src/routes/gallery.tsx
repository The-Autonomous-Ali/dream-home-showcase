import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import houseFront from "@/assets/house-front.jpeg";
import a1 from "@/assets/site-aerial-1.jpeg";
import a3 from "@/assets/site-aerial-3.jpeg";
import entrance from "@/assets/site-entrance.jpeg";
import { useEffect, useState } from "react";
import { fetchSiteMedia, type PublicSiteMedia } from "@/lib/site-media";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({
    meta: [
      { title: "Gallery | Urbanaid Uniworld" },
      {
        name: "description",
        content: "Photos and videos of Urbanaid Uniworld row houses and the gated community.",
      },
    ],
  }),
});

const galleryItems = [
  { src: houseFront, alt: "Signature row house exterior", title: "Signature Front Elevation" },
  { src: entrance, alt: "Main gated entrance", title: "Community Entrance" },
  { src: a1, alt: "Aerial site overview", title: "Aerial Perspective" },
  { src: a3, alt: "Road and community aerial view", title: "Internal Road Network" },
];

const fallbackVideoItems = [
  {
    src: "/site-flythrough.mp4",
    title: "Project Flythrough",
    description: "Use this section for the walkthrough or drone video.",
  },
];

function Gallery() {
  const [uploadedMedia, setUploadedMedia] = useState<PublicSiteMedia[]>([]);
  const [mediaError, setMediaError] = useState("");

  useEffect(() => {
    let active = true;

    const loadSiteMedia = async () => {
      try {
        const media = await fetchSiteMedia();

        if (active) {
          setUploadedMedia(media);
          setMediaError("");
        }
      } catch (error) {
        if (active) {
          setUploadedMedia([]);
          setMediaError(error instanceof Error ? error.message : "Could not load uploaded gallery media.");
        }
      }
    };

    void loadSiteMedia();

    return () => {
      active = false;
    };
  }, []);

  const uploadedImages = uploadedMedia.filter((item) => item.media_type === "image");
  const uploadedVideos = uploadedMedia.filter((item) => item.media_type === "video");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="site-shell max-w-6xl py-16 sm:py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-5xl font-bold">Project Gallery</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              A look at the facades, entrance, and site planning behind Urbanaid Uniworld.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Book a Site Visit
          </Link>
        </div>

        {mediaError && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
            Uploaded media could not be loaded right now, so the starter gallery is shown instead.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...uploadedImages.map((item) => ({
            src: item.publicUrl,
            alt: item.title?.trim() || item.description?.trim() || "Uploaded project image",
            title: item.title?.trim() || "Uploaded Project Photo",
          })), ...galleryItems].map((item, index) => (
            <figure key={item.title} className={`overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] ${index === 0 ? "lg:col-span-2" : ""}`}>
              <img
                src={item.src}
                alt={item.alt}
                className="h-72 w-full object-cover transition duration-300 hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="p-3">
                <div className="text-sm font-semibold">{item.title}</div>
              </figcaption>
            </figure>
          ))}

          {[...uploadedVideos.map((item) => ({
            src: item.publicUrl,
            title: item.title?.trim() || "Uploaded Project Video",
            description: item.description?.trim() || "Uploaded from the owner dashboard.",
          })), ...fallbackVideoItems].map((item) => (
            <div key={`${item.title}-${item.src}`} className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] lg:col-span-2">
              <video src={item.src} controls className="h-72 w-full bg-black object-cover" preload="metadata" />
              <div className="p-3">
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
