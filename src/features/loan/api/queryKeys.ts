export const loanQueryKeys = {
  all: ["loans"] as const,
  products: () => [...loanQueryKeys.all, "products"] as const,
  eligibility: () => [...loanQueryKeys.all, "eligibility"] as const,
  validationRules: () => [...loanQueryKeys.all, "validationRules"] as const,
};
