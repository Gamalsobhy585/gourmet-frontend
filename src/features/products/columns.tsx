import { ColumnDef, Row } from "@tanstack/react-table";
import { Product } from "./type";
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { SquarePen, Eye, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export const getProductColumns = (isRTL: boolean): ColumnDef<Product>[] => {
  const { t } = useTranslation();
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="mx-2"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("common.select_all")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mx-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("common.select_row")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("product.id_label"),
      cell: ({ row }) => (
        <div className={`capitalize ${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("id")}
        </div>
      ),
    },
    {
      accessorKey: "SKU",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("product.sku_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("SKU")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("product.name_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`${isRTL ? "text-center" : "text-center"}`}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: t("product.description_label"),
      cell: ({ row }) => (
        <div className={`${isRTL ? "text-center" : "text-center"} truncate max-w-xs`}>
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "category.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("product.category_label")}
        </Button>
      ),
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <div className={`${isRTL ? "text-center" : "text-center"}`}>
            {category?.name || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("product.price_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`${isRTL ? "text-center" : "text-center"}`}>
          {typeof row.getValue("price") === 'number' 
            ? `$${(row.getValue("price") as number).toFixed(2)}` 
            : row.getValue("price")}
        </div>
      ),
    },
    {
      accessorKey: "price_in_store_B",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}
        >
          {t("product.price_store_b_label")}
        </Button>
      ),
      cell: ({ row }) => (
        <div className={`${isRTL ? "text-center" : "text-center"}`}>
          {typeof row.getValue("price_in_store_B") === 'number' 
            ? `$${(row.getValue("price_in_store_B") as number).toFixed(2)}` 
            : row.getValue("price_in_store_B")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className={`text-center ${isRTL ? "text-center" : "text-center"}`}>
          {t("common.actions_label")}
        </div>
      ),
      enableHiding: false,
      cell: ({ row, table }: { row: Row<Product>; table: any }) => {
        const onDelete = table.options.meta?.onDelete;
        const onEdit = table.options.meta?.onEdit;
        const onShow = table.options.meta?.onShow;
        
        return (
          <div className="flex items-center gap-2 justify-center text-primary">
            <SquarePen
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onEdit && onEdit(row.original)}
              aria-label={t("common.edit")}
            />
            <Eye
              size={24}
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onShow && onShow(row.original)}
              aria-label={t("common.view")}
            />
            <Trash2
              size={24}
              className="cursor-pointer hover:text-red-500"
              onClick={() => onDelete && onDelete(String(row.original.id))}
              aria-label={t("common.delete")}
            />
          </div>
        );
      },
    },
  ];
};