import { LoanForm } from "../components/LoanForm";
import { useLoanProducts } from "../hooks/useLoanProducts";
import { useValidationRules } from "../hooks/useValidationRules";
import { useLoanEligibility } from "../hooks/useLoanEligibility";
import type { LoanEligibilityRequest } from "../domain/types";
import { EligibilityResultCard } from "../components/EligibilityResultCard";

export function LoanSimulatorPage() {
  // Fetch loan products and validation rules
  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
  } = useLoanProducts();

  const {
    data: validationRules,
    isLoading: rulesLoading,
    isError: rulesError,
  } = useValidationRules();

  // Loan eligibility mutation
  const {
    mutate,
    data: eligibilityResult,
    isPending,
    isError: eligibilityError,
    reset,
  } = useLoanEligibility();

  // Handle loading and error states for configuration
  if (productsLoading || rulesLoading) {
    return <div className="p-8">Loading loan configuration...</div>;
  }

  // Handle errors in fetching configuration
  if (productsError || rulesError || !productsData || !validationRules) {
    return (
      <div className="p-8 text-red-500">
        Failed to load loan simulator configuration.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold mb-6">Loan Eligibility Simulator</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <LoanForm
            validationRules={validationRules}
            products={productsData.products}
            isSubmitting={isPending}
            onSubmit={(data) => {
              reset(); // Reset previous eligibility result/error
              mutate({
                ...data,
                personalInfo: {
                  ...data.personalInfo,
                  employmentStatus: data.personalInfo
                    .employmentStatus as LoanEligibilityRequest["personalInfo"]["employmentStatus"],
                },
              });
            }}
          />
        </div>
        {/* Eligibility Result */}
        {eligibilityResult && !isPending && (
          <>
            <EligibilityResultCard result={eligibilityResult} />

            {/* Recommended Loan Breakdown */}
            <div className="mt-6 p-4 border rounded bg-stone-50">
              <h3 className="font-semibold text-lg mb-3">
                Recommended Loan Breakdown
              </h3>

              <p>
                <strong>Maximum Eligible Amount:</strong> R
                {eligibilityResult.recommendedLoan.maxAmount.toLocaleString()}
              </p>

              <p>
                <strong>Recommended Amount:</strong> R
                {eligibilityResult.recommendedLoan.recommendedAmount.toLocaleString()}
              </p>

              <p>
                <strong>Interest Rate:</strong>{" "}
                {eligibilityResult.recommendedLoan.interestRate > 0
                  ? `${eligibilityResult.recommendedLoan.interestRate}%`
                  : "—"}
              </p>

              <p>
                <strong>Estimated Monthly Payment:</strong> R
                {eligibilityResult.recommendedLoan.monthlyPayment.toLocaleString()}
              </p>

              <p>
                <strong>Total Repayment:</strong> R
                {eligibilityResult.recommendedLoan.totalRepayment.toLocaleString()}
              </p>
            </div>

            {/* Affordability Analysis */}
            <div className="mt-6 p-4 border rounded bg-white">
              <h3 className="font-semibold text-lg mb-3">
                Affordability Analysis
              </h3>

              <p>
                <strong>Disposable Income:</strong> R
                {eligibilityResult.affordabilityAnalysis.disposableIncome.toLocaleString()}
              </p>

              <p>
                <strong>Debt-to-Income Ratio:</strong>{" "}
                {eligibilityResult.affordabilityAnalysis.debtToIncomeRatio.toFixed(
                  1,
                )}
                %
              </p>

              <p>
                <strong>Loan-to-Income Ratio:</strong>{" "}
                {eligibilityResult.affordabilityAnalysis.loanToIncomeRatio.toFixed(
                  1,
                )}
                %
              </p>

              <p>
                <strong>Affordability Score:</strong>{" "}
                <span
                  className={
                    eligibilityResult.affordabilityAnalysis
                      .affordabilityScore === "good"
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {eligibilityResult.affordabilityAnalysis.affordabilityScore.toUpperCase()}
                </span>
              </p>
            </div>
          </>
        )}

        {/* Mutation Error */}
        {eligibilityError && (
          <div className="mt-4 p-4 border rounded bg-red-50 text-red-600">
            Failed to check loan eligibility.
          </div>
        )}
      </div>
    </div>
  );
}
