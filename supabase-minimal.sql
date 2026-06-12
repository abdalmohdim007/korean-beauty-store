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
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_all" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true);

-- Sample products
INSERT INTO products (name_ar, name_en, price, category, description_ar, description_en, stock, images) VALUES
('سيروم فيتامين سي COSRX', 'COSRX Vitamin C Serum', 12.500, 'skincare',
 'سيروم فيتامين سي من كوسركس يعمل على توحيد لون البشرة وإضفاء الإشراق والحيوية',
 'COSRX Vitamin C serum brightens and evens skin tone with powerful antioxidants',
 25,
 ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80']),

('كريم الحلزون COSRX 92', 'COSRX Snail 92 All-in-One Cream', 8.750, 'skincare',
 'كريم الحلزون المرطب والمغذي للبشرة من كوسركس - مثالي للبشرة الجافة والتالفة',
 'COSRX snail mucin cream for deep hydration, repair and soothing of damaged skin',
 30,
 ARRAY['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80']),

('واقي الشمس الذهبي Anessa SPF50+', 'Anessa Perfect UV Sunscreen SPF50+', 15.000, 'sunscreen',
 'واقي الشمس الذهبي من أنيسا بحماية عالية SPF50+ مقاوم للماء والعرق',
 'Anessa perfect UV sunscreen SPF50+ PA++++, water and sweat resistant formula',
 20,
 ARRAY['https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=500&q=80']),

('قناع الطين البركاني إنيسفري', 'Innisfree Super Volcanic Clay Mask', 6.500, 'masks',
 'قناع الطين البركاني من إنيسفري ينقي المسام ويزيل الزيوت الزائدة لبشرة نضرة',
 'Innisfree volcanic clay mask deeply cleanses pores and controls excess sebum',
 40,
 ARRAY['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&q=80']),

('تونر السكر Laneige', 'Laneige Cream Skin Toner', 11.000, 'skincare',
 'تونر كريمي من لانيج يمنح البشرة الترطيب العميق والنعومة الفائقة',
 'Laneige cream skin toner for deep moisture and silky smooth skin texture',
 15,
 ARRAY['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&q=80']),

('كريم العين Etude House', 'Etude House Moistfull Eye Cream', 7.500, 'skincare',
 'كريم العين المرطب من إيتود هاوس يقلل الهالات السوداء ويرطب منطقة العين',
 'Etude House moistfull eye cream reduces dark circles and puffiness around eyes',
 35,
 ARRAY['https://images.unsplash.com/photo-1617897903246-719242758050?w=500&q=80']),

('سيروم النياسيناميد Some By Mi', 'Some By Mi Niacinamide 30 Days Serum', 9.500, 'skincare',
 'سيروم النياسيناميد من سم باي مي يوحد لون البشرة ويقلل البقع الداكنة',
 'Some By Mi niacinamide serum evens skin tone and fades dark spots in 30 days',
 28,
 ARRAY['https://images.unsplash.com/photo-1570194065650-d99fb4b38176?w=500&q=80']),

('احمر شفاه Romand', 'Romand Zero Velvet Tint', 5.500, 'makeup',
 'احمر شفاه مخملي من رومند بألوان عصرية وتثبيت طويل الأمد',
 'Romand velvet lip tint with trendy shades and long-lasting matte finish',
 50,
 ARRAY['https://images.unsplash.com/photo-1586495777744-4e6232bf4f3a?w=500&q=80']);
