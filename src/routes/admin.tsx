import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { buildSiteMediaPath, getSiteMediaPublicUrl, inferSiteMediaType, SITE_MEDIA_BUCKET } from "@/lib/site-media";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin | Urbanaid Uniworld" }] }),
});

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type SiteMediaRow = Database["public"]["Tables"]["site_media"]["Row"];
type DashboardState = "loading" | "signed-out" | "member" | "admin" | "error";

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMediaType(value: SiteMediaRow["media_type"]) {
  return value === "video" ? "Video" : "Image";
}

function Admin() {
  const [dashboardState, setDashboardState] = useState<DashboardState>("loading");
  const [dashboardEmail, setDashboardEmail] = useState("");
  const [dashboardUserId, setDashboardUserId] = useState("");
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [siteMedia, setSiteMedia] = useState<SiteMediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadFileKey, setUploadFileKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  const syncDashboard = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setDashboardState("signed-out");
        setDashboardEmail("");
        setDashboardUserId("");
        setLeads([]);
        setSiteMedia([]);
        return;
      }

      setDashboardEmail(session.user.email ?? "");
      setDashboardUserId(session.user.id);

      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (roleError) {
        throw roleError;
      }

      const isAdmin = (roles ?? []).some((role) => role.role === "admin");

      if (!isAdmin) {
        setDashboardState("member");
        setLeads([]);
        setSiteMedia([]);
        return;
      }

      const [{ data: leadRows, error: leadError }, { data: mediaRows, error: mediaError }] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }),
        supabase.from("site_media").select("*").order("created_at", { ascending: false }),
      ]);

      if (leadError) {
        throw leadError;
      }

      if (mediaError) {
        throw mediaError;
      }

      setDashboardState("admin");
      setLeads(leadRows ?? []);
      setSiteMedia(mediaRows ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load the owner dashboard.";
      setDashboardState("error");
      setLeads([]);
      setSiteMedia([]);
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void syncDashboard();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncDashboard();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleClaimAdmin = async () => {
    setClaiming(true);

    try {
      const { data, error } = await supabase.rpc("bootstrap_first_admin");

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error("Admin access was not granted. An admin may already exist.");
      } else {
        toast.success("Admin access claimed.");
      }

      await syncDashboard();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not claim admin access.";
      toast.error(message);
    } finally {
      setClaiming(false);
    }
  };

  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.file) {
      toast.error("Choose an image or video file first.");
      return;
    }

    const mediaType = inferSiteMediaType(uploadForm.file);

    if (!mediaType) {
      toast.error("Only image and video files are supported.");
      return;
    }

    setUploadingMedia(true);

    const storagePath = buildSiteMediaPath(uploadForm.file, mediaType);

    try {
      const { error: uploadError } = await supabase.storage.from(SITE_MEDIA_BUCKET).upload(storagePath, uploadForm.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: uploadForm.file.type,
      });

      if (uploadError) {
        throw uploadError;
      }

      const { data: inserted, error: insertError } = await supabase
        .from("site_media")
        .insert({
          title: uploadForm.title.trim() || null,
          description: uploadForm.description.trim() || null,
          media_type: mediaType,
          storage_path: storagePath,
          uploaded_by: dashboardUserId || null,
        })
        .select("*")
        .single();

      if (insertError) {
        await supabase.storage.from(SITE_MEDIA_BUCKET).remove([storagePath]);
        throw insertError;
      }

      setSiteMedia((current) => [inserted, ...current]);
      setUploadForm({ title: "", description: "", file: null });
      setUploadFileKey((current) => current + 1);
      toast.success("Media uploaded. The public website will show it automatically.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not upload the media file.";
      toast.error(message);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (mediaItem: SiteMediaRow) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this uploaded media item permanently?")) {
      return;
    }

    setDeletingMediaId(mediaItem.id);

    try {
      const { error: rowError } = await supabase.from("site_media").delete().eq("id", mediaItem.id);

      if (rowError) {
        throw rowError;
      }

      setSiteMedia((current) => current.filter((item) => item.id !== mediaItem.id));

      const { error: storageError } = await supabase.storage.from(SITE_MEDIA_BUCKET).remove([mediaItem.storage_path]);

      if (storageError) {
        toast.error("Media entry removed, but the file could not be deleted from storage.");
      } else {
        toast.success("Media deleted.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete the media item.";
      toast.error(message);
    } finally {
      setDeletingMediaId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this lead permanently?")) {
      return;
    }

    setDeletingId(leadId);

    try {
      const { error } = await supabase.from("leads").delete().eq("id", leadId);

      if (error) {
        throw error;
      }

      setLeads((current) => current.filter((lead) => lead.id !== leadId));
      toast.success("Lead deleted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete the lead.";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success("Signed out.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not sign out.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const latestMedia = siteMedia[0];

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <section className="site-shell max-w-6xl py-20">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
            <span className="mb-4 inline-flex rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Owner dashboard
            </span>
            <h1 className="mb-3 text-3xl font-bold">Lead and media dashboard</h1>
            <p className="text-muted-foreground">
              Review contact enquiries, upload new site photos or videos, and keep the public gallery updated without touching the code.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
              Checking owner session and dashboard access...
            </div>
          ) : dashboardState === "signed-out" ? (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Sign in required</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Use the owner login page before opening the private dashboard and media manager.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Open Owner Login
              </Link>
            </div>
          ) : dashboardState === "member" ? (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Account signed in</h2>
              <p className="mb-2 text-sm text-muted-foreground">
                Signed in as <span className="font-semibold text-foreground">{dashboardEmail}</span>.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                This account does not currently have the admin role. If this is the first owner account, you can claim it once.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleClaimAdmin}
                  disabled={claiming}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {claiming ? "Claiming..." : "Claim First Admin Access"}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-3 font-semibold text-foreground transition hover:bg-secondary/50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : dashboardState === "admin" ? (
            <>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Signed in as</div>
                    <div className="font-semibold">{dashboardEmail}</div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void syncDashboard()}
                      className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary/50"
                    >
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Total enquiries</div>
                  <div className="mt-2 text-3xl font-bold">{leads.length}</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Latest enquiry</div>
                  <div className="mt-2 text-sm font-semibold">
                    {leads[0] ? formatTimestamp(leads[0].created_at) : "No enquiries yet"}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Uploaded media</div>
                  <div className="mt-2 text-3xl font-bold">{siteMedia.length}</div>
                </div>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <div className="text-sm text-muted-foreground">Latest upload</div>
                  <div className="mt-2 text-sm font-semibold">
                    {latestMedia ? formatTimestamp(latestMedia.created_at) : "No uploads yet"}
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                    <h2 className="text-xl font-semibold">Upload gallery media</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Images appear on the homepage and gallery page. Videos appear on the gallery page under the photo grid.
                    </p>

                    <form onSubmit={handleUploadMedia} className="mt-6 space-y-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Title</label>
                        <input
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm((current) => ({ ...current, title: e.target.value }))}
                          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          maxLength={120}
                          placeholder="Front elevation, entrance, aerial view..."
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Description</label>
                        <textarea
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm((current) => ({ ...current, description: e.target.value }))}
                          className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          maxLength={280}
                          placeholder="Optional details for the public gallery."
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium">Photo or video file</label>
                        <input
                          key={uploadFileKey}
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => setUploadForm((current) => ({ ...current, file: e.target.files?.[0] ?? null }))}
                          className="block w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:font-semibold file:text-primary-foreground"
                        />
                        <p className="mt-2 text-xs text-muted-foreground">
                          {uploadForm.file ? `Selected: ${uploadForm.file.name}` : "Choose a JPG, PNG, WEBP, MP4, or similar media file."}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={uploadingMedia}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                      >
                        {uploadingMedia ? "Uploading..." : "Upload to Website"}
                      </button>
                    </form>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-[var(--shadow-soft)]">
                    <div className="font-semibold text-foreground">How this works</div>
                    <p className="mt-2">Latest uploaded images become the three highlight photos on the home page.</p>
                    <p className="mt-2">Uploaded media is also shown on the public gallery page before the built-in starter assets.</p>
                    <p className="mt-2">If you delete an upload here, it is removed from the public website as well.</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Uploaded media</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Review uploaded files, confirm their preview, and delete anything that should not stay live.
                      </p>
                    </div>
                  </div>

                  {siteMedia.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
                      No photos or videos have been uploaded yet.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {siteMedia.map((item) => {
                        const publicUrl = getSiteMediaPublicUrl(item.storage_path);

                        return (
                          <div key={item.id} className="rounded-2xl border border-border bg-background p-4">
                            <div className="grid gap-4 md:grid-cols-[11rem_minmax(0,1fr)]">
                              {item.media_type === "video" ? (
                                <video src={publicUrl} controls className="h-44 w-full rounded-xl bg-black object-cover" preload="metadata" />
                              ) : (
                                <img src={publicUrl} alt={item.title?.trim() || "Uploaded gallery image"} className="h-44 w-full rounded-xl object-cover" />
                              )}

                              <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                      {formatMediaType(item.media_type)}
                                    </div>
                                    <div className="mt-1 text-lg font-semibold">
                                      {item.title?.trim() || `${formatMediaType(item.media_type)} upload`}
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {item.description?.trim() || "No description added."}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteMedia(item)}
                                    disabled={deletingMediaId === item.id}
                                    className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50 disabled:opacity-60"
                                  >
                                    {deletingMediaId === item.id ? "Deleting..." : "Delete"}
                                  </button>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  Uploaded {formatTimestamp(item.created_at)}
                                </div>
                                <div className="break-all text-xs text-muted-foreground">{item.storage_path}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Lead enquiries</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review contact form submissions captured from the public website.
                  </p>
                </div>

                {leads.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-background p-8 text-sm text-muted-foreground">
                    No enquiries have been submitted yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leads.map((lead) => (
                      <div key={lead.id} className="rounded-2xl border border-border bg-background p-5">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold">{lead.name}</div>
                            <a href={`tel:${lead.mobile}`} className="mt-1 inline-block text-sm text-primary hover:underline">
                              {lead.mobile}
                            </a>
                            <div className="mt-2 text-xs text-muted-foreground">{formatTimestamp(lead.created_at)}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleDeleteLead(lead.id)}
                            disabled={deletingId === lead.id}
                            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary/50 disabled:opacity-60"
                          >
                            {deletingId === lead.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
              <h2 className="mb-2 text-xl font-semibold">Dashboard unavailable</h2>
              <p className="text-sm text-muted-foreground">
                {errorMessage || "The owner dashboard could not be loaded right now. Check the Supabase configuration and try again."}
              </p>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            If you only need the public site, go back to the{" "}
            <Link to="/" className="text-primary underline-offset-4 hover:underline">
              home page
            </Link>
            .
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
