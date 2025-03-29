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
import { Product, ProductFilterParams } from "./type";
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

import { productSchema } from "./schemas";
import { z } from "zod";
import { AddProduct } from "./add-product";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getCategories } from "./api";
import { useQuery } from "@tanstack/react-query";




  interface ProductsTableProps {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages?: number;
    onPageChange: (page: number) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onDelete: (id: string) => void;
    selectedProduct: Product | null;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    onUpdate: (params: { id: string; data: z.infer<typeof productSchema> }) => void;
    onAdd: (product: {
      name: string;
      description?: string;
      price: number;
      sku: string;
      category_id: number;
    }) => void;
    onFilterChange: (filters: object) => void;
    onSortChange: (field: string, direction: 'asc' | 'desc') => void;
    filters: {
        category?: string;
        sku?: string;
        price?: number;
        created_date?: string;
        sort_by?: string;
        sort_direction?: 'asc' | 'desc';
    };
    
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });
  const categoriesForm = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
  console.log(categoriesForm);
  

  useEffect(() => {
    if (categoriesData?.data && Array.isArray(categoriesData.data)) {
      const apiCategories = categoriesData.data.map((category: {name: string}) => category.name);
      console.log(apiCategories);
      
      setCategories(apiCategories);
    }
  }, [categoriesData]);
  
  
  const [skuFilter, setSkuFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(0);
  const [createDateFilter, setCreateDateFilter] = useState("");

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
      onEdit: (product: Product) => {
        setSelectedProduct(product);
        setIsEditDialogOpen(true);
      },
           }
  });

  const applyFilters = () => {
    console.log("Applying filters with:", {
      category: filters.category,
      sku: skuFilter,
      price: priceFilter,
      created_date: createDateFilter
    });
    
    const newFilters: Partial<ProductFilterParams> = {};
    
    if (filters.category && filters.category !== 'all') {
      newFilters.category = filters.category;
    }
    
    if (skuFilter) {
      newFilters.sku = skuFilter;
    }
    
    if (priceFilter) {
      newFilters.price = Number(priceFilter);
    }
    
    if (createDateFilter) {
      newFilters.created_date = createDateFilter;
    }
    
    onFilterChange(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSkuFilter("");
    setPriceFilter(0);
    setCreateDateFilter("");
    
    onFilterChange({
      category: undefined,
      sku: undefined,
      price: undefined,
      created_date: undefined
    });
    
    setShowFilters(false);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  useEffect(() => {
    console.log("showFilters state changed:", showFilters);
  }, [showFilters]);
  
  useEffect(() => {
    console.log("Filters changed:", filters);
  }, [filters]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("products")}</CardTitle>

        {/* filter */}
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
          onClick={() => {
            console.log("Filter button clicked! Before update:", showFilters);
            // Instead of directly setting to true, toggle it
            setShowFilters(prev => !prev);
          }}
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
                <div className="flex items-center gap-1">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <CirclePlus
                        stroke="#DF0612"
                        size={30}
                        className="cursor-pointer ms-4"
                        aria-label={t("product.add_new")}
                      />
                    </DialogTrigger>
                    <DialogContent className="w-1/3 md:rounded-3xl">
                      <AddProduct onAdd={onAdd} categories={categoriesForm} />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <Table>
                {/* Table content remains the same */}
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
      </CardContent>
  
     
  
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-1/3 md:rounded-3xl">
          <AddProduct
          categories={categoriesData}
            isEditMode={true}
            initialData={selectedProduct}
            onSubmit={(data) =>
              selectedProduct && onUpdate({ id: selectedProduct.id, data })
            }
          />
        </DialogContent>
      </Dialog>
            {/* filter Dialog */}
            <Dialog 
          open={showFilters} 
          onOpenChange={(open) => {
            console.log("Dialog onOpenChange:", open);
            try {
              setShowFilters(open);
            } catch (error) {
              console.error("Error in Dialog:", error);
              setShowFilters(false);
            }
          }}
        >
          <DialogContent className="sm:max-w-[425px] z-[100]">
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
              onValueChange={value => onFilterChange({ 
                category: value === 'all' ? undefined : value 
              })}
              value={filters.category || "all"}
              disabled={categoriesLoading}
            >

              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={categoriesLoading ? 
                  t("common.loading") : 
                  t("product.select_category")} 
                />
              </SelectTrigger>
              <SelectContent 
              className="z-[150]" 
              position="popper" 
            >
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {categories
                .filter(category => category && category.trim() !== '')
                .map(category => (
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
                {t("product.price")}
              </label>
              <Input
                placeholder={t("product.enter_price")}
                className="col-span-3"
                value={priceFilter}
                type="number"
                onChange={(e) => setPriceFilter(Number(e.target.value))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right col-span-1">
              {t("product.create_date")}
            </label>
            <div className="col-span-3">
              <Input
                placeholder={t("product.enter_create_date")}
                type="date"
                className="w-full"
                value={createDateFilter}
                onChange={(e) => setCreateDateFilter(e.target.value)}
              />
            </div>
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
    </Card>
  );
}