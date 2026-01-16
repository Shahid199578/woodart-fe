import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Obsidian Oak Table",
    description: "Hand-carved solid oak dining table with charred finish and gold resin inlays.",
    price: 2450,
    category: "Furniture",
    imageUrl: "https://picsum.photos/id/1069/800/800",
    isNew: true
  },
  {
    id: 2,
    name: "Ethereal Ash Chair",
    description: "Minimalist ash wood chair with ergonomic curvature and woven leather seat.",
    price: 595,
    category: "Furniture",
    imageUrl: "https://picsum.photos/id/1078/800/800"
  },
  {
    id: 3,
    name: "Celestial Walnut Bowl",
    description: "Lathe-turned black walnut bowl, perfect for centerpieces. Finished with beeswax.",
    price: 125,
    category: "Decor",
    imageUrl: "https://picsum.photos/id/119/800/800"
  },
  {
    id: 4,
    name: "Sienna Serving Board",
    description: "Live-edge cherry wood serving board with handcrafted brass handles.",
    price: 85,
    category: "Kitchen",
    imageUrl: "https://picsum.photos/id/305/800/800"
  },
  {
    id: 5,
    name: "Lumina Floor Lamp",
    description: "Bent-wood floor lamp providing a warm, diffused ambient glow.",
    price: 420,
    category: "Lighting",
    imageUrl: "https://picsum.photos/id/1060/800/800",
    isNew: true
  },
  {
    id: 6,
    name: "Artisan Chisel Set",
    description: "Professional grade chisels with Japanese steel and rosewood handles.",
    price: 299,
    category: "Tools",
    imageUrl: "https://picsum.photos/id/250/800/800"
  }
];

export const SYSTEM_INSTRUCTION = `You are "Master Silas", a master woodworker and consultant for Lignum & Lux. 
Your tone is warm, wise, and appreciative of craftsmanship.
You answer questions about:
1. Wood types (Oak, Walnut, Cherry, Ash, etc.)
2. Furniture care and maintenance.
3. Interior design advice using wooden elements.
4. The specific products in our catalog (Obsidian Oak Table, Ethereal Ash Chair, etc.).
Keep answers concise (under 3 sentences) unless asked for details. 
Always imply quality and heritage.`;
