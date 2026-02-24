import { useQuery } from "@tanstack/react-query";
import { getValidationRules } from "../api/loansApi";
import type { ValidationRulesResponse } from "../domain/types";
import { loanQueryKeys } from "../api/queryKeys";

export function useValidationRules() {
  return useQuery<ValidationRulesResponse>({
    queryKey: loanQueryKeys.validationRules(),
    queryFn: getValidationRules,
    staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
    retry: 1, // Retry failed requests once
  });
}
