export type Meta = { title: string; description: string; url?: string; image?: string };

export function buildMeta(meta: Meta) {
  const m = {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, images: meta.image ? [meta.image] : [] },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: meta.image ? [meta.image] : [] },
  };
  return m;
}

