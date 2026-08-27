import { supabase, supabaseAdmin } from './supabase';
import { Product, Category } from './types';

// 1. Fetch Orders (uses admin client)
export async function getAdminOrders() {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin orders:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('getAdminOrders exception:', err);
    return [];
  }
}

// 2. Update Order Status
export async function setOrderStatus(orderId: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    return !error;
  } catch (err) {
    console.error('setOrderStatus exception:', err);
    return false;
  }
}

// 3. Fetch Products (fetches all products including unpublished for admin)
export async function getAdminProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(
        `
        id,
        slug,
        name,
        brand,
        attributes,
        price,
        sale_price,
        stock,
        is_published,
        category_id,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          r2_key,
          sort_order,
          is_primary,
          is_white_background,
          is_description_image
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products:', error);
      return [];
    }
    return (data || []) as unknown as Product[];
  } catch (err) {
    console.error('getAdminProducts exception:', err);
    return [];
  }
}

// 4. Fetch Categories
export async function getAdminCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return (data || []) as unknown as Category[];
  } catch (err) {
    console.error('getAdminCategories exception:', err);
    return [];
  }
}

// 5. Update Product
export async function updateAdminProduct(productId: string, payload: any) {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', productId);

    return !error;
  } catch (err) {
    console.error('updateAdminProduct exception:', err);
    return false;
  }
}

// 6. Delete Product
export async function deleteAdminProduct(productId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    return !error;
  } catch (err) {
    console.error('deleteAdminProduct exception:', err);
    return false;
  }
}

// 7. Create Product
export async function createAdminProduct(payload: any) {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([payload])
      .select();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    return data?.[0] || null;
  } catch (err) {
    console.error('createAdminProduct exception:', err);
    return null;
  }
}
