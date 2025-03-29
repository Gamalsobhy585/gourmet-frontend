import { z } from "zod";
import i18next from "i18next";

const getMessage = (key: string) => i18next.t(key);

export const productSchema = z.object({
  name: z.string().min(1, getMessage("product_validation.name_required")).max(255),
  description: z.string().optional(),
  price: z
    .number()
    .min(0, getMessage("product_validation.price_min")),
  category_id: z
    .number()
    .int()
    .min(1, getMessage("product_validation.category_required")), 
  sku: z.string().min(1, getMessage("product_validation.SKU_required")).max(100),
});
