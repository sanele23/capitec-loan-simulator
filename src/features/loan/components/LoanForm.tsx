import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildLoanSchema } from "../validation/buildSchemaFromRules";
import type { LoanProduct, ValidationRulesResponse } from "../domain/types";
import { z } from "zod";

type LoanFormSchema = ReturnType<typeof buildLoanSchema>;
type FormValues = z.infer<LoanFormSchema>;

interface LoanFormProps {
  validationRules: ValidationRulesResponse;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
  products: LoanProduct[];
}

export function LoanForm({
  validationRules,
  onSubmit,
  isSubmitting,
  products,
}: LoanFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<
    LoanProduct | undefined
  >();

  const schema = useMemo(
    () => buildLoanSchema(validationRules, selectedProduct),
    [validationRules, selectedProduct],
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  const selectedLoanType = watch("loanDetails.loanType");

  useEffect(() => {
    const product = products.find((p) => p.id === selectedLoanType);
    setSelectedProduct(product);
  }, [selectedLoanType, products]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-full">
      {/* Personal Info */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-stone-900">Personal Info</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              placeholder="Age"
              {...register("personalInfo.age", { valueAsNumber: true })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white"
            />
            {errors.personalInfo?.age && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personalInfo.age.message}
              </p>
            )}
          </div>

          <div>
            <select
              {...register("personalInfo.employmentStatus")}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white"
            >
              <option value="">Select employment status</option>
              {validationRules.personalInfo.employmentStatus.options?.map(
                (status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ),
              )}
            </select>
            {errors.personalInfo?.employmentStatus && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personalInfo.employmentStatus.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <input
              type="number"
              placeholder="Employment Duration (months)"
              {...register("personalInfo.employmentDuration", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white"
            />
            {errors.personalInfo?.employmentDuration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personalInfo.employmentDuration.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Financial Info */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-stone-900">
          Financial Info
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              placeholder="Monthly Income"
              {...register("financialInfo.monthlyIncome", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white font-medium"
            />
            {errors.financialInfo?.monthlyIncome && (
              <p className="text-red-500 text-sm mt-1">
                {errors.financialInfo.monthlyIncome.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Monthly Expenses"
              {...register("financialInfo.monthlyExpenses", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white font-medium"
            />
            {errors.financialInfo?.monthlyExpenses && (
              <p className="text-red-500 text-sm mt-1">
                {errors.financialInfo.monthlyExpenses.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Existing Debt"
              {...register("financialInfo.existingDebt", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white font-medium"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Credit Score (Optional)"
              {...register("financialInfo.creditScore", {
                setValueAs: (value) =>
                  value === "" || Number.isNaN(value)
                    ? undefined
                    : Number(value),
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white"
            />
          </div>
        </div>
      </div>
      {/* Product Products */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-stone-900">Loan Product</h2>

        <select
          {...register("loanDetails.loanType")}
          className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white"
        >
          <option value="">Select loan product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {errors.loanDetails?.loanType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.loanDetails.loanType.message}
          </p>
        )}
      </div>
      {/* Loan Details */}
      <div>
        <h2 className="text-lg font-bold mb-2 text-stone-900">Loan Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              placeholder={
                selectedProduct
                  ? `Amount (${selectedProduct.minAmount} - ${selectedProduct.maxAmount})`
                  : "Requested Amount"
              }
              {...register("loanDetails.requestedAmount", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white font-medium"
            />
            {errors.loanDetails?.requestedAmount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.loanDetails.requestedAmount.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder={
                selectedProduct
                  ? `Term (${selectedProduct.minTerm} - ${selectedProduct.maxTerm} months)`
                  : "Loan Term (months)"
              }
              {...register("loanDetails.loanTerm", {
                valueAsNumber: true,
              })}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white font-medium"
            />
            {errors.loanDetails?.loanTerm && (
              <p className="text-red-500 text-sm mt-1">
                {errors.loanDetails.loanTerm.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <select
              {...register("loanDetails.loanPurpose")}
              className="border border-stone-300 px-4 py-3 w-full rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-200 transition bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!selectedProduct}
            >
              <option value="">Select purpose</option>
              {selectedProduct?.purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-base transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Checking..." : "Check Eligibility"}
      </button>
    </form>
  );
}
