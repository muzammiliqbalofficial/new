import { formatPrice } from './formatters';

const NOTIFY_EMAIL = 'syedalex12@gmail.com';

interface OrderNotificationPayload {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
}

export async function sendOrderEmailNotification(order: OrderNotificationPayload) {
  try {
    const itemsFormatted = order.items
      .map((i) => `${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`)
      .join('\n');

    const payload = {
      _subject: ` New tinykids.pk Order #${order.order_number} — ${order.customer_name} (${formatPrice(order.total)})`,
      _template: 'table',
      _captcha: 'false',
      Store_Name: 'tinykids.pk (tinykids.pk)',
      Order_Number: order.order_number,
      Customer_Name: order.customer_name,
      Customer_Phone: order.customer_phone,
      Customer_Email: order.customer_email || 'Not Provided',
      Destination_City: order.city,
      Delivery_Address: order.address,
      Delivery_Instructions: order.notes || 'None',
      Ordered_Items: itemsFormatted,
      Subtotal: formatPrice(order.subtotal),
      Shipping_Fee: order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee),
      Total_Payable_COD: formatPrice(order.total),
      Order_Date_Time: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' }),
    };

    await fetch(`https://formsubmit.co/ajax/${NOTIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Order email notification notice:', err);
  }
}
