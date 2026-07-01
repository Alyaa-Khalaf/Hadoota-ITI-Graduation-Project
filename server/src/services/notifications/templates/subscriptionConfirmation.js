export const subscriptionTemplate = (name, plan, amount, renewalDate) => ({
  subject: 'تأكيد الاشتراك — حدوتة 💳',
  html: `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', Arial, sans-serif; background-color: #F5F4FE; direction: rtl; }
        .container { max-width: 600px; margin: 40px auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(83,74,183,0.1); }
        .header { background: #0F6E56; padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #A8E6D5; font-size: 15px; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #26215C; margin-bottom: 16px; }
        .text { font-size: 15px; color: #666; line-height: 1.8; margin-bottom: 24px; }
        .invoice { background: #F5F4FE; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        .invoice-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #EEEDFE; }
        .invoice-row:last-child { border-bottom: none; font-weight: 700; color: #534AB7; font-size: 16px; }
        .invoice-label { font-size: 14px; color: #666; }
        .invoice-value { font-size: 14px; color: #26215C; font-weight: 500; }
        .btn { display: block; background: #534AB7; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 auto 32px; width: fit-content; }
        .footer { background: #F5F4FE; padding: 24px 32px; text-align: center; }
        .footer p { font-size: 13px; color: #888; }
        .footer span { color: #534AB7; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">✅</div>
          <h1>تم تأكيد الاشتراك!</h1>
          <p>حدوتة — رفيق الطفل الذكي</p>
        </div>
        <div class="body">
          <p class="greeting">أهلاً يا ${name}! 🎉</p>
          <p class="text">شكراً على اشتراكك في حدوتة — دلوقتي طفلك يقدر يستمتع بكل المميزات!</p>
          <div class="invoice">
            <div class="invoice-row">
              <span class="invoice-label">الخطة</span>
              <span class="invoice-value">${plan}</span>
            </div>
            <div class="invoice-row">
              <span class="invoice-label">المبلغ</span>
              <span class="invoice-value">${amount} ج.م/شهر</span>
            </div>
            <div class="invoice-row">
              <span class="invoice-label">تاريخ التجديد</span>
              <span class="invoice-value">${renewalDate}</span>
            </div>
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">روح للداشبورد 🚀</a>
        </div>
        <div class="footer">
          <p>تم إرسال الإيميل ده من <span>حدوتة</span> — رفيق الطفل الذكي</p>
          <p style="margin-top: 8px;">© 2026 Hadoota. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
})
