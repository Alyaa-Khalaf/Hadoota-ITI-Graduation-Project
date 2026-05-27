export const weeklyReportTemplate = (parentName, childName, report) => ({
  subject: `تقرير ${childName} الأسبوعي — حدوتة 📊`,
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
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
        .stat { background: #F5F4FE; border-radius: 12px; padding: 20px; text-align: center; }
        .stat-value { font-size: 32px; font-weight: 700; color: #534AB7; margin-bottom: 4px; }
        .stat-label { font-size: 12px; color: #888; }
        .summary { background: #F5F4FE; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
        .summary h3 { font-size: 16px; font-weight: 600; color: #26215C; margin-bottom: 12px; }
        .summary p { font-size: 14px; color: #666; line-height: 1.8; }
        .topics { margin-bottom: 24px; }
        .topics h3 { font-size: 16px; font-weight: 600; color: #26215C; margin-bottom: 12px; }
        .topic-tag { display: inline-block; background: #EEEDFE; color: #534AB7; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 500; margin: 4px; }
        .btn { display: block; background: #534AB7; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-align: center; margin: 0 auto 32px; width: fit-content; }
        .footer { background: #F5F4FE; padding: 24px 32px; text-align: center; }
        .footer p { font-size: 13px; color: #888; }
        .footer span { color: #534AB7; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📊</div>
          <h1>التقرير الأسبوعي</h1>
          <p>${childName} — حدوتة</p>
        </div>
        <div class="body">
          <p class="greeting">أهلاً يا ${parentName}! 👋</p>
          <p class="text">
            اتفضل تقرير ${childName} للأسبوع اللي فات — شوف إيه اللي اتعلمه!
          </p>
          <div class="stats">
            <div class="stat">
              <div class="stat-value">${report.storiesCount || 0}</div>
              <div class="stat-label">حدوتة اتسمعت</div>
            </div>
            <div class="stat">
              <div class="stat-value">${report.quizScore || 0}%</div>
              <div class="stat-label">متوسط الكويز</div>
            </div>
            <div class="stat">
              <div class="stat-value">${report.stars || 0}⭐</div>
              <div class="stat-label">نجوم اتكسبت</div>
            </div>
          </div>
          <div class="summary">
            <h3>ملخص الأسبوع</h3>
            <p>${report.summary || 'أسبوع رائع مليان تعلم ومغامرات!'}</p>
          </div>
          <div class="topics">
            <h3>المواضيع اللي اتعلمها</h3>
            ${report.topics?.map(topic => `<span class="topic-tag">${topic}</span>`).join('') || '<span class="topic-tag">لسه ما بدأش</span>'}
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard" class="btn">شوف التقرير الكامل 📈</a>
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
