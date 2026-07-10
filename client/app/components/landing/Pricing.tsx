"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/Card";
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
    <section id="pricing" className="bg-section-alt py-24" dir="rtl">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <Badge variant="secondary"
            size={"lg"}>💰 الأسعار بخطط مرنة</Badge>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            اختر الخطة المناسبة <span className="text-gradient-primary">لطفلك</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            حلول مرنة تناسب احتياجات الأطفال والأهل مع ميزات واضحة وبدون مصاريف مخفية.
          </p>
        </motion.div>

        {plans.length === 0 ? (
          <p className="text-center text-base font-semibold text-muted-foreground">
            لا توجد خطط متاحة حالياً.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-3 items-stretch">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex"
              >
                <Card
                  className={`group w-full flex flex-col justify-between rounded-2xl card-elevated hover:card-elevated-hover transition-all duration-300 hover:-translate-y-1 ${
                    plan.highlight ? "border-2 border-primary shadow-xl" : "border-0"
                  }`}
                >
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div>
                      {plan.badge && (
                        <div className="mb-5">
                          <Badge variant={plan.highlight ? "default" : "secondary"}
                         size="md" className="rounded-full p-3 text-xs"
                          >
                            {plan.badge}
                          </Badge>
                        </div>
                      )}

                      <h3 className="font-heading text-xl font-semibold text-card-foreground">
                        {plan.name}
                      </h3>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-5xl font-black text-foreground tracking-tight">
                          {plan.price}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {plan.currency === "EGP" ? "جنيه" : plan.currency} /{" "}
                          {plan.durationDays >= 365 ? "سنوياً" : "شهرياً"}
                        </span>
                      </div>

                      {plan.description && (
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                          {plan.description}
                        </p>
                      )}

                      <ul className="mt-8 space-y-4 text-sm font-medium text-card-foreground">
                        {(plan.features ?? []).map((feature) => (
                          <li key={feature} className="flex items-center gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Check className="h-3 w-3" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10">
                      <Button
                        variant={plan.highlight ? "default" : "outline"}
                        size={"lg"}
                        className="w-full text-base font-semibold rounded-full"
                        onClick={() => handleChoose(plan.slug)}
                        disabled={checkoutSlug !== null}
                      >
                        {checkoutSlug === plan.slug ? (
                          <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري التحويل للدفع...
                          </>
                        ) : (
                          `اختر خطة ${plan.name}`
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}