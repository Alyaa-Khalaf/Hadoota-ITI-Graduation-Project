export const welcomeTemplate = (name) => ({
  subject: `أهلاً بيك في حدوتة يا ${name}! 🌟`,
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
        .header { background: #534AB7; padding: 40px 32px; text-align: center; }
        .header h1 { color: #FFFFFF; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #CECBF6; font-size: 16px; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 20px; font-weight: 600; color: #26215C; margin-bottom: 16px; }
        .text { font-size: 15px; color: #666; line-height: 1.8; margin-bottom: 24px; }
        .features { background: #F5F4FE; border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        .feature { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .feature:last-child { margin-bottom: 0; }
        .feature-icon { font-size: 24px; }
        .feature-text { font-size: 14px; color: #534AB7; font-weight: 500; }
        .btn { display: block; background: #534AB7; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 auto 32px; width: fit-content; }
        .footer { background: #F5F4FE; padding: 24px 32px; text-align: center; }
        .footer p { font-size: 13px; color: #888; }
        .footer span { color: #534AB7; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌟</div>
          <h1>أهلاً بيك في حدوتة!</h1>
          <p>رفيق الطفل الذكي</p>
        </div>
        <div class="body">
          <p class="greeting">أهلاً يا ${name}! 👋</p>
          <p class="text">
            يسعدنا إنك انضمت لعائلة حدوتة — المكان اللي فيه أطفالك يسمعوا حدوتات تعليمية تفاعلية بالعربي مع الذكاء الاصطناعي!
          </p>
          <div class="features">
            <div class="feature">
              <span class="feature-icon">🤖</span>
              <span class="feature-text">حدوتات AI تتغير مع اختيارات طفلك</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎙️</span>
              <span class="feature-text">صوت وصور لكل مشهد</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📊</span>
              <span class="feature-text">تقارير أسبوعية عن تقدم طفلك</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🛡️</span>
              <span class="feature-text">محتوى آمن 100% للأطفال</span>
            </div>
          </div>
          <a href="${process.env.CLIENT_URL}" class="btn">ابدأ أول حدوتة دلوقتي 🚀</a>
          <p class="text">لو عندك أي سؤال — إحنا دايماً هنا!</p>
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
