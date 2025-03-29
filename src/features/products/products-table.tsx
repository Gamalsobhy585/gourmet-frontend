"use client";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { getProductColumns } from "./columns";
import { Product } from "./type";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useTranslation } from "react-i18next";
import { Loader2, Filter, CirclePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { format } from "date-fns";
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";
import { productSchema } from "./schemas";
import { z } from "zod";
import { AddProduct } from "./add-product";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { DateRange } from "react-day-picker";



interface ProductsTableProps {
    
 }

  interface ProductsTableProps {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFilterChange: (filters: object) => void;
    onSortChange: (field: string, direction: 'asc' | 'desc') => void;
    onDelete: (id: string) => void;
    selectedProduct: Product | null;
    onShow: (params:{id: string}) => void;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    onUpdate: (params: { id: string; data: z.infer<typeof productSchema> }) => void;
    onAdd: (product: {
      name: string;
      description?: string;
      price: number;
      sku: string;
      category_id: number;
    }) => void;
    
    filters: any;
  }

  

export function ProductsTable({
  products,
  isLoading,
  error,
  currentPage,
  totalPages = 1,
  onPageChange,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onAdd,
  onShow,
  onDelete,
  selectedProduct,
  setSelectedProduct,
  onUpdate,
  filters,
}: ProductsTableProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);


  
  
  const [priceRange, setPriceRange] = useState<{
    min: string;
    max: string;
  }>({ min: "", max: "" });
  const [skuFilter, setSkuFilter] = useState("");

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products.map(product => product.category?.name).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    }
  }, [products]);

  useEffect(() => {
    if (sorting.length > 0) {
      const field = sorting[0].id;
      const direction = sorting[0].desc ? 'desc' : 'asc';
      onSortChange(field, direction);
    }
  }, [sorting, onSortChange]);

  const columns = getProductColumns(isRTL);

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      onDelete: (id: string) => onDelete(id),
      onEdit: (product: Product) => setSelectedProduct(product),
      onShow: (product: Product) => setSelectedProduct(product),
    },
  });

  const applyFilters = () => {
    const newFilters: any = {};
    
    // Category filter
    if (filters.category) {
      newFilters.category = filters.category;
    }
    
    // sku filter
    if (skuFilter) {
      newFilters.sku = skuFilter;
    }
    
    // Price range filter
    if (priceRange.min && priceRange.max) {
      newFilters.price_range = `${priceRange.min}-${priceRange.max}`;
    }
    
    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      newFilters.created_date_range = `${format(dateRange.from, "yyyy-MM-dd")} to ${format(dateRange.to, "yyyy-MM-dd")}`;
    }
  
  
    
    onFilterChange(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSkuFilter("");
    setPriceRange({ min: "", max: "" });
    setDateRange(undefined); 
    onFilterChange({
      category: undefined,
      sku: undefined,
      price_range: undefined,
      created_date_range: undefined
    });
    setShowFilters(false);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }


  return (
    <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{t("products")}</CardTitle>
      <div className="flex gap-2">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder={t("product.search_placeholder")}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowFilters(true)}
        >
          <Filter size={16} />
          {t("common.filter")}
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className="rounded-md border">
          <div className="flex justify-between items-center py-4">
      <Input
          placeholder={t("product.search_placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`max-w-sm ${isRTL ? "text-right" : "text-left"}`}
        />
        <div className="flex items-center gap-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <CirclePlus
                stroke="#DF0612"
                size={30}
                className="cursor-pointer"
                aria-label={t("product.add_new")}
              />
            </DialogTrigger>
            <DialogContent className="w-1/3 md:rounded-3xl">
              <AddProduct onAdd={onAdd} />
            </DialogContent>
          </Dialog>
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>

        <DialogContent className="w-1/3 md:rounded-3xl">
          <AddProduct 
            isViewMode={true} 
            initialData={selectedProduct} 
            onShow={onShow}
          />
        </DialogContent>
          </Dialog>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>

        <DialogContent className="w-1/3 md:rounded-3xl">
          <AddProduct
          isEditMode={true}
          initialData={selectedProduct}
          onSubmit={(data) =>
            selectedProduct && onUpdate({ id: selectedProduct.id, data })
           }
           />
        </DialogContent>
          </Dialog>
        </div>
      </div>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("common.no_results")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              {t("common.showing_results", {
                from: (currentPage - 1) * 20 + 1,
                to: Math.min(currentPage * 20, products.length),
                total: products.length,
              })}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t("common.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Filter Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("common.filter")}</DialogTitle>
            <DialogDescription>
              {t("product.filter_description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right col-span-1">
                {t("product.category")}
              </label>
              <Select 
                onValueChange={value => onFilterChange({ category: value })}
                value={filters.category || ""}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("product.select_category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("common.all")}</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right col-span-1">
                {t("product.sku")}
              </label>
              <Input
                placeholder={t("product.enter_sku")}
                className="col-span-3"
                value={skuFilter}
                onChange={(e) => setSkuFilter(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right col-span-1">
                {t("product.price_range")}
              </label>
              <div className="col-span-3 flex gap-2">
                <Input
                  type="number"
                  placeholder={t("common.min")}
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder={t("common.max")}
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right col-span-1">
                {t("product.date_range")}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                  "col-span-3 justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                {dateRange?.from ? (
                  dateRange.to ? (
                    `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                  ) : (
                    format(dateRange.from, "PPP")
                  )
                ) : (
                  t("product.select_date_range")
                )}
              </Button>

                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange} // No type error now!
                initialFocus
              />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              {t("common.clear")}
            </Button>
            <Button onClick={applyFilters}>
              {t("common.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardContent>
  </Card>
);
}