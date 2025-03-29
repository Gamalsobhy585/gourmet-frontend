import { z } from "zod";
import { Category } from "../categories/type";
import { productSchema } from "./schemas";

export interface Product {
    id: string;
    name: string;
    price: number;
    sku: string;
    description: string;
    category_id: Category['id'];
    category?: Category; 
    price_in_store_B: number;
    created_date: string;
  }

  export interface ProductFilterParams {
    page?: number;
    per_page?: number;
    query?: string;
    sort_by?: 'category' | 'sku' | 'price' | 'created_date';
    sort_direction?: 'asc' | 'desc';
    category?: string;
    sku?: string;
    price?: number;
    price_range?: string;
    created_date?: string;
    created_date_range?: string;
  }


  export type UpdateProductVariables = {
    id: string;
    data: z.infer<typeof productSchema>;
  };