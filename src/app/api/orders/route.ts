import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, address, city, notes, items, subtotal, shipping_fee, total } =
      body;

    if (!customer_name || !customer_phone || !address || !city || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order fields or items.' },
        { status: 400 }
      );
    }

    // Generate human-readable order number e.g. TK-1042
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TK-${randomSuffix}`;

    // 1. Insert into orders table
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        address,
        city,
        notes: notes || null,
        subtotal: Number(subtotal) || 0,
        shipping_fee: Number(shipping_fee) || 0,
        total: Number(total) || 0,
        status: 'new',
      })
      .select('id, order_number')
      .single();

    if (orderError || !orderData) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 });
    }

    // 2. Insert order items snapshot
    const orderItemPayload = items.map((item: any) => ({
      order_id: orderData.id,
      product_id: item.id || null,
      product_name: item.name,
      unit_price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      line_total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItemPayload);
    if (itemsError) {
      console.warn('Order items insert note:', itemsError.message);
    }

    return NextResponse.json({
      success: true,
      order_id: orderData.id,
      order_number: orderData.order_number,
    });
  } catch (err: any) {
    console.error('Order processing exception:', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
