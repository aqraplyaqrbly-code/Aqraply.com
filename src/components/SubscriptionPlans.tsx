import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, Crown, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "../contexts/AuthContextNew";

interface SubscriptionPlansProps {
  storeId: Id<"stores">;
}

export default function SubscriptionPlans({ storeId }: SubscriptionPlansProps) {
  const { sessionToken, isAuthenticated } = useAuth();
  const plans = useQuery(api.subscriptions.getActivePlans);
  const currentSubscription = useQuery(api.subscriptions.getStoreSubscription, isAuthenticated && sessionToken ? { sessionToken, storeId } : "skip");
  const subscribeToPlan = useMutation(api.subscriptions.subscribeToPlan);

  const handleSubscribe = async (planId: Id<"subscriptionPlans">) => {
    try {
      await subscribeToPlan({
        sessionToken,
        storeId,
        planId,
        autoRenew: true,
      });
      toast.success("تم تفعيل الاشتراك بنجاح! 🎉");
    } catch (error) {
      const message = error instanceof Error ? error.message : "حدث خطأ";
      toast.error(message);
    }
  };

  if (!plans) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-orange-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          اختر الباقة المناسبة لمتجرك
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          باقات مرنة تناسب جميع أحجام المتاجر مع مميزات حصرية
        </p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                اشتراكك الحالي: {currentSubscription.plan?.nameAr}
              </h3>
              <p className="text-gray-600">
                ينتهي في:{" "}
                {new Date(currentSubscription.endDate).toLocaleDateString("ar-SA")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isCurrentPlan = currentSubscription?.planId === plan._id;
          const colors = [
            { from: "from-blue-500", to: "to-blue-600", bg: "bg-blue-50" },
            { from: "from-orange-500", to: "to-red-600", bg: "bg-orange-50" },
            { from: "from-purple-500", to: "to-purple-600", bg: "bg-purple-50" },
          ];
          const color = colors[index % colors.length];

          return (
            <div
              key={plan._id}
              className={`relative rounded-2xl p-8 transition-all hover:shadow-2xl hover:-translate-y-2 ${
                plan.isFeatured
                  ? "border-4 border-orange-500 shadow-xl"
                  : "border-2 border-gray-200"
              } bg-white`}
            >
              {/* Featured Badge */}
              {plan.isFeatured && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2">
                  <div className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    الأكثر شعبية
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${color.from} ${color.to} rounded-2xl flex items-center justify-center shadow-lg`}
                >
                  {index === 0 && <Zap className="w-8 h-8 text-white" />}
                  {index === 1 && <TrendingUp className="w-8 h-8 text-white" />}
                  {index === 2 && <Crown className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.nameAr}
                </h3>
                <p className="text-gray-600 mb-4">{plan.descriptionAr}</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">EGP</span>
                  <span className="text-gray-500">/ {plan.duration} يوم</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.featuresAr.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-start">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscribe(plan._id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  isCurrentPlan
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : `bg-gradient-to-r ${color.from} ${color.to} text-white hover:shadow-lg hover:scale-105`
                }`}
              >
                {isCurrentPlan ? "الباقة الحالية" : "اشترك الآن"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          لماذا الاشتراك المدفوع؟
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">زيادة المبيعات</h4>
            <p className="text-gray-600 text-sm">
              ظهور أفضل في نتائج البحث يعني المزيد من الطلبات
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">عمولة أقل</h4>
            <p className="text-gray-600 text-sm">
              نسبة عمولة مخفضة تعني أرباح أكثر لك
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-500 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">مميزات حصرية</h4>
            <p className="text-gray-600 text-sm">
              أدوات تسويقية وتحليلات متقدمة لنمو متجرك
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
