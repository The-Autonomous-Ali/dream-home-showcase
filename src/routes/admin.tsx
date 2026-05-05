import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Trash2, Upload, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — Urbanaid Uniworld" }] }),
});

type Lead = { id: string; name: string; mobile: string; email: string | null; message: string | null; created_at: string };
type Media = { id: string; title: string | null; media_type: string; storage_path: string; created_at: string };

function Admin() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [tab, setTab] = useState<"leads" | "media">("media");
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/auth" }); return; }
      setUserId(session.user.id);
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = (roles || []).some((r) => r.role === "admin");
      if (!admin) {
        // Auto-grant admin to first user (bootstrap)
        const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
        if ((count || 0) === 0) {
          await supabase.from("user_roles").insert({ user_id: session.user.id, role: "admin" });
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else setIsAdmin(true);
      setReady(true);
    })();
  }, [navigate]);

  const refresh = async () => {
    const [{ data: l }, { data: m }] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("site_media").select("*").order("created_at", { ascending: false }),
    ]);
    setLeads((l as Lead[]) || []);
    setMedia((m as Media[]) || []);
  };

  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 100 * 1024 * 1024) { toast.error("Max 100MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("site-media").upload(path, file);
    if (upErr) { setUploading(false); toast.error(upErr.message); return; }
    const media_type = file.type.startsWith("video") ? "video" : "image";
    const { error: insErr } = await supabase.from("site_media").insert({ storage_path: path, media_type, title: title || null, uploaded_by: userId });
    setUploading(false);
    setTitle("");
    e.target.value = "";
    if (insErr) { toast.error(insErr.message); return; }
    toast.success("Uploaded");
    refresh();
  };

  const deleteMedia = async (m: Media) => {
    if (!confirm("Delete this item?")) return;
    await supabase.storage.from("site-media").remove([m.storage_path]);
    await supabase.from("site_media").delete().eq("id", m.id);
    refresh();
  };
  const deleteLead = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await supabase.from("leads").delete().eq("id", id);
    refresh();
  };

  const logout = async () => { await supabase.auth.signOut(); navigate({ to: "/" }); };

  const urlFor = (p: string) => supabase.storage.from("site-media").getPublicUrl(p).data.publicUrl;

  if (!ready) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background"><SiteHeader />
      <div className="container mx-auto px-6 py-20 max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
        <p className="text-muted-foreground mb-6">This account does not have admin access. Please contact the site owner.</p>
        <button onClick={logout} className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground font-semibold">Logout</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SiteHeader />
      <section className="container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary"><LogOut className="w-4 h-4" />Logout</button>
        </div>

        <div className="flex gap-2 mb-6 border-b border-border">
          {(["media", "leads"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize border-b-2 transition ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t} {t === "leads" && leads.length > 0 && `(${leads.length})`}
            </button>
          ))}
        </div>

        {tab === "media" && (
          <div>
            <div className="p-6 rounded-xl bg-card border border-border mb-6">
              <h2 className="font-semibold mb-3">Upload Photo or Video</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
                <label className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground cursor-pointer hover:opacity-90">
                  <Upload className="w-4 h-4" />{uploading ? "Uploading…" : "Choose File"}
                  <input type="file" accept="image/*,video/*" className="hidden" onChange={onFile} disabled={uploading} />
                </label>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {media.map((m) => (
                <div key={m.id} className="rounded-xl overflow-hidden border border-border bg-card relative group">
                  {m.media_type === "video" ? (
                    <video src={urlFor(m.storage_path)} controls className="w-full h-56 object-cover bg-black" />
                  ) : (
                    <img src={urlFor(m.storage_path)} alt={m.title || ""} className="w-full h-56 object-cover" />
                  )}
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{m.title || m.media_type}</span>
                    <button onClick={() => deleteMedia(m)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr><th className="p-3">Name</th><th className="p-3">Mobile</th><th className="p-3">Email</th><th className="p-3">Message</th><th className="p-3">Date</th><th></th></tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-border">
                    <td className="p-3 font-medium">{l.name}</td>
                    <td className="p-3"><a href={`tel:${l.mobile}`} className="text-primary">{l.mobile}</a></td>
                    <td className="p-3 text-muted-foreground">{l.email || "—"}</td>
                    <td className="p-3 text-muted-foreground max-w-xs truncate">{l.message || "—"}</td>
                    <td className="p-3 text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                    <td className="p-3"><button onClick={() => deleteLead(l.id)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button></td>
                  </tr>
                ))}
                {leads.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No enquiries yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
