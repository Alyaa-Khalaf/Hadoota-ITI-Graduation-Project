export const inactivityReminderTemplate = (parentName, childName, daysInactive) => ({
  subject: `${childName} مالعبش من ${daysInactive} أيام — حدوتة 📚`,
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
        .header h1 { color: #FFFFFF; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: #CECBF6; font-size: 15px; }
        .logo { font-size: 48px; margin-bottom: 16px; }
        .body { padding: 40px 32px; }
        .greeting { font-size: 18px; font-weight: 600; color: #26215C; margin-bottom: 16px; }
        .text { font-size: 15px; color: #666; line-height: 1.8; margin-bottom: 24px; }
        .highlight { background: #F5F4FE; border-radius: 12px; padding: 24px; margin-bottom: 32px; text-align: center; }
        .highlight-value { font-size: 36px; font-weight: 700; color: #534AB7; margin-bottom: 8px; }
        .highlight-label { font-size: 14px; color: #666; }
        .btn { display: block; background: #534AB7; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 auto 32px; width: fit-content; }
        .footer { background: #F5F4FE; padding: 24px 32px; text-align: center; }
        .footer p { font-size: 13px; color: #888; }
        .footer span { color: #534AB7; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚</div>
          <h1>تذكير بالنشاط</h1>
          <p>حدوتة — رفيق الطفل الذكي</p>
        </div>
        <div class="body">
          <p class="greeting">أهلاً يا ${parentName}! 👋</p>
          <p class="text">
            ${childName} مالعبش على حدوتة من ${daysInactive} أيام — ممكن يكون محتاج تشجيع بسيط!
          </p>
          <div class="highlight">
            <div class="highlight-value">${daysInactive} أيام</div>
            <div class="highlight-label">من غير نشاط على حدوتة</div>
          </div>
          <p class="text">
            الحدوتات التفاعلية بتساعد طفلك يتعلم بطريقة ممتعة — شجّعه يرجع يكمل مغامرته!
          </p>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">شوف تقدم ${childName} 📈</a>
        </div>
        <div class="footer">
          <p>تم إرسال الإيميل ده من <span>حدوتة</span> — رفيق الطفل الذكي</p>
          <p style="margin-top: 8px;">© 2026 Hadoota. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,
});
