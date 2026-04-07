import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  // Загрузка
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (!error) setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Добавление
  const addProduct = async (product: any) => {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select();

    if (!error) fetchProducts();
  };

  // Обновление
  const updateProduct = async (id: string, updates: any) => {
    await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    fetchProducts();
  };

  // Удаление
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
