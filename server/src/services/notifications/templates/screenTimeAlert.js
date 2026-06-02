export const screenTimeAlertTemplate = (parentName, childName, timeSpent, limit) => ({
  subject: `${childName} خلص وقت الشاشة النهارده — حدوتة ⏰`,
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
        .header { background: #EF9F27; padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #FFF3DC; font-size: 15px; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #26215C; margin-bottom: 16px; }
        .text { font-size: 15px; color: #666; line-height: 1.8; margin-bottom: 24px; }
        .stats { background: #FAEEDA; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center; }
        .stat-value { font-size: 48px; font-weight: 700; color: #EF9F27; margin-bottom: 8px; }
        .stat-label { font-size: 14px; color: #633806; }
        .btn { display: block; background: #534AB7; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 auto 32px; width: fit-content; }
        .footer { background: #F5F4FE; padding: 24px 32px; text-align: center; }
        .footer p { font-size: 13px; color: #888; }
        .footer span { color: #534AB7; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⏰</div>
          <h1>خلص وقت الشاشة!</h1>
          <p>حدوتة — رفيق الطفل الذكي</p>
        </div>
        <div class="body">
          <p class="greeting">أهلاً يا ${parentName}! 👋</p>
          <p class="text">
            ${childName} خلص الوقت المسموح بيه النهارده على حدوتة!
          </p>
          <div class="stats">
            <div class="stat-value">${timeSpent} دقيقة</div>
            <div class="stat-label">من أصل ${limit} دقيقة يومياً</div>
          </div>
          <p class="text">
            لو عايز تزود الوقت النهارده أو تعدل الحد اليومي — روح للداشبورد.
          </p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">عدل إعدادات وقت الشاشة ⚙️</a>
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
