import type { LoanEligibilityResponse } from "../domain/types";

interface Props {
  result: LoanEligibilityResponse;
}

export function EligibilityResultCard({ result }: Props) {
  const { eligibilityResult } = result;

  const statusColor =
    eligibilityResult.riskCategory === "low"
      ? "bg-green-100 text-green-700"
      : eligibilityResult.riskCategory === "medium"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="mt-8 p-6 border rounded bg-stone-50">
      <h2 className="text-lg font-semibold mb-4">Eligibility Result</h2>

      <div className={`inline-block px-3 py-1 rounded text-sm ${statusColor}`}>
        {eligibilityResult.riskCategory.toUpperCase()} RISK
      </div>

      <p className="mt-4">
        <strong>Status:</strong>{" "}
        {eligibilityResult.isEligible ? "Eligible" : "Not Eligible"}
      </p>

      <p>
        <strong>Approval Likelihood:</strong>{" "}
        {eligibilityResult.approvalLikelihood}%
      </p>

      <p className="mt-2 text-sm text-stone-600">
        {eligibilityResult.decisionReason}
      </p>

      {eligibilityResult.isEligible && eligibilityResult.riskExplanation && (
        <p className="mt-2 text-yellow-700 text-sm">
          {eligibilityResult.riskExplanation}
        </p>
      )}

      {/* NOT ELIGIBLE SUGGESTIONS */}
      {!eligibilityResult.isEligible &&
        eligibilityResult.suggestions &&
        eligibilityResult.suggestions.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">How to improve eligibility:</p>
            <ul className="list-disc list-inside text-sm mt-2">
              {eligibilityResult.suggestions.map((s, index) => (
                <li key={index}>{s}</li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
}
