-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  description_ar TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  products JSONB NOT NULL DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read for products
CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  USING (true);

-- Allow public insert/update/delete for products (admin will use anon key)
CREATE POLICY "Products are publicly writable"
  ON products FOR ALL
  USING (true);

-- Allow public insert for orders
CREATE POLICY "Orders can be inserted by anyone"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Allow public read/update for orders
CREATE POLICY "Orders are readable"
  ON orders FOR SELECT
  USING (true);

CREATE POLICY "Orders are updatable"
  ON orders FOR UPDATE
  USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: allow uploads
CREATE POLICY "Allow public uploads to product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public reads from product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow public deletes from product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');

-- Sample products
INSERT INTO products (name_ar, name_en, price, category, description_ar, description_en, stock, images) VALUES
('سيروم فيتامين سي COSRX', 'COSRX Vitamin C Serum', 12.500, 'skincare', 'سيروم فيتامين سي من كوسركس يعمل على توحيد لون البشرة وإضفاء الإشراق', 'COSRX Vitamin C serum brightens and evens skin tone', 25, '{}'),
('كريم الحلزون COSRX', 'COSRX Snail 92 Cream', 8.750, 'skincare', 'كريم الحلزون المرطب والمغذي للبشرة من كوسركس', 'COSRX snail mucin cream for deep hydration and repair', 30, '{}'),
('واقي شمس Anessa', 'Anessa Perfect UV Sunscreen', 15.000, 'sunscreen', 'واقي الشمس الذهبي من أنيسا SPF50+ مقاوم للماء', 'Anessa perfect UV sunscreen SPF50+, water resistant', 20, '{}'),
('قناع الكلاي إنيسفري', 'Innisfree Super Volcanic Clay Mask', 6.500, 'masks', 'قناع الطين البركاني من إنيسفري ينقي المسام', 'Innisfree volcanic clay mask for pore care', 40, '{}');
