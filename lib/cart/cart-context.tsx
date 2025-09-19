"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback } from "react";

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
  | { type: "RESTORE_CART"; payload: CartState };

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
      };
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  sessionId: "", // do not pre-generate; create lazily on first cart action for guests
  lastActivity: new Date(),
  isAbandoned: false,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { ...initialState });

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
    return state.userId ? { userId: state.userId } : state.sessionId ? { sessionId: state.sessionId } : {};
  };

  const reconcileFromServer = useCallback(async (localItemsOverride?: CartItem[]) => {
    try {
      const params = new URLSearchParams();
      if (state.userId) params.set("userId", state.userId);
      else if (state.sessionId) params.set("sessionId", state.sessionId);
      else return; // nothing to reconcile yet
      const res = await fetch(`/api/cart/get?${params.toString()}`, { method: "GET" });
      if (!res.ok) return;
      const serverCart = await res.json();
      cartIdRef.current = serverCart?.id ?? cartIdRef.current;
      // Merge: prefer server values, but fall back to local for name/image/slug if missing
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
      // Include any local items not present in server response (union by id)
      const serverIds = new Set(itemsFromServer.map((i) => i.id));
      const unmatchedLocal: CartItem[] = localSourceItems
        .filter((li) => !serverIds.has(li.id))
        .map((li) => ({ ...li }));
      let items: CartItem[] = itemsFromServer.length > 0 ? [...itemsFromServer, ...unmatchedLocal] : [...localSourceItems];

      // If any items still missing name/image/slug, fetch metadata from Sanity
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
            });
          }
        } catch {}
      }
      const total = items.reduce((s, it) => s + it.originalPrice * it.quantity, 0);
      const itemCount = items.reduce((s, it) => s + it.quantity, 0);
      dispatch({ type: "RESTORE_CART", payload: { ...state, items, total, itemCount, lastActivity: new Date() } });
    } catch { }
  }, [state.userId, state.sessionId]);

  // API calls
  const addCall = async (
    item: Omit<CartItem, "quantity">,
    identityOverride?: { userId?: string; sessionId?: string }
  ) => {
    const body = {
      ...(identityOverride ?? getIdentity()),
      productId: item.id,
      variantId: item.id,
      quantity: 1,
      unitPrice: item.originalPrice,
      currency: "INR",
    };
    await fetch("/api/cart/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (r) => {
      if (r.ok) {
        const json = await r.json();
        cartIdRef.current = json?.id ?? cartIdRef.current;
        // If server created a session for guest, persist it locally
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
        : { ...getIdentity(), variantId: id, quantity, unitPrice: item?.originalPrice, currency: "INR" }; // server should accept userId/sessionId when no cartId
    await fetch("/api/cart/update", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  const removeCall = async (id: string) => {
    const body =
      cartIdRef.current
        ? { cartId: cartIdRef.current, variantId: id }
        : { ...getIdentity(), variantId: id }; // server should accept userId/sessionId when no cartId
    await fetch("/api/cart/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  };

  // New: Clear cart API call (add this endpoint on server if not present)
  const clearCall = async (identity: { userId?: string; sessionId?: string }) => {
    await fetch("/api/cart/clear", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(identity) });
  };

  // Public API (optimistic first)
  const addItem = (item: Omit<CartItem, "quantity">) => {
    // Lazily generate a guest sessionId if user is not logged in and no session yet
    let identityForThisAdd: { userId?: string; sessionId?: string } | undefined = undefined;
    if (!state.userId && !state.sessionId) {
      const newSessionId = generateSessionId();
      dispatch({ type: "SET_SESSION_ID", payload: newSessionId });
      identityForThisAdd = { sessionId: newSessionId };
    }
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
    addCall(item, identityForThisAdd); // fire-and-forget
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
    // Call server clear if needed
    clearCall(getIdentity());
  };

  const trackActivity = () => dispatch({ type: "UPDATE_ACTIVITY" });

  const setUserId = (userId: string) => {
    // Take a snapshot of local items before any local clear so we can enrich server data
    const localItemsSnapshot = state.items;
    const previousSessionId = state.sessionId; // guest session
  
    dispatch({ type: "SET_USER_ID", payload: userId });
    if (previousSessionId) {
      dispatch({ type: "SET_SESSION_ID", payload: "" }); // guest session clear
    }
  
    const doMerge = async () => {
      try {
        if (previousSessionId) {
          // Merge first
          await fetch("/api/cart/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, sessionId: previousSessionId }),
          });
          
          // After merge, clear the old session cart (set items to 0)
          await clearCall({ sessionId: previousSessionId });
          
          // Local clear for safety (items will be restored by reconcile)
          dispatch({ type: "CLEAR_CART" });
        }
      } catch {}
      // Reconcile using snapshot so name/image/slug are preserved if server doesn't send them
      reconcileFromServer(localItemsSnapshot); // ✅ UI update from server with merged cart
    };
    doMerge();
  };

  const clearIdentityAndCart = () => {
    dispatch({ type: "CLEAR_CART" });
    dispatch({ type: "CLEAR_IDENTITY" });
    cartIdRef.current = null;
    try {
      localStorage.removeItem("cart");
    } catch { }
  };

  // Initial reconcile (optional)
  useEffect(() => {
    reconcileFromServer();
  }, [reconcileFromServer]);

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart, trackActivity, setUserId, clearIdentityAndCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
