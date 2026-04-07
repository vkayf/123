import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error("Ошибка загрузки:", error);
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: any) => {
    const { error } = await supabase
      .from("products")
      .insert([product]);

    if (!error) fetchProducts();
  };

  const updateProduct = async (id: string, updates: any) => {
    await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

    fetchProducts();
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
