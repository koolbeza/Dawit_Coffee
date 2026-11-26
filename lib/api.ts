export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function imageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type Product = {
  id: number;
  product_name: string;
  product_origin: string;
  altitude: string;
  process: string;
  flavor_notes: string;
  description: string;
  image_file: string | null;
  created_at: string;
};

export type Origin = {
  id: number;
  name: string;
};

export type Certification = {
  id: number;
  name: string;
  description: string;
  image_file: string | null;
};

export type GalleryImage = {
  id: number;
  image: string;
  caption: string;
  order: number;
  category?: string | null;
};

export type GalleryVideo = {
  id: number;
  video_file: string | null;
  video_url: string;
  thumbnail: string | null;
  caption: string;
  order: number;
  category?: string | null;
  created_at: string;
};

export type Profile = {
  id: number;
  company_name: string;
  tagline: string;
  founded_year: string;
  owner_name: string;
  owner_bio: string;
  phone_1: string;
  phone_2: string;
  email_1: string;
  email_2: string;
  po_box: string;
  city: string;
  country: string;
  logo: string | null;
};

// ── Fetch helpers ────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getCertifications(): Promise<Certification[]> {
  try {
    const res = await fetch(`${API_BASE}/api/certifications`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getGallery(): Promise<GalleryImage[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gallery`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  try {
    const res = await fetch(`${API_BASE}/api/gallery-videos`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getProfile(): Promise<Profile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
