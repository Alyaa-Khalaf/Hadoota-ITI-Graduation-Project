import sgMail from '@sendgrid/mail'

let initialized = false

const initSendGrid = () => {
  if (initialized) return Boolean(process.env.SENDGRID_API_KEY)
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not set — emails will be skipped')
    return false
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  initialized = true
  return true
}

export const sendEmail = async (to, templateFn, ...templateArgs) => {
  if (!initSendGrid()) return { sent: false, reason: 'SendGrid not configured' }

  const { subject, html } = templateFn(...templateArgs)
  const from = process.env.EMAIL_FROM || 'noreply@hadoota.com'

  try {
    await sgMail.send({ to, from, subject, html })
    return { sent: true }
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message)
    return { sent: false, reason: error.message }
  }
}

export const sendRawEmail = async (to, subject, html) => {
  if (!initSendGrid()) return { sent: false, reason: 'SendGrid not configured' }

  const from = process.env.EMAIL_FROM || 'noreply@hadoota.com'

  try {
    await sgMail.send({ to, from, subject, html })
    return { sent: true }
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message)
    return { sent: false, reason: error.message }
  }
}
