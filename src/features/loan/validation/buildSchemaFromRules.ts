import { z } from "zod";
import type { LoanProduct, ValidationRulesResponse } from "../domain/types";

export function buildLoanSchema(
  rules: ValidationRulesResponse,
  selectedProduct?: LoanProduct,
) {
  const personalInfo = z.object({
    age: z
      .number()
      .min(rules.personalInfo.age.min ?? 0, {
        message: rules.personalInfo.age.errorMessage,
      })
      .max(rules.personalInfo.age.max ?? 120, {
        message: rules.personalInfo.age.errorMessage,
      }),

    employmentStatus: z.enum(
      rules.personalInfo.employmentStatus.options as [string, ...string[]],
      {
        message: rules.personalInfo.employmentStatus.errorMessage,
      },
    ),

    employmentDuration: z
      .number()
      .min(rules.personalInfo.employmentDuration.min ?? 0, {
        message: rules.personalInfo.employmentDuration.errorMessage,
      }),
  });

  const financialInfo = z.object({
    monthlyIncome: z.number().min(rules.financialInfo.monthlyIncome.min ?? 0, {
      message: rules.financialInfo.monthlyIncome.errorMessage,
    }),

    monthlyExpenses: z
      .number()
      .min(rules.financialInfo.monthlyExpenses.min ?? 0, {
        message: rules.financialInfo.monthlyExpenses.errorMessage,
      }),

    existingDebt: z.number().min(0),

    creditScore: z
      .number()
      .min(rules.financialInfo.creditScore?.min ?? 300, {
        message: rules.financialInfo.creditScore?.errorMessage,
      })
      .max(rules.financialInfo.creditScore?.max ?? 850, {
        message: rules.financialInfo.creditScore?.errorMessage,
      })
      .optional(),
  });

  // Calculate effective min/max for requestedAmount and loanTerm based on global rules and selected product constraints
  const globalMinAmount = rules.loanDetails.requestedAmount.min ?? 0;
  const globalMaxAmount = rules.loanDetails.requestedAmount.max ?? 9999999;

  const globalMinTerm = rules.loanDetails.loanTerm.min ?? 0;
  const globalMaxTerm = rules.loanDetails.loanTerm.max ?? 120;

  const effectiveMinAmount = selectedProduct
    ? Math.max(globalMinAmount, selectedProduct.minAmount)
    : globalMinAmount;

  const effectiveMaxAmount = selectedProduct
    ? Math.min(globalMaxAmount, selectedProduct.maxAmount)
    : globalMaxAmount;

  const effectiveMinTerm = selectedProduct
    ? Math.max(globalMinTerm, selectedProduct.minTerm)
    : globalMinTerm;

  const effectiveMaxTerm = selectedProduct
    ? Math.min(globalMaxTerm, selectedProduct.maxTerm)
    : globalMaxTerm;

  const loanDetails = z.object({
    loanType: z.string().min(1, {
      message: "Please select a loan product",
    }),

    requestedAmount: z
      .number()
      .min(effectiveMinAmount, {
        message: `Loan amount must be between ${effectiveMinAmount} and ${effectiveMaxAmount}`,
      })
      .max(effectiveMaxAmount, {
        message: `Loan amount must be between ${effectiveMinAmount} and ${effectiveMaxAmount}`,
      }),

    loanTerm: z
      .number()
      .min(effectiveMinTerm, {
        message: `Loan term must be between ${effectiveMinTerm} and ${effectiveMaxTerm} months`,
      })
      .max(effectiveMaxTerm, {
        message: `Loan term must be between ${effectiveMinTerm} and ${effectiveMaxTerm} months`,
      }),

    loanPurpose: z.string().min(1, {
      message: "Please select a loan purpose",
    }),
  });

  return z.object({
    personalInfo,
    financialInfo,
    loanDetails,
  });
}
