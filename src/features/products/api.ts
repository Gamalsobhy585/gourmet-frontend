import { z } from "zod";
import { productSchema } from "./schemas";
import { ProductFilterParams } from "./type";


const PAGE_SIZE = 5;

const buildUrl = (endpoint: string, params: Record<string, any>) => {
  const url = new URL(`${import.meta.env.VITE_BASE_URL}${endpoint}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
};
console.log("Final API URL:", buildUrl('/products', { page: 1, per_page: 5 }));

const apiFetch = async (url: string, options: RequestInit = {}) => {
  console.log("Fetching URL:", url);

    const headers = {
      ...options.headers,
      'Accept-Language': 'en',
    };

     try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    console.log("Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response Data:", data);
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
};




export const getProducts = async (params: ProductFilterParams = { page: 1 }) => {
  const url = buildUrl('/products', {
    ...params,
    per_page: params.per_page || PAGE_SIZE
  });
  
  return apiFetch(url);
};

export const getCategories = async () => {
  const url = buildUrl('/categories', {
    per_page: 1000
  });
  
  return apiFetch(url);
};





export const searchProductsWithFilters = async (options: {
  query?: string;
  category?: string;
  price?:  number;
  sku?: string;
  created_date?: string;
  page?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}) => {
  const params: ProductFilterParams = {
    page: options.page || 1,
    query: options.query,
    category: options.category,
    sku: options.sku,
    price: options.price, 
    created_date: options.created_date,
    sort_by: options.sortBy as any,
    sort_direction: options.sortDirection
  };

  return getProducts(params);
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

