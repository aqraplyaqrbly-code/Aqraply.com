import { Calculator, DollarSign, TrendingUp, Info } from "lucide-react";

interface ContractExitCalculatorProps {
  exitDetails: {
    paidAmount: number;
    remainingInstallments: number;
    installmentAmount: number;
    overPrice: number;
  };
  size?: "sm" | "md" | "lg";
}

export default function ContractExitCalculator({
  exitDetails,
  size = "md",
}: ContractExitCalculatorProps) {
  const { paidAmount, remainingInstallments, installmentAmount, overPrice } = exitDetails;

  // Calculate total remaining installments
  const totalRemainingInstallments = remainingInstallments * installmentAmount;

  // Calculate total cash required now
  const totalCashRequired = paidAmount + overPrice;

  // Calculate total investment
  const totalInvestment = totalCashRequired + totalRemainingInstallments;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const spacingClasses = {
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <Calculator className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="font-bold text-orange-900">حاسبة التنازل</h3>
      </div>

      {/* Calculations */}
      <div className={`space-y-3 ${spacingClasses[size]}`}>
        {/* Cash Required Now */}
        <div className="bg-white rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">المطلوب كاش حالياً</span>
            </div>
            <span className={`font-bold text-orange-600 ${sizeClasses[size]}`}>
              {totalCashRequired.toLocaleString()} EGP
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3" />
            <span>المقدم المدفوع + الزيادة (المتخارج)</span>
          </div>
        </div>

        {/* Remaining Installments */}
        <div className="bg-white rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-gray-600">الأقساط المتبقية</span>
            </div>
            <span className={`font-bold text-orange-600 ${sizeClasses[size]}`}>
              {totalRemainingInstallments.toLocaleString()} EGP
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {remainingInstallments} قسط × {installmentAmount.toLocaleString()} EGP
          </div>
        </div>

        {/* Total Investment */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3 border-2 border-orange-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-orange-900">إجمالي الاستثمار</span>
            <span className={`font-bold text-orange-700 ${sizeClasses[size]}`}>
              {totalInvestment.toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-4 text-xs text-orange-700 bg-orange-100/50 rounded-lg p-2">
        <div className="flex items-start gap-2">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <p>
            هذه الحسابات تقديرية بناءً على البيانات المقدمة. يرجى التأكد من التفاصيل مع المالك.
          </p>
        </div>
      </div>
    </div>
  );
}
