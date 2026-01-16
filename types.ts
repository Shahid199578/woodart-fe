export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  image_url?: string;
  stock_quantity?: number;
  isNew?: boolean;
  is_new?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export interface User {
  id?: number;
  full_name?: string;
  username?: string;
  name?: string; // Keep for compatibility if needed, but prefer full_name
  email: string;
  role?: 'customer' | 'admin';
  brand_name?: string;
  gst_number?: string;
  mobile?: string;
  business_address?: string;
  warehouse_address?: string;
}

export type Page =
  | 'home'
  | 'collections'
  | 'about'
  | 'sustainability'
  | 'journal'
  | 'support'
  | 'faq'
  | 'shipping'
  | 'care'
  | 'warranty'
  | 'contact'
  | 'admin'
  | 'admin-products'
  | 'admin-orders'
  | 'admin-users'
  | 'admin-settings'
  | 'admin-blog'
  | 'admin-categories'
  | 'admin-partners';
