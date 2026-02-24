import { useQuery } from "@tanstack/react-query";
import type { LoanProductsResponse } from "../domain/types";
import { getLoanProducts } from "../api/loansApi";
import { loanQueryKeys } from "../api/queryKeys";

export function useLoanProducts() {
  // This is a placeholder for the actual implementation of the hook.
  // In a real application, you would use something like react-query to fetch data from an API.
  return useQuery<LoanProductsResponse>({
    queryKey: loanQueryKeys.products(),
    queryFn: getLoanProducts, // Function to fetch loan products from the API
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });
}
