import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: any,
  options?: RequestInit
): Promise<Response> {
  // Production uchun to'g'ri backend URL manzilini ishlatamiz
  let baseUrl = import.meta.env.VITE_API_URL || '';
  
  // Agar environment'da URL yo'q bo'lsa yoki noto'g'ri bo'lsa, production URL manzilini ishlatamiz
  if (!baseUrl || 
      baseUrl === 'http://localhost:5000' || 
      baseUrl.includes('biznes-yordam.onrender.com') ||
      baseUrl.includes('biznesyordam.uz')) {
    baseUrl = 'https://biznesyordam-backend.onrender.com';
  }
  
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...options?.headers,
    },
    credentials: 'include', // Important for session cookies
    mode: 'cors',
    ...options,
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  console.log(`🌐 API Request: ${method} ${fullUrl}`, { 
    data, 
    headers: config.headers,
    credentials: config.credentials,
    baseUrl: baseUrl
  });

  try {
    const response = await fetch(fullUrl, config);
    
    console.log(`📡 API Response: ${response.status} ${response.statusText}`, {
      url: fullUrl,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      cookies: document.cookie
    });
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error('❌ API Error:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('🚨 Network Error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network connection failed');
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on auth errors
        if (error?.message?.includes('401') || error?.message?.includes('Avtorizatsiya')) {
          return false;
        }
        return failureCount < 2; // Retry up to 2 times for other errors
      },
      gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});
