import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Email templates
const emailTemplates = {
  tierUpgradeApproved: (partnerName: string, newTier: string) => ({
    subject: '🎉 Tarif Yangilash Tasdiqlandi - BiznesYordam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">BiznesYordam.uz</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Tabriklaymiz, ${partnerName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sizning tarif yangilash so'rovingiz tasdiqlandi! 🎊
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Yangi Tarif: ${newTier}</h3>
            <p style="color: #6b7280;">
              Endi siz yangi tarifning barcha imkoniyatlaridan foydalanishingiz mumkin:
            </p>
            <ul style="color: #4b5563;">
              <li>Kamroq komissiya</li>
              <li>Ko'proq mahsulotlar</li>
              <li>Kengaytirilgan tahlillar</li>
              <li>Ustuvor qo'llab-quvvatlash</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'https://biznesyordam.uz'}/partner/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Dashboardga O'tish
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">
            Savol yoki yordam kerak bo'lsa, biz bilan bog'laning: support@biznesyordam.uz
          </p>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © 2025 BiznesYordam.uz. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    `,
  }),

  newOrder: (partnerName: string, orderDetails: any) => ({
    subject: '🛒 Yangi Buyurtma - BiznesYordam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">BiznesYordam.uz</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Salom, ${partnerName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Sizga yangi buyurtma keldi! 🎉
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #667eea; margin-top: 0;">Buyurtma Tafsilotlari</h3>
            <table style="width: 100%; color: #4b5563;">
              <tr>
                <td style="padding: 8px 0;"><strong>Buyurtma ID:</strong></td>
                <td style="padding: 8px 0;">${orderDetails.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Mahsulot:</strong></td>
                <td style="padding: 8px 0;">${orderDetails.product}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Miqdor:</strong></td>
                <td style="padding: 8px 0;">${orderDetails.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;"><strong>Summa:</strong></td>
                <td style="padding: 8px 0;"><strong>${orderDetails.amount} so'm</strong></td>
              </tr>
            </table>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'https://biznesyordam.uz'}/partner/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Buyurtmani Ko'rish
            </a>
          </div>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © 2025 BiznesYordam.uz. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    `,
  }),

  weeklyReport: (partnerName: string, reportData: any) => ({
    subject: '📊 Haftalik Hisobot - BiznesYordam',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">BiznesYordam.uz</h1>
          <p style="color: white; margin: 10px 0 0 0;">Haftalik Hisobot</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Salom, ${partnerName}!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
            Mana sizning o'tgan hafta natijalari:
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div style="text-align: center; padding: 15px; background: #f0f9ff; border-radius: 6px;">
                <p style="color: #0369a1; font-size: 14px; margin: 0;">Aylanma</p>
                <p style="color: #0c4a6e; font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">
                  ${reportData.revenue.toLocaleString()} so'm
                </p>
              </div>
              <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 6px;">
                <p style="color: #15803d; font-size: 14px; margin: 0;">Buyurtmalar</p>
                <p style="color: #14532d; font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">
                  ${reportData.orders}
                </p>
              </div>
              <div style="text-align: center; padding: 15px; background: #fef3c7; border-radius: 6px;">
                <p style="color: #b45309; font-size: 14px; margin: 0;">Foyda</p>
                <p style="color: #78350f; font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">
                  ${reportData.profit.toLocaleString()} so'm
                </p>
              </div>
              <div style="text-align: center; padding: 15px; background: #fce7f3; border-radius: 6px;">
                <p style="color: #be185d; font-size: 14px; margin: 0;">Foyda Marjasi</p>
                <p style="color: #831843; font-size: 24px; font-weight: bold; margin: 10px 0 0 0;">
                  ${reportData.margin}%
                </p>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.APP_URL || 'https://biznesyordam.uz'}/partner/dashboard" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
              To'liq Hisobotni Ko'rish
            </a>
          </div>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px;">
            © 2025 BiznesYordam.uz. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </div>
    `,
  }),
};

// Send email function
export async function sendEmail(to: string, template: keyof typeof emailTemplates, data: any) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured, skipping email send');
      return { success: false, message: 'SMTP not configured' };
    }

    const emailContent = emailTemplates[template](data.name, data);

    const info = await transporter.sendMail({
      from: `"BiznesYordam" <${process.env.SMTP_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Scheduled reports function
export async function sendScheduledReports() {
  // This will be called by a cron job
  // For now, it's a placeholder
  console.log('Sending scheduled reports...');
}
