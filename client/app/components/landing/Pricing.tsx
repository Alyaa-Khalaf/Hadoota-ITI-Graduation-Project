"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_BASE } from "@/lib/apiConfig";
import type { Plan } from "@/types/pricing";

export default function Pricing() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [checkoutSlug, setCheckoutSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/plans`)
      .then((res) => res.json())
      .then((result) => {
        if (result?.success && Array.isArray(result.data)) setPlans(result.data);
      })
      .catch(() => {
        // فشل الجلب — نعرض حالة فاضية بدون كسر الصفحة
      });
  }, []);

  const handleChoose = (slug: string) => {
    setCheckoutSlug(slug);
    router.push(`/dashboard/subscription?plan=${encodeURIComponent(slug)}`);
  };

  return (
    <section id="pricing" className="py-24 md:py-32 bg-section-alt" dir="rtl">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-lg font-semibold text-primary uppercase tracking-wider">
            💰 الأسعار
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-3">
            اختر الخطة المناسبة <span className="text-gradient-primary">لطفلك</span>
          </h2>
          <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
            حلول مرنة تناسب احتياجات الأطفال والأهل مع ميزات واضحة وبدون مصاريف مخفية.
          </p>
        </motion.div>

        {plans.length === 0 ? (
          <p className="text-center text-lg font-semibold text-muted-foreground">
            لا توجد خطط متاحة حالياً.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto items-start">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative bg-card rounded-3xl p-10 shadow-card ${
                  plan.highlight ? "border-2 border-primary md:-mt-6 md:mb-6" : "border border-border"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-sm font-bold px-5 py-1.5 rounded-full">
                    الأكتر طلبًا
                  </span>
                )}

                {plan.badge && (
                  <span className="inline-block bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                    {plan.badge}
                  </span>
                )}

                <h3 className="text-2xl font-semibold text-foreground">{plan.name}</h3>

                <div className="mt-5 mb-7">
                  <span className="text-6xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-base">
                    {" "}
                    {plan.currency === "EGP" ? "جنيه" : plan.currency} /{" "}
                    {plan.durationDays >= 365 ? "سنوياً" : "شهرياً"}
                  </span>
                </div>

                {plan.description && (
                  <p className="text-base text-muted-foreground leading-relaxed mb-7">
                    {plan.description}
                  </p>
                )}

                <ul className="space-y-4 mb-10">
                  {(plan.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-base text-muted-foreground">
                      <Check className="w-5 h-5 text-accent shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.highlight ? "default" : "outline"}
                  size="lg"
                  className="w-full text-base"
                  onClick={() => handleChoose(plan.slug)}
                  disabled={checkoutSlug !== null}
                >
                  {checkoutSlug === plan.slug ? (
                    <>
                      <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                      جاري التحويل للدفع...
                    </>
                  ) : (
                    `اختر خطة ${plan.name}`
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}