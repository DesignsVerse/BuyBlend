"use client";

import type React from "react";
import { createContext, useContext, useReducer, useEffect } from "react";

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
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          items: updatedItems,
          total,
          itemCount,
          lastActivity: new Date(),
          isAbandoned: false,
        };
      } else {
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          ...state,
          items: updatedItems,
          total,
          itemCount,
          lastActivity: new Date(),
          isAbandoned: false,
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter((item) => item.id !== action.payload);
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount,
        lastActivity: new Date(),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: action.payload.id });
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        ...state,
        items: updatedItems,
        total,
        itemCount,
        lastActivity: new Date(),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
        lastActivity: new Date(),
        isAbandoned: false,
      };

    case "SET_USER_ID":
      return {
        ...state,
        userId: action.payload,
        lastActivity: new Date(),
      };

    case "UPDATE_ACTIVITY":
      return {
        ...state,
        lastActivity: new Date(),
        isAbandoned: false,
      };

    case "MARK_ABANDONED":
      return {
        ...state,
        isAbandoned: true,
      };

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
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    sessionId: generateSessionId(),
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);

        if (!parsedCart.items || !Array.isArray(parsedCart.items)) {
          throw new Error("Invalid cart data");
        }

        dispatch({
          type: "RESTORE_CART",
          payload: {
            ...parsedCart,
            lastActivity: parsedCart.lastActivity
              ? new Date(parsedCart.lastActivity)
              : new Date(),
          },
        });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart"); // clear corrupted data
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  // Track cart abandonment
  useEffect(() => {
    if (!state.items || state.items.length === 0) return;

    const abandonmentTimer = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - state.lastActivity.getTime();
      if (timeSinceLastActivity >= 30 * 60 * 1000) {
        dispatch({ type: "MARK_ABANDONED" });
        trackCartAbandonment(state);
      }
    }, 30 * 60 * 1000);

    return () => clearTimeout(abandonmentTimer);
  }, [state]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: 1 } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const trackActivity = () => {
    dispatch({ type: "UPDATE_ACTIVITY" });
  };

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Analytics tracking function
async function trackCartAbandonment(cartState: CartState) {
  try {
    await fetch("/api/analytics/cart-abandonment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: cartState.sessionId,
        userId: cartState.userId,
        items: cartState.items,
        total: cartState.total,
        abandonedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    });
  } catch (error) {
    console.error("Error tracking cart abandonment:", error);
  }
}
