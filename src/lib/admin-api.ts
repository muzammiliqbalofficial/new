const SUPABASE_URL = 'https://qdouuizitxiiumgkgnyt.supabase.co';
const SERVICE_KEY = 'sb_secret_d5OHSu1-JX2kUnq7HZIp3g_rEsECr0Y';

const getHeaders = () => ({
  'apikey': SERVICE_KEY,
  'Authorization': 'Bearer ' + SERVICE_KEY,
  'Content-Type': 'application/json',
});

// 1. Fetch Orders
export async function getAdminOrders() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?select=*,order_items(*)&order=created_at.desc&_t=${Date.now()}`,
      { headers: getHeaders() }
    );
    if (!res.ok) {
      console.error('Failed to fetch orders:', res.status);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error('getAdminOrders exception:', err);
    return [];
  }
}

// 2. Update Order Status
export async function setOrderStatus(orderId: string, status: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      method: 'PATCH',
      headers: { ...getHeaders(), 'Prefer': 'return=representation' },
      body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
    });
    return res.ok;
  } catch (err) {
    console.error('setOrderStatus error:', err);
    return false;
  }
}

// 3. Fetch Products
export async function getAdminProducts() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=id,slug,name,price,sale_price,stock,is_published,category_id,categories(id,name,slug),product_images(id,r2_key,is_primary,is_white_background,is_description_image)&order=created_at.desc&_t=${Date.now()}`,
      { headers: getHeaders() }
    );
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status);
      return [];
    }
    return await res.json();
  } catch (err) {
    console.error('getAdminProducts exception:', err);
    return [];
  }
}

// 4. Fetch Categories
export async function getAdminCategories() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=*&order=sort_order.asc&_t=${Date.now()}`,
      { headers: getHeaders() }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error('getAdminCategories exception:', err);
    return [];
  }
}

// 5. Update Product
export async function updateAdminProduct(productId: string, payload: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
      method: 'PATCH',
      headers: { ...getHeaders(), 'Prefer': 'return=representation' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('updateAdminProduct exception:', err);
    return false;
  }
}

// 6. Delete Product
export async function deleteAdminProduct(productId: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.ok;
  } catch (err) {
    console.error('deleteAdminProduct exception:', err);
    return false;
  }
}

// 7. Create Product
export async function createAdminProduct(payload: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Prefer': 'return=representation' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0] || null;
  } catch (err) {
    console.error('createAdminProduct exception:', err);
    return null;
  }
}
