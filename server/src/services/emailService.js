import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@hadoota.app'

export const sendEmail = async (to, { subject, html }) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn(`📧 [EMAIL SKIPPED] No SENDGRID_API_KEY — would send "${subject}" to ${to}`)
    return
  }

  try {
    await sgMail.send({ to, from: FROM_EMAIL, subject, html })
    console.log(`📧 Email sent: "${subject}" → ${to}`)
  } catch (error) {
    // Log but never throw — email failure should not break the request
    console.error(`📧 Email failed to ${to}:`, error.response?.body?.errors || error.message)
  }
}
