import { ProductsTable } from "../features/products/products-table";
import {
  deleteProduct,
  createProduct,
  updateProduct,
  searchProductsWithFilters

} from "../features/products/api";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UpdateProductVariables } from "../features/products/type";
import { Product } from "../features/products/type";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<{
    category?: string;
    sku?: string;
    price?: number;
    created_date?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }>({});
  
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", currentPage, searchQuery, filters],
    queryFn: () => searchProductsWithFilters({
      page: currentPage,
      query: searchQuery,
      category: filters.category,
      sku: filters.sku,
      price: filters.price,
      created_date: filters.created_date,
      sortBy: filters.sort_by,
      sortDirection: filters.sort_direction,
    }),
  });
  


  


  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success(t("product.delete_success"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error(t("product.delete_error"));
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t("product.confirm_delete"))) {
      deleteMutation.mutate(id);
    }
  };

  const addMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promocodes", currentPage, searchQuery],
      });
    },
  });


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (newFilters: object) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_direction: direction
    }));
  };


  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateProductVariables) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
    onError: (error) => {
      toast.error(`Error Update promocode details ${error}`);
    },
  });



  return (
    <>

      <ProductsTable
        products={data?.data || []}
        isLoading={isLoading}
        error={isError ? error.message : null}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onDelete={handleDelete}
        onAdd={addMutation.mutate}
        onUpdate={(params) => updateMutation.mutate(params)}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        totalPages={data?.meta?.last_page || 1}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        filters={filters}
      />
    </>
  );
};

export default Products;
