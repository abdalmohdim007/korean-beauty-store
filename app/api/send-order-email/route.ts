import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(req: NextRequest) {
  try {
    const { customer_name, phone, city, address, products, total } = await req.json()

    const productRows = products
      .map(
        (p: { name_ar: string; quantity: number; price: number }) =>
          `<tr>
            <td style="padding:10px 14px;border-bottom:1px solid #fce4ec;font-size:14px;">${p.name_ar}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #fce4ec;text-align:center;font-size:14px;">${p.quantity}</td>
            <td style="padding:10px 14px;border-bottom:1px solid #fce4ec;text-align:center;font-size:14px;color:#e91e63;font-weight:bold;">${(p.price * p.quantity).toFixed(3)} د.أ</td>
          </tr>`
      )
      .join('')

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>طلب جديد</title>
</head>
<body style="margin:0;padding:0;background:#fff0f5;font-family:'Segoe UI',Tahoma,Arial,sans-serif;direction:rtl;">

  <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(255,133,161,0.15);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#ff85a1,#ffb6c8);padding:32px 24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">🌸</div>
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;letter-spacing:1px;">طلب جديد 🛍️</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">منتجات الجمال الكورية</p>
    </div>

    <!-- Customer info -->
    <div style="padding:24px 28px 0;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#333;border-bottom:2px solid #fce4ec;padding-bottom:8px;">معلومات العميل</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;color:#888;font-size:14px;width:120px;">👤 الاسم</td>
          <td style="padding:8px 0;color:#222;font-size:14px;font-weight:600;">${customer_name}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:14px;">📞 الهاتف</td>
          <td style="padding:8px 0;color:#222;font-size:14px;font-weight:600;" dir="ltr">${phone}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:14px;">📍 المدينة</td>
          <td style="padding:8px 0;color:#222;font-size:14px;font-weight:600;">${city}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:14px;">🏠 العنوان</td>
          <td style="padding:8px 0;color:#222;font-size:14px;font-weight:600;">${address}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#888;font-size:14px;">💳 الدفع</td>
          <td style="padding:8px 0;color:#4caf50;font-size:14px;font-weight:600;">الدفع عند الاستلام</td>
        </tr>
      </table>
    </div>

    <!-- Products -->
    <div style="padding:20px 28px 0;">
      <h2 style="margin:0 0 16px;font-size:16px;color:#333;border-bottom:2px solid #fce4ec;padding-bottom:8px;">المنتجات المطلوبة</h2>
      <table style="width:100%;border-collapse:collapse;background:#fffafb;border-radius:10px;overflow:hidden;">
        <thead>
          <tr style="background:#fce4ec;">
            <th style="padding:10px 14px;text-align:right;font-size:13px;color:#555;">المنتج</th>
            <th style="padding:10px 14px;text-align:center;font-size:13px;color:#555;">الكمية</th>
            <th style="padding:10px 14px;text-align:center;font-size:13px;color:#555;">السعر</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
    </div>

    <!-- Total -->
    <div style="padding:20px 28px 28px;">
      <div style="background:linear-gradient(135deg,#ff85a1,#e8607a);border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;">
        <span style="color:#fff;font-size:18px;font-weight:800;">المجموع الكلي</span>
        <span style="color:#fff;font-size:22px;font-weight:800;">${Number(total).toFixed(3)} دينار</span>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#fff0f5;padding:16px;text-align:center;border-top:1px solid #fce4ec;">
      <p style="margin:0;font-size:12px;color:#aaa;">
        تم إرسال هذا البريد تلقائياً من متجر منتجات الجمال الكورية 🌸
      </p>
    </div>

  </div>
</body>
</html>`

    await transporter.sendMail({
      from: `"منتجات الجمال الكورية 🌸" <${process.env.GMAIL_USER}>`,
      to: process.env.ORDER_NOTIFICATION_EMAIL || 'abedalmohdim@gmail.com',
      subject: `🛍️ طلب جديد من ${customer_name} — ${Number(total).toFixed(3)} دينار`,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Email error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
