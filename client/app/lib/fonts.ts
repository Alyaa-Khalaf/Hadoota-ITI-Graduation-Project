// fonts(arabic, english)
import { Cairo, Tajawal } from 'next/font/google';

// إعداد خط Cairo
export const cairoFont = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'], 
  // تقدر تضيف الأوزان اللي محتاجها (مثلاً 400 للعادي و 700 للبولد)
  variable: '--font-cairo', // ده اسم المتغير اللي هنستخدمه في Tailwind
  display: 'swap',
});

// إعداد خط Tajawal
export const tajawalFont = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700'],
  variable: '--font-tajawal', 
  display: 'swap',
});