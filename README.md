# منتجات الجمال الكورية — Korean Beauty Products Store

Full e-commerce store built with Next.js 14, Tailwind CSS, and Supabase.

## Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In **SQL Editor**, run the entire contents of `supabase-setup.sql`
3. In **Settings → API**, copy your **Project URL** and **anon public key**

### 2. Configure Environment Variables

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_PASSWORD=your-secure-password
```

### 3. Run Dev Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| URL | Description |
|-----|-------------|
| `/` | Home — hero, categories, featured products, Instagram CTA |
| `/products` | All products with search + category filter |
| `/products/[id]` | Product detail with image gallery |
| `/cart` | Shopping cart with quantity controls |
| `/checkout` | Order form — submits to Supabase + opens WhatsApp |
| `/admin` | Admin dashboard (password protected) |
| `/admin/products/new` | Add new product with image upload |
| `/admin/products/[id]` | Edit existing product |

## Features

- Bilingual (Arabic/English) with RTL support, Arabic default
- Pink elegant theme (#FF85A1)
- Cart with Zustand persistent state
- WhatsApp order notification to +962797749421
- Admin: add/edit/delete products, view orders, update order status
- Image upload to Supabase Storage
- Cash on delivery only
- Mobile responsive

## Admin Access

Default password: `admin123` — change `ADMIN_PASSWORD` in `.env.local`
