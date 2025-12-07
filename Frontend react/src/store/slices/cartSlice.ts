import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";
import type { CartState, AddItemRequest, CartItem } from "../../types/cart";

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

// Fetch user cart
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      console.log("✅ Fetched cart:", response);
      return response;
    } catch (error: any) {
      console.error("❌ Fetch cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/add",
  async (request: AddItemRequest, { rejectWithValue }) => {
    try {
      console.log("➕ Adding to cart:", request);
      await cartService.addToCart(request);
      // Fetch fresh cart after adding
      const cart = await cartService.getCart();
      console.log("✅ Cart after add:", cart);
      return cart;
    } catch (error: any) {
      console.error("❌ Add to cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

// Remove cart item
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      console.log("➖ Removing from cart:", cartItemId);
      await cartService.removeCartItem(cartItemId);
      // Fetch fresh cart after removing
      const cart = await cartService.getCart();
      console.log("✅ Cart after remove:", cart);
      return cart;
    } catch (error: any) {
      console.error("❌ Remove from cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from cart"
      );
    }
  }
);

// Update cart item
export const updateCartItem = createAsyncThunk(
  "cart/update",
  async (
    {
      cartItemId,
      cartItem,
    }: { cartItemId: number; cartItem: Partial<CartItem> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating cart item:", cartItemId, cartItem);
      await cartService.updateCartItem(cartItemId, cartItem);
      // Fetch fresh cart after updating
      const cart = await cartService.getCart();
      console.log("✅ Cart after update:", cart);
      return cart;
    } catch (error: any) {
      console.error("❌ Update cart item error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🗑️ Clearing cart");
      await cartService.clearCart();
      console.log("✅ Cart cleared");
      return null;
    } catch (error: any) {
      console.error("❌ Clear cart error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.cart = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        console.log("📦 Cart state updated:", action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        console.log("📦 Cart state updated after add:", action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        console.log("📦 Cart state updated after remove:", action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cart = action.payload;
        console.log("📦 Cart state updated after update:", action.payload);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.cart = null;
        console.log("📦 Cart cleared");
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
