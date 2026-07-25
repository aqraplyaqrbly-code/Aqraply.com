import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "react-hot-toast";
import { Id } from "../../convex/_generated/dataModel";

export function useProducts() {
  const products = useQuery(api.products.getAllProductsWithImages);
  const stores = useQuery(api.stores.getAllStores);
  
  // Add mutations as needed
  // const createProduct = useMutation(api.products.create);
  // const updateProduct = useMutation(api.products.update);
  // const deleteProduct = useMutation(api.products.delete);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStore, setFilterStore] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredProducts = (products || [])
    .filter((p) => filterStore === null || p.storeId === filterStore)
    .filter((p) => filterCategory === null || p.category === filterCategory)
    .filter((p) => 
      !searchTerm || 
      p.nameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return {
    products,
    filteredProducts,
    stores,
    searchTerm,
    filterStore,
    filterCategory,
    setSearchTerm,
    setFilterStore,
    setFilterCategory,
  };
}
