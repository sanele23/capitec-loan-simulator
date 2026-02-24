export interface InterestRateRange {
  min: number;
  max: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: InterestRateRange;
  purposes: string[];
}

export interface LoanProductsResponse {
  products: LoanProduct[];
}

export type EmployeeStatus =
  | "employed"
  | "self-employed"
  | "unemployed"
  | "retired";

export interface PersonalInfo {
  age: number;
  employmentStatus: EmployeeStatus;
  employmentDuration: number;
}

export interface FinancialInfo {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingDebt: number;
  creditScore?: number;
}

export interface LoanDetails {
  requestedAmount: number;
  loanTerm: number;
  loanPurpose: string;
  loanType: string; // Added field to specify the type of loan being applied for
}

export interface LoanEligibilityRequest {
  personalInfo: PersonalInfo;
  financialInfo: FinancialInfo;
  loanDetails: LoanDetails;
}

export type RiskCategory = "low" | "medium" | "high";

export interface EligibilityResult {
  isEligible: boolean;
  approvalLikelihood: number; // Percentage likelihood of approval
  riskCategory: "low" | "medium" | "high";
  decisionReason: string;
  riskExplanation?: string;
  suggestions?: string[];
}
export interface RecommendedLoan {
  maxAmount: number;
  recommendedAmount: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
}

export interface AffordabilityAnalysis {
  disposableIncome: number;
  debtToIncomeRatio: number;
  loanToIncomeRatio: number;
  affordabilityScore: string; // Composite score based on financial health
}

export interface LoanEligibilityResponse {
  eligibilityResult: EligibilityResult;
  recommendedLoan: RecommendedLoan;
  affordabilityAnalysis: AffordabilityAnalysis;
}

export interface FieldValidationRule {
  min?: number;
  max?: number;
  requered?: boolean;
  errorMessage?: string;
  options?: string[]; // For fields with predefined options (e.g., employment status)
}

export interface ValidationRulesResponse {
  personalInfo: Record<string, FieldValidationRule>;
  financialInfo: Record<string, FieldValidationRule>;
  loanDetails: Record<string, FieldValidationRule>;
}
