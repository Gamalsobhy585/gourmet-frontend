import { z } from "zod";
import { productSchema } from "./schemas";
import { ProductFilterParams } from "./type";




const buildUrl = (endpoint: string, params: Record<string, any>) => {
  const url = new URL(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...(options.headers || {}),
    
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};



export const getProducts = async (params: ProductFilterParams = { page: 1 }) => {
  const url = buildUrl('/products', {
    ...params,
    per_page: params.per_page || 20
  });
  
  return apiFetch(url);
};

export const getProduct = async (id: string) => {
  const url = `${import.meta.env.VITE_BASE_URL}/products/${id}`;
  const response = await apiFetch(url);
  return response.data;
};

export const createProduct = async (product: z.infer<typeof productSchema>) => {
  return apiFetch(`${import.meta.env.VITE_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
};

export const updateProduct = async (
  id: string,
  product: z.infer<typeof productSchema>
) => {
  return apiFetch(`${import.meta.env.VITE_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });
};

export const deleteProduct = async (id: string) => {
  return apiFetch(`${import.meta.env.VITE_BASE_URL}/products/${id}`, {
    method: "DELETE"
  });
};

export const searchProductsWithFilters = async (options: {
  query?: string;
  category?: string;
  priceRange?: {min: number, max: number};
  dateRange?: {start: string, end: string};
  page?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}) => {
  const params: ProductFilterParams = {
    page: options.page || 1,
    query: options.query,
    category: options.category,
    sort_by: options.sortBy as any,
    sort_direction: options.sortDirection
  };

  if (options.priceRange) {
    params.price_range = `${options.priceRange.min}-${options.priceRange.max}`;
  }

  if (options.dateRange) {
    params.created_date_range = `${options.dateRange.start} to ${options.dateRange.end}`;
  }

  return getProducts(params);
};