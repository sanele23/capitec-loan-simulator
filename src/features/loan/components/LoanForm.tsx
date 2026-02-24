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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Personal Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Personal Info</h2>

        <input
          type="number"
          placeholder="Age"
          {...register("personalInfo.age", { valueAsNumber: true })}
          className="border p-2 w-full rounded"
        />
        {errors.personalInfo?.age && (
          <p className="text-red-500 text-sm">
            {errors.personalInfo.age.message}
          </p>
        )}

        <select
          {...register("personalInfo.employmentStatus")}
          className="border p-2 w-full rounded mt-2"
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
          <p className="text-red-500 text-sm">
            {errors.personalInfo.employmentStatus.message}
          </p>
        )}

        <input
          type="number"
          placeholder="Employment Duration (months)"
          {...register("personalInfo.employmentDuration", {
            valueAsNumber: true,
          })}
          className="border p-2 w-full rounded mt-2"
        />
        {errors.personalInfo?.employmentDuration && (
          <p className="text-red-500 text-sm">
            {errors.personalInfo.employmentDuration.message}
          </p>
        )}
      </div>

      {/* Financial Info */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Financial Info</h2>

        <input
          type="number"
          placeholder="Monthly Income"
          {...register("financialInfo.monthlyIncome", {
            valueAsNumber: true,
          })}
          className="border p-2 w-full rounded"
        />
        {errors.financialInfo?.monthlyIncome && (
          <p className="text-red-500 text-sm">
            {errors.financialInfo.monthlyIncome.message}
          </p>
        )}

        <input
          type="number"
          placeholder="Monthly Expenses"
          {...register("financialInfo.monthlyExpenses", {
            valueAsNumber: true,
          })}
          className="border p-2 w-full rounded mt-2"
        />
        {errors.financialInfo?.monthlyExpenses && (
          <p className="text-red-500 text-sm">
            {errors.financialInfo.monthlyExpenses.message}
          </p>
        )}

        <input
          type="number"
          placeholder="Existing Debt"
          {...register("financialInfo.existingDebt", {
            valueAsNumber: true,
          })}
          className="border p-2 w-full rounded mt-2"
        />
        {/* Credit Score (Optional) */}
        <input
          type="number"
          placeholder="Credit Score (Optional)"
          {...register("financialInfo.creditScore", {
            valueAsNumber: true,
            setValueAs: (value) =>
              value === "" || Number.isNaN(value) ? undefined : Number(value), // Convert empty string to undefined for optional field
          })}
          className="border p-2 w-full rounded mt-2"
        />
      </div>
      {/* Product Products */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Loan Product</h2>

        <select
          {...register("loanDetails.loanType")}
          className="border p-2 w-full rounded"
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
        <h2 className="text-lg font-semibold mb-2">Loan Details</h2>
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
          className="border p-2 w-full rounded"
        />
        {errors.loanDetails?.requestedAmount && (
          <p className="text-red-500 text-sm">
            {errors.loanDetails.requestedAmount.message}
          </p>
        )}

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
          className="border p-2 w-full rounded mt-2"
        />
        {errors.loanDetails?.loanTerm && (
          <p className="text-red-500 text-sm">
            {errors.loanDetails.loanTerm.message}
          </p>
        )}

        {/* Loan Purpose */}
        <select
          {...register("loanDetails.loanPurpose")}
          className="border p-2 w-full rounded mt-2"
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? "Checking..." : "Check Eligibility"}
      </button>
    </form>
  );
}
