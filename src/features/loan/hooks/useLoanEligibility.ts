import { useMutation } from "@tanstack/react-query";
import { checkLoanEligibility } from "../api/loansApi";
import type {
  LoanEligibilityRequest,
  LoanEligibilityResponse,
} from "../domain/types";

export function useLoanEligibility() {
  return useMutation<
    LoanEligibilityResponse, // return type
    Error, // error type
    LoanEligibilityRequest // variables type
  >({
    mutationFn: checkLoanEligibility,
  });
}
