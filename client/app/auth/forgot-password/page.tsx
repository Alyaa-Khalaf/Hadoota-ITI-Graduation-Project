"use client";
import { useState } from "react";
import ForgotStep1_Email from "../../components/auth/ForgotStep1_Email";
import ForgotStep2_Code from "../../components/auth/ForgotStep2_Code";
import ForgotStep3_NewPassword from "../../components/auth/ForgotStep3_NewPassword";
import ForgotStep4_Success from "../../components/auth/ForgotStep4_Success";

export default function ForgotPasswordPage() {
  // تتبع الخطوة الحالية: 1 = الإيميل، 2 = الكود، 3 = الباسورد الجديد، 4 = النجاح
  const [step, setStep] = useState(1);
  // هنحفظ الإيميل هنا عشان هنحتاجه نبعته مع الكود والباسورد الجديد للـ API
  const [email, setEmail] = useState(""); 

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF6F0] font-sans" dir="rtl">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-border-warm/40">
        
        {/* الخطوة 1: إدخال البريد الإلكتروني */}
        {step === 1 && (
          <ForgotStep1_Email 
            onNext={nextStep} 
            setEmail={setEmail} 
            email={email} 
          />
        )}

        {/* الخطوة 2: إدخال رمز التحقق (Reset Code) */}
        {step === 2 && (
          <ForgotStep2_Code 
            onNext={nextStep} 
            onPrev={prevStep} 
            email={email} 
          />
        )}

        {/* الخطوة 3: تعيين كلمة المرور الجديدة */}
        {step === 3 && (
          <ForgotStep3_NewPassword 
            onNext={nextStep} 
            onPrev={prevStep} 
            email={email} 
          />
        )}

        {/* الخطوة 4: رسالة النجاح النهائية */}
        {step === 4 && (
          <ForgotStep4_Success />
        )}

      </div>
    </div>
  );
}