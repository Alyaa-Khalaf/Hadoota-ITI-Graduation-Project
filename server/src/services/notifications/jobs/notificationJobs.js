import cron from 'node-cron'
import { sendWeeklyReports, sendInactivityReminders } from '../notificationService.js'

export const startNotificationJobs = () => {
  // Every Monday at 9:00 AM (server timezone)
  cron.schedule('0 9 * * 1', async () => {
    console.log('⏰ Running weekly report job...')
    try {
      await sendWeeklyReports()
    } catch (error) {
      console.error('Weekly report job failed:', error.message)
    }
  })

  // Daily at 10:00 AM — check inactive children (3+ days)
  cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Running inactivity reminder job...')
    try {
      await sendInactivityReminders()
    } catch (error) {
      console.error('Inactivity reminder job failed:', error.message)
    }
  })

  console.log('📅 Notification cron jobs scheduled')
}
