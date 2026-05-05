
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Leads (visitor enquiries)
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit lead" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view leads" ON public.leads FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete leads" ON public.leads FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Media (site photos/videos)
CREATE TABLE public.site_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  media_type TEXT NOT NULL CHECK (media_type IN ('image','video')),
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view media" ON public.site_media FOR SELECT USING (true);
CREATE POLICY "Admins insert media" ON public.site_media FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update media" ON public.site_media FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON public.site_media FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('site-media', 'site-media', true);

CREATE POLICY "Public can read site-media" ON storage.objects FOR SELECT USING (bucket_id = 'site-media');
CREATE POLICY "Admins upload site-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update site-media" ON storage.objects FOR UPDATE USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete site-media" ON storage.objects FOR DELETE USING (bucket_id = 'site-media' AND public.has_role(auth.uid(), 'admin'));
