import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  stock: number;
  barcode?: string;
  category?: string;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 📦 загрузка
  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ realtime
  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          // вместо полного перезапроса можно умнее:
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ➕ добавить
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const { error } = await supabase
        .from("products")
        .insert([product]);

      if (error) throw error;
    } catch (err) {
      console.error("Ошибка добавления:", err);
    }
  };

  // ✏️ обновить
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Ошибка обновления:", err);
    }
  };

  // ❌ удалить
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      console.error("Ошибка удаления:", err);
    }
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
};
