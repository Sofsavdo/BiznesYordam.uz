// This file is deprecated - use apiRequest from lib/queryClient.ts instead
// Keeping for backward compatibility only

import { apiRequest as apiRequestFromQueryClient } from './queryClient';

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  return apiRequestFromQueryClient(method, url, data);
}
