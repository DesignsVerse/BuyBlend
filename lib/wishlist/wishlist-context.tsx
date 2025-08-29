"use client";

import type React from "react";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  slug: string;
  image?: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemCount: number;
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "TOGGLE_ITEM"; payload: WishlistItem }
  | { type: "CLEAR" }
  | { type: "RESTORE"; payload: WishlistState };

const WishlistContext = createContext<{
  state: WishlistState;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  clear: () => void;
  isInWishlist: (id: string) => boolean;
} | null>(null);

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM": {
      if (state.items.some((it) => it.id === action.payload.id)) return state;
      const items = [...state.items, action.payload];
      return { items, itemCount: items.length };
    }
    case "REMOVE_ITEM": {
      const items = state.items.filter((it) => it.id !== action.payload);
      return { items, itemCount: items.length };
    }
    case "TOGGLE_ITEM": {
      const exists = state.items.some((it) => it.id === action.payload.id);
      const items = exists
        ? state.items.filter((it) => it.id !== action.payload.id)
        : [...state.items, action.payload];
      return { items, itemCount: items.length };
    }
    case "CLEAR":
      return { items: [], itemCount: 0 };
    case "RESTORE":
      return {
        items: Array.isArray(action.payload.items) ? action.payload.items : [],
        itemCount: action.payload.itemCount ?? action.payload.items?.length ?? 0,
      };
    default:
      return state;
  }
}

const initialState: WishlistState = { items: [], itemCount: 0 };

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist");
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: "RESTORE", payload: parsed });
      }
    } catch (err) {
      console.warn("Failed to restore wishlist", err);
      localStorage.removeItem("wishlist");
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to persist wishlist", err);
    }
  }, [state]);

  const addItem = (item: WishlistItem) => dispatch({ type: "ADD_ITEM", payload: item });
  const removeItem = (id: string) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const toggleItem = (item: WishlistItem) => dispatch({ type: "TOGGLE_ITEM", payload: item });
  const clear = () => dispatch({ type: "CLEAR" });

  const isInWishlist = useMemo(() => {
    const set = new Set(state.items.map((i) => i.id));
    return (id: string) => set.has(id);
  }, [state.items]);

  return (
    <WishlistContext.Provider value={{ state, addItem, removeItem, toggleItem, clear, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}


