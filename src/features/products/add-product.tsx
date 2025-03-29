import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { productSchema } from "./schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "react-toastify";
import { Product } from "./type";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

interface AddProductProps {
  onAdd?: (product: z.infer<typeof productSchema>) => void;
  onSubmit?: (product: z.infer<typeof productSchema>) => void;
  onShow?: (params: { id: string }) => void;

  isViewMode?: boolean;
  isEditMode?: boolean;
  initialData?: Product | null;
  categories?: { id: number; name: string }[]; 

}

export function AddProduct({
  onAdd,
  categories = [],
  onSubmit,
  isViewMode = false,
  isEditMode = false,
  initialData,
}: AddProductProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category_id: 0,
      sku: "",
    },
  });

  console.log(categories);
  
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category_id: initialData.category_id,
        sku: initialData.sku,
      });
    }
  }, [initialData, form]);

  async function onSubmitHandler(values: z.infer<typeof productSchema>) {
    try {
      if (isEditMode && onSubmit) {
        await onSubmit(values);
      } else if (onAdd) {
        await onAdd(values);
      }
      toast.success(
        t(`product.${isEditMode ? "update_success" : "add_success"}`)
      );
      if (!isEditMode) form.reset();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4 mt-4"
        onSubmit={form.handleSubmit(onSubmitHandler)}
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className={`${isRTL ? "text-right" : "text-left"}`}>
              <FormLabel>{t("product.name_label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("product.name_placeholder")}
                  disabled={isViewMode}
                  dir={isRTL ? "rtl" : "ltr"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className={`${isRTL ? "text-right" : "text-left"}`}>
              <FormLabel>{t("product.description_label")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("product.description_placeholder")}
                  disabled={isViewMode}
                  dir={isRTL ? "rtl" : "ltr"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem className={`${isRTL ? "text-right" : "text-left"}`}>
              <FormLabel>{t("product.price_label")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("product.price_placeholder")}
                  disabled={isViewMode}
                  dir={isRTL ? "rtl" : "ltr"}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       

        {/* Category ID Field */}
        <FormField
          name="category_id"
          control={form.control}
          render={({ field }) => (
            <FormItem className={`${isRTL ? "text-right" : "text-left"}`}>
              <FormLabel>{t("product.category_label")}</FormLabel>
              <FormControl>
                <select
                  className="border p-2 rounded w-full"
                  disabled={isViewMode}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                >
                  <option value="">{t("product.category_placeholder")}</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
            name="sku"
            control={form.control}
            render={({ field }) => (
              <FormItem className={`${isRTL ? "text-right" : "text-left"}`}>
                <FormLabel>{t("product.sku_label")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("product.sku_placeholder")}
                    disabled={isViewMode}
                    dir={isRTL ? "rtl" : "ltr"}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


        {/* Submit Button */}
        {!isViewMode && (
          <Button type="submit" className="mt-4">
            {t(`product.${isEditMode ? "update_button" : "add_button"}`)}
          </Button>
        )}
      </form>
    </Form>
  );
}