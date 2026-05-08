import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const SITE_MEDIA_BUCKET = "site-media";

export type SiteMediaRow = Database["public"]["Tables"]["site_media"]["Row"];
export type SiteMediaKind = Extract<SiteMediaRow["media_type"], "image" | "video">;
export type PublicSiteMedia = SiteMediaRow & { publicUrl: string };

export function getSiteMediaPublicUrl(storagePath: string) {
  return supabase.storage.from(SITE_MEDIA_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export async function fetchSiteMedia() {
  const { data, error } = await supabase.from("site_media").select("*").order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    ...item,
    publicUrl: getSiteMediaPublicUrl(item.storage_path),
  })) satisfies PublicSiteMedia[];
}

export function inferSiteMediaType(file: File): SiteMediaKind | null {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  return null;
}

function sanitizeSiteMediaName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");

  return normalized || "file";
}

export function buildSiteMediaPath(file: File, mediaType: SiteMediaKind) {
  const safeName = sanitizeSiteMediaName(file.name);
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${mediaType}s/${uniquePrefix}-${safeName}`;
}
