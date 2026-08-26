import os
import sys

with open('.env', 'r', encoding='utf-8') as f:
    lines = f.readlines()

db_url = ''
for l in lines:
    if l.startswith('SUPABASE_DB_URL='):
        db_url = l.split('=', 1)[1].strip().strip('"').strip("'")

print('DB URL found:', bool(db_url))

try:
    import psycopg2
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    # 1. Enable RLS and add policies for orders
    cur.execute("""
        ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert to orders" ON orders;
        CREATE POLICY "Allow public insert to orders" ON orders FOR INSERT WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Allow public select orders" ON orders;
        CREATE POLICY "Allow public select orders" ON orders FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Allow public update orders" ON orders;
        CREATE POLICY "Allow public update orders" ON orders FOR UPDATE USING (true);
        
        DROP POLICY IF EXISTS "Allow public delete orders" ON orders;
        CREATE POLICY "Allow public delete orders" ON orders FOR DELETE USING (true);
        
        -- 2. Order items policies
        ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Allow public insert to order_items" ON order_items;
        CREATE POLICY "Allow public insert to order_items" ON order_items FOR INSERT WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Allow public select order_items" ON order_items;
        CREATE POLICY "Allow public select order_items" ON order_items FOR SELECT USING (true);
    """)
    conn.commit()
    print("Successfully configured Supabase orders RLS policies!")
except Exception as e:
    print("Psycopg2 error:", e)
