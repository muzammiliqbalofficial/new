export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  product_count?: number;
  representative_image?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  r2_key: string;
  sort_order: number;
  is_primary: boolean;
  is_description_image: boolean;
  is_white_background: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  daraz_id?: string;
  slug: string;
  name: string;
  name_original?: string;
  category_id?: string | null;
  brand?: string;
  warranty?: string;
  currency: string;
  price: number | null;
  sale_price: number | null;
  stock: number;
  is_published: boolean;
  attributes: Record<string, string>;
  description_html?: string;
  description_text?: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  product_images?: ProductImage[];
  categories?: Category | null;
}

export interface StoreSettings {
  id: number;
  store_name: string;
  store_domain: string;
  whatsapp_number: string;
  contact_email: string;
  shipping_flat_rate: number;
  announcement_bar_text: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  imageStem: string;
  quantity: number;
}

export interface CheckoutFormData {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderItemPayload {
  product_id?: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface OrderPayload {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address: string;
  city: string;
  notes?: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}
