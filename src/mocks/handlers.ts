import { http, HttpResponse } from "msw";
import type { LoanEligibilityRequest } from "../features/loan/domain/types";

export const handlers = [
  // PRODUCTS
  http.get("/api/loans/products", () => {
    return HttpResponse.json({
      products: [
        {
          id: "personal_loan",
          name: "Personal Loan",
          description: "Flexible personal financing",
          minAmount: 5000,
          maxAmount: 300000,
          minTerm: 6,
          maxTerm: 60,
          interestRateRange: {
            min: 10.5,
            max: 18.5,
          },
          purposes: [
            "debt_consolidation",
            "home_improvement",
            "education",
            "medical",
            "other",
          ],
        },
        {
          id: "vehicle_loan",
          name: "Vehicle Finance",
          description: "Financing for vehicles",
          minAmount: 50000,
          maxAmount: 1500000,
          minTerm: 12,
          maxTerm: 72,
          interestRateRange: {
            min: 8.5,
            max: 15.0,
          },
          purposes: ["new_vehicle", "used_vehicle"],
        },
      ],
    });
  }),

  // VALIDATION RULES
  http.get("/api/loans/validation-rules", () => {
    return HttpResponse.json({
      personalInfo: {
        age: {
          min: 18,
          max: 65,
          required: true,
          errorMessage: "Age must be between 18 and 65",
        },
        employmentStatus: {
          required: true,
          options: ["employed", "self_employed", "unemployed", "retired"],
          errorMessage: "Please select your employment status",
        },
        employmentDuration: {
          min: 3,
          required: true,
          errorMessage: "Minimum 3 months employment required",
        },
      },
      financialInfo: {
        monthlyIncome: {
          min: 5000,
          required: true,
          errorMessage: "Minimum monthly income of R5,000 required",
        },
        monthlyExpenses: {
          min: 0,
          required: true,
          errorMessage: "Please enter your monthly expenses",
        },
        creditScore: {
          min: 300,
          max: 850,
          required: false,
          errorMessage: "Credit score must be between 300 and 850",
        },
      },
      loanDetails: {
        requestedAmount: {
          min: 5000,
          max: 300000,
          required: true,
          errorMessage: "Loan amount must be between R5,000 and R300,000",
        },
        loanTerm: {
          min: 6,
          max: 60,
          required: true,
          errorMessage: "Loan term must be between 6 and 60 months",
        },
      },
    });
  }),

  // ELIGIBILITY CHECK
  http.post("/api/loans/eligibility", async ({ request }) => {
    const body = (await request.json()) as LoanEligibilityRequest;

    const disposableIncome =
      body.financialInfo.monthlyIncome -
      body.financialInfo.monthlyExpenses -
      body.financialInfo.existingDebt;

    const debtToIncomeRatio =
      (body.financialInfo.existingDebt / body.financialInfo.monthlyIncome) *
      100;

    const unemployed = body.personalInfo.employmentStatus === "unemployed";

    // expand eligibility logic to consider disposable income and debt ratio more granularly
    const suggestions: string[] = [];

    if (debtToIncomeRatio >= 40) {
      suggestions.push(
        `Your debt-to-income ratio is ${debtToIncomeRatio.toFixed(
          1,
        )}%. The recommended maximum is 40%. Consider reducing your existing debt.`,
      );
    }

    if (disposableIncome < 0) {
      suggestions.push(
        `Your expenses exceed your income by R${Math.abs(
          disposableIncome,
        ).toFixed(
          2,
        )}. Reducing expenses or increasing income is necessary before applying.`,
      );
    } else if (disposableIncome <= 2000) {
      suggestions.push(
        `Your disposable income is R${disposableIncome.toFixed(
          2,
        )}. A minimum of R2000 is recommended to comfortably afford repayments.`,
      );
    }

    if (unemployed) {
      suggestions.push(
        "Stable employment significantly increases approval likelihood.",
      );
    }

    const riskCategory =
      debtToIncomeRatio < 20
        ? "low"
        : debtToIncomeRatio < 40
          ? "medium"
          : "high";

    // Now suggestions are generated based on specific financial metrics, and the risk explanation provides more
    // context on why the applicant falls into a particular risk category.
    // This makes the feedback more actionable and personalized.
    let riskExplanation = "";

    if (riskCategory === "high") {
      riskExplanation = `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(
        1,
      )}% places you in a high-risk category, which may increase your interest rate.`;
    } else if (riskCategory === "medium") {
      riskExplanation = `Your debt-to-income ratio of ${debtToIncomeRatio.toFixed(
        1,
      )}% indicates moderate financial risk.`;
    }

    const hasHealthyDisposableIncome = disposableIncome > 1000;
    const hasHealthyDebtRatio = debtToIncomeRatio <= 40;

    const isEligible =
      hasHealthyDisposableIncome && hasHealthyDebtRatio && !unemployed;

    return HttpResponse.json({
      eligibilityResult: {
        isEligible,
        approvalLikelihood: isEligible ? 80 : 30,
        riskCategory,
        decisionReason: isEligible
          ? "Based on your financial profile, you qualify."
          : "Your current financial profile does not meet approval criteria.",
        riskExplanation,
        suggestions,
      },
      recommendedLoan: {
        maxAmount: isEligible ? 200000 : 0,
        recommendedAmount: isEligible ? body.loanDetails.requestedAmount : 0,
        interestRate: isEligible ? (riskCategory === "low" ? 10.5 : 16.5) : 0,
        monthlyPayment: isEligible ? 5000 : 0,
        totalRepayment: isEligible ? 120000 : 0,
      },
      affordabilityAnalysis: {
        disposableIncome,
        debtToIncomeRatio,
        loanToIncomeRatio:
          (body.loanDetails.requestedAmount /
            body.financialInfo.monthlyIncome) *
          100,
        affordabilityScore: disposableIncome > 5000 ? "good" : "poor",
      },
    });
  }),
];
