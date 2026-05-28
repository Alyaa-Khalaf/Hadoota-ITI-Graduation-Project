'use client'

import { APP_NAME, APP_DESCRIPTION } from '@/utils/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{APP_NAME}</h3>
            <p className="text-gray-400">{APP_DESCRIPTION}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">الرئيسية</a></li>
              <li><a href="#" className="hover:text-white">القصص</a></li>
              <li><a href="#" className="hover:text-white">عن التطبيق</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400">
              <li>البريد: info@hadoota.com</li>
              <li>الهاتف: +20 1234567890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {APP_NAME}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
