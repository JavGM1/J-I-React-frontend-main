/**
 * Hook de carrito (useCart) en TypeScript
 * - Maneja estado y lógica de carrito con persistencia en localStorage
 * - Diseñado para productos del proyecto (Product de db.ts)
 */

import { useEffect, useMemo, useState } from "react";
import { db, type Product } from "../data/db";

export type CartItem = Product & { quantity: number };

const STORAGE_KEY = "cart";
export const MAX_ITEMS = 5;
export const MIN_ITEMS = 1;

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Validación básica y saneamiento
    return parsed
      .map((it: any) => {
        if (
          it &&
          typeof it.id === "number" &&
          typeof it.name === "string" &&
          typeof it.price === "number"
        ) {
          const qty = typeof it.quantity === "number" ? it.quantity : 1;
          return { ...it, quantity: Math.min(Math.max(qty, MIN_ITEMS), MAX_ITEMS) } as CartItem;
        }
        return null;
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
}

export function useCart() {
  // db local del proyecto
  const [data] = useState<Product[]>(db);

  // Estado del carrito con carga inicial desde localStorage
  const [cart, setCart] = useState<CartItem[]>(() => loadInitialCart());

  // Persistencia
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  function addToCart(item: Product) {
    setCart((prev) => {
      const idx = prev.findIndex((ci) => ci.id === item.id);
      if (idx >= 0) {
        const current = prev[idx];
        if (current.quantity >= MAX_ITEMS) return prev; // sin cambios
        const updated = [...prev];
        updated[idx] = { ...current, quantity: current.quantity + 1 };
        return updated;
      }
      const newItem: CartItem = { ...item, quantity: 1 };
      return [...prev, newItem];
    });
  }

  // Eliminar producto del carrito
  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((ci) => ci.id !== id));
  }

  // Incrementar cantidad
  function increaseQuantity(id: number) {
    setCart((prev) =>
      prev.map((ci) =>
        ci.id === id && ci.quantity < MAX_ITEMS
          ? { ...ci, quantity: ci.quantity + 1 }
          : ci
      )
    );
  }

  // Decrementar cantidad
  function decreaseQuantity(id: number) {
    setCart((prev) =>
      prev.map((ci) =>
        ci.id === id && ci.quantity > MIN_ITEMS
          ? { ...ci, quantity: ci.quantity - 1 }
          : ci
      )
    );
  }

  // Vaciar carrito
  function clearCart() {
    setCart([]);
  }

  // Derivados
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const itemCount = useMemo(() => cart.reduce((acc, it) => acc + it.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((total, it) => total + it.quantity * it.price, 0), [cart]);

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    itemCount,
    cartTotal,
  };
}
