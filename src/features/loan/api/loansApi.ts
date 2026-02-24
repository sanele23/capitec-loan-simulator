import type {
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  LoanProductsResponse,
  ValidationRulesResponse,
} from "../domain/types";

// Fetch available loan products
export async function getLoanProducts(): Promise<LoanProductsResponse> {
  const response = await fetch("/api/loans/products");

  if (!response.ok) {
    throw new Error("failed to fetch loan products.");
  }

  return response.json();
}

// Fetch dynamic validation rules for loan applications
export async function getValidationRules(): Promise<ValidationRulesResponse> {
  const response = await fetch("/api/loans/validation-rules");

  if (!response.ok) {
    throw new Error("failed to fetch validation rules.");
  }

  return response.json();
}

// Submit loan eligibility check
export async function checkLoanEligibility(
  payload: LoanEligibilityRequest,
): Promise<LoanEligibilityResponse> {
  const response = await fetch("/api/loans/eligibility", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("failed to check loan eligibility.");
  }

  return response.json();
}
