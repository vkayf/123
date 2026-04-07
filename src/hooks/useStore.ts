import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Operation, DashboardStats } from '@/lib/types';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage('svetlana_products', [])
  );

  useEffect(() => {
    saveToStorage('svetlana_products', products);
  }, [products]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  return { products, addProduct, updateProduct, deleteProduct, setProducts };
}

export function useOperations() {
  const [operations, setOperations] = useState<Operation[]>(() =>
    loadFromStorage('svetlana_operations', [])
  );

  useEffect(() => {
    saveToStorage('svetlana_operations', operations);
  }, [operations]);

  const addOperation = useCallback((op: Omit<Operation, 'id' | 'date'>) => {
    const newOp: Operation = {
      ...op,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setOperations(prev => [newOp, ...prev]);
    return newOp;
  }, []);

  return { operations, addOperation };
}

export function useDashboardStats(products: Product[], operations: Operation[]): DashboardStats {
  return useMemo(() => {
    const salesOps = operations.filter(o => o.type === 'out');
    const totalRevenue = salesOps.reduce((sum, o) => sum + o.total, 0);
    const totalCost = salesOps.reduce((sum, o) => {
      const product = products.find(p => p.id === o.productId);
      return sum + (product ? product.cost * o.quantity : 0);
    }, 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    return {
      totalRevenue,
      totalProfit: totalRevenue - totalCost,
      totalProducts: products.length,
      lowStockCount,
    };
  }, [products, operations]);
}
