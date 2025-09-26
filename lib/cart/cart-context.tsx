"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from "react";
import { apiCache } from "@/lib/api-cache";

export interface CartItem {
  id: string;
  name: string;
  originalPrice: number;
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
  isCartOpen: boolean; // Added isCartOpen
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_USER_ID"; payload: string }
  | { type: "SET_SESSION_ID"; payload: string }
  | { type: "CLEAR_IDENTITY" }
  | { type: "UPDATE_ACTIVITY" }
  | { type: "MARK_ABANDONED" }
  | { type: "RESTORE_CART"; payload: CartState }
  | { type: "SET_CART_OPEN"; payload: boolean }; // Added SET_CART_OPEN

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, "quantity"> & { productId?: string; variantId?: string; currency?: string }) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  trackActivity: () => void;
  setUserId: (userId: string) => void;
  clearIdentityAndCart: () => void;
  setIsCartOpen: (open: boolean) => void; // Added setIsCartOpen
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
      const total = updatedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date(), isAbandoned: false };
    }
    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date() };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id });
      }
      const updatedItems = state.items.map((item) => (item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item));
      const total = updatedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items: updatedItems, total, itemCount, lastActivity: new Date() };
    }
    case "CLEAR_CART":
      return { ...state, items: [], total: 0, itemCount: 0, lastActivity: new Date(), isAbandoned: false };
    case "SET_USER_ID":
      return { ...state, userId: action.payload, lastActivity: new Date() };
    case "SET_SESSION_ID":
      return { ...state, sessionId: action.payload, lastActivity: new Date() };
    case "CLEAR_IDENTITY":
      return { ...state, userId: undefined, sessionId: "", lastActivity: new Date() };
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
        isCartOpen: action.payload.isCartOpen ?? false, // Added isCartOpen
      };
    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.payload }; // Handle SET_CART_OPEN
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
  isCartOpen: false, // Added isCartOpen
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { ...initialState });

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
          payload: {
            ...parsedCart,
            lastActivity: parsedCart.lastActivity ? new Date(parsedCart.lastActivity) : new Date(),
            isCartOpen: parsedCart.isCartOpen ?? false, // Added isCartOpen
          },
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
    return state.userId ? { userId: state.userId } : state.sessionId ? { sessionId: state.sessionId } : {};
  };

  const reconcileFromServer = useCallback(async (localItemsOverride?: CartItem[]) => {
    try {
      const params = new URLSearchParams();
      if (state.userId) params.set("userId", state.userId);
      else if (state.sessionId) params.set("sessionId", state.sessionId);
      else return;
      const res = await apiCache.fetch(`/api/cart/get?${params.toString()}`, { method: "GET" });
      if (!res.ok) return;
      const serverCart = await res.json();
      cartIdRef.current = serverCart?.id ?? cartIdRef.current;
      const localSourceItems = Array.isArray(localItemsOverride) && localItemsOverride.length > 0
        ? localItemsOverride
        : state.items;
      const localItemById = new Map(localSourceItems.map((li) => [li.id, li]));
      const serverItemsRaw: any[] = Array.isArray(serverCart.items) ? serverCart.items : [];
      const itemsFromServer: CartItem[] = serverItemsRaw.map((it: any) => {
        const local = localItemById.get(it.variantId);
        return {
          id: it.variantId,
          name: (it.name ?? local?.name ?? ""),
          originalPrice: it.unitPrice,
          quantity: it.quantity,
          image: (it.image ?? local?.image ?? ""),
          slug: (it.slug ?? local?.slug ?? ""),
        };
      });
      const serverIds = new Set(itemsFromServer.map((i) => i.id));
      const unmatchedLocal: CartItem[] = localSourceItems
        .filter((li) => !serverIds.has(li.id))
        .map((li) => ({ ...li }));
      let items: CartItem[] = itemsFromServer.length > 0 ? [...itemsFromServer, ...unmatchedLocal] : [...localSourceItems];

      const missingMetaIds = items.filter((i) => !i.name || !i.image || !i.slug).map((i) => i.id);
      if (missingMetaIds.length > 0) {
        try {
          const metaRes = await fetch('/api/products/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: missingMetaIds }) });
          if (metaRes.ok) {
            const { products } = await metaRes.json();
            const metaById: Map<string, any> = new Map((products || []).map((p: any) => [p._id as string, p]));
            items = items.map((it) => {
              const meta: any = metaById.get(it.id);
              if (!meta) return it;
              return {
                ...it,
                name: it.name || meta.name || '',
                slug: it.slug || meta.slug || '',
                image: it.image || meta.image || '',
            };
            }
  )}
        } catch {}
      }
      const total = items.reduce((s, it) => s + it.originalPrice * it.quantity, 0);
      const itemCount = items.reduce((s, it) => s + it.quantity, 0);
      dispatch({ type: "RESTORE_CART", payload: { ...state, items, total, itemCount, lastActivity: new Date(), isCartOpen: state.isCartOpen } });
    } catch { }
  }, [state.userId, state.sessionId, state.isCartOpen]); // Added isCartOpen to dependencies

  // API calls
  const addCall = async (
    item: Omit<CartItem, "quantity">,
    identityOverride?: { userId?: string; sessionId?: string }
  ) => {
    const body = {
      ...(identityOverride ?? getIdentity()),
      productId: item.id,
      productName: item.name,
      variantId: item.id,
      quantity: 1,
      unitPrice: item.originalPrice,
      currency: "INR",
    };
    await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => {
      if (r.ok) {
        const json = await r.json();
        cartIdRef.current = json?.id ?? cartIdRef.current;
        if (!state.userId && !state.sessionId && json?.sessionId) {
          dispatch({ type: "SET_SESSION_ID", payload: json.sessionId });
        }
      }
    });
  };

  const updateCall = async (id: string, quantity: number) => {
    const item = state.items.find((it) => it.id === id);
    const body =
      cartIdRef.current
        ? { cartId: cartIdRef.current, variantId: id, quantity, unitPrice: item?.originalPrice, currency: "INR" }
        : { ...getIdentity(), variantId: id, quantity, unitPrice: item?.originalPrice, currency: "INR" };
    await fetch("/api/cart/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  const removeCall = async (id: string) => {
    const body =
      cartIdRef.current
        ? { cartId: cartIdRef.current, variantId: id }
        : { ...getIdentity(), variantId: id };
    await fetch("/api/cart/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  const clearCall = async (identity: { userId?: string; sessionId?: string }) => {
    await fetch("/api/cart/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(identity) });
  };

  // Public API (optimistic first)
  const addItem = (item: Omit<CartItem, "quantity">) => {
    let identityForThisAdd: { userId?: string; sessionId?: string } | undefined = undefined;
    if (!state.userId && !state.sessionId) {
      const newSessionId = generateSessionId();
      dispatch({ type: "SET_SESSION_ID", payload: newSessionId });
      identityForThisAdd = { sessionId: newSessionId };
    }
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    addCall(item, identityForThisAdd);
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
    clearCall(getIdentity());
  };

  const trackActivity = () => dispatch({ type: "UPDATE_ACTIVITY" });

  const setUserId = (userId: string) => {
    const localItemsSnapshot = state.items;
    const previousSessionId = state.sessionId;
    dispatch({ type: "SET_USER_ID", payload: userId });
    if (previousSessionId) {
      dispatch({ type: "SET_SESSION_ID", payload: "" });
    }
    const doMerge = async () => {
      try {
        if (previousSessionId) {
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, sessionId: previousSessionId }),
          });
          await clearCall({ sessionId: previousSessionId });
          dispatch({ type: "CLEAR_CART" });
        }
      } catch {}
      reconcileFromServer(localItemsSnapshot);
    };
    doMerge();
  };

  const clearIdentityAndCart = () => {
    dispatch({ type: "CLEAR_CART" });
    dispatch({ type: "CLEAR_IDENTITY" });
    cartIdRef.current = null;
    try {
      localStorage.removeItem("cart");
    } catch {}
  };

  // Added setIsCartOpen
  const setIsCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open });
  };

  // Add a ref to track if we've already loaded from server
  const hasLoadedFromServer = useRef(false);

  useEffect(() => {
    // Only load from server once per session
    if (!hasLoadedFromServer.current) {
      hasLoadedFromServer.current = true;
      reconcileFromServer();
    }
  }, []); // Run only on mount

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        trackActivity,
        setUserId,
        clearIdentityAndCart,
        setIsCartOpen, // Added to public API
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
