import { ProductsTable } from "../features/products/products-table";
import {
  deleteProduct,
  createProduct,
  getProduct,
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
    price?: string;
    price_range?: string;
    created_date?: string;
    created_date_range?: string;
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
      priceRange: filters.price_range
        ? { min: Number(filters.price_range.split("-")[0]), max: Number(filters.price_range.split("-")[1]) }
        : undefined,
      dateRange: filters.created_date_range
        ? { start: filters.created_date_range.split(" to ")[0], end: filters.created_date_range.split(" to ")[1] }
        : undefined,
      sortBy: filters.sort_by,
      sortDirection: filters.sort_direction,
    }),
  });
  

  const showMutation = useMutation({
    mutationFn: getProduct,
    onSuccess: (data) => {
      setSelectedProduct({
        id: data.id,
        name: data.name,
        sku: data.sku, 
        price: data.price,
        description:data.description,
        price_in_store_B: data.price_in_store_B,
        category_id: data.category_id,
        category: data.category,
        created_date: data.created_date,
      });
    },
    onError: (error) => {
      toast.error(`Error fetching product details ${error}`);
    },
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

  const handleShow = (id: string) => {
    showMutation.mutate(id);
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
        onShow={(params) => handleShow(params.id)}
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
