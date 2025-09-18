"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  sessionId: string;
  userId?: string;
  lastActivity: Date;
  isAbandoned: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_USER_ID"; payload: string }
  | { type: "UPDATE_ACTIVITY" }
  | { type: "MARK_ABANDONED" }
  | { type: "RESTORE_CART"; payload: CartState };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, "quantity"> & { productId?: string; variantId?: string; currency?: string }) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  trackActivity: () => void;
} | null>(null);

function generateSessionId(): string {
  return "cart_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      const updatedItems = existingItem
        ? state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...state.items, { ...action.payload, quantity: 1 }];
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date(), isAbandoned: false };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date() };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id });
      }
      const updatedItems = state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item));
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date() };
    }
    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0, lastActivity: new Date(), isAbandoned: false };
    case "SET_USER_ID":
      return { ...state, userId: action.payload, lastActivity: new Date() };
    case "UPDATE_ACTIVITY":
      return { ...state, lastActivity: new Date(), isAbandoned: false };
    case "MARK_ABANDONED":
      return { ...state, isAbandoned: true };
    case "RESTORE_CART":
      return {
        ...state,
        ...action.payload,
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
        lastActivity: action.payload.lastActivity ?? new Date(),
        total: action.payload.total ?? 0,
        itemCount: action.payload.itemCount ?? 0,
        isAbandoned: action.payload.isAbandoned ?? false,
      };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  sessionId: "",
  lastActivity: new Date(),
  isAbandoned: false,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { ...initialState, sessionId: generateSessionId() });

  // keep a local ref of current server cartId (filled after first server call)
  const cartIdRef = useRef<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart.items || !Array.isArray(parsedCart.items)) throw new Error("Invalid cart data");
        dispatch({
          type: "RESTORE_CART",
          payload: { ...parsedCart, lastActivity: parsedCart.lastActivity ? new Date(parsedCart.lastActivity) : new Date() },
        });
      } catch {
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Helpers
  const getIdentity = () => {
    return state.userId ? { userId: state.userId } : { sessionId: state.sessionId };
  };

  const reconcileFromServer = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (state.userId) params.set("userId", state.userId);
      else params.set("sessionId", state.sessionId);
      const res = await fetch(`/api/cart/get?${params.toString()}`, { method: "GET" });
      if (!res.ok) return;
      const serverCart = await res.json();
      cartIdRef.current = serverCart?.id ?? cartIdRef.current;
      const items: CartItem[] = (serverCart.items || []).map((it: any) => ({
        id: it.variantId,
        name: it.name ?? "",
        price: it.unitPrice,
        quantity: it.quantity,
        image: it.image ?? "",
        slug: it.slug ?? "",
      }));
      const total = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const itemCount = items.reduce((s, it) => s + it.quantity, 0);
      dispatch({ type: "RESTORE_CART", payload: { ...state, items, total, itemCount, lastActivity: new Date() } });
    } catch {}
  }, [state.userId, state.sessionId]);

  // API calls
  const addCall = async (item: Omit<CartItem, "quantity">) => {
    const body = {
      ...getIdentity(),
      productId: item.id,
      variantId: item.id,
      quantity: 1,
      unitPrice: item.price,
      currency: "INR",
    };
    await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => {
      if (r.ok) {
        const json = await r.json();
        cartIdRef.current = json?.id ?? cartIdRef.current;
      }
    });
  };

  const updateCall = async (id: string, quantity: number) => {
    const body =
      cartIdRef.current
        ? { cartId: cartIdRef.current, variantId: id, quantity }
        : { ...getIdentity(), variantId: id, quantity }; // optional: change server to accept userId/sessionId
    await fetch("/api/cart/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  const removeCall = async (id: string) => {
    const body =
      cartIdRef.current
        ? { cartId: cartIdRef.current, variantId: id }
        : { ...getIdentity(), variantId: id }; // optional: change server to accept userId/sessionId
    await fetch("/api/cart/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  // Public API (optimistic first)
  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    addCall(item); // fire-and-forget
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    removeCall(id);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
    updateCall(id, quantity);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    // optional: server clear endpoint call
  };

  const trackActivity = () => dispatch({ type: "UPDATE_ACTIVITY" });

  // Initial reconcile (optional)
  useEffect(() => {
    reconcileFromServer();
  }, [reconcileFromServer]);

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart, trackActivity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
