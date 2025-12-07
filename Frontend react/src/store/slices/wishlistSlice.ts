import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistService } from "../../services/wishlistService";
import type { WishlistState } from "../../types/wishlist";

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist();
      console.log("✅ Fetched wishlist:", response);
      return response;
    } catch (error: any) {
      console.error("❌ Fetch wishlist error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (productId: number, { rejectWithValue }) => {
    try {
      console.log("➕ Adding product to wishlist:", productId);
      // Perform add then fetch fresh wishlist to avoid ambiguous response shapes
      await wishlistService.addToWishlist(productId);
      const response = await wishlistService.getWishlist();
      console.log("✅ Wishlist after add:", response);
      return response;
    } catch (error: any) {
      console.error("❌ Add to wishlist error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId: number, { rejectWithValue }) => {
    try {
      console.log("➖ Removing product from wishlist:", productId);
      // Perform remove then fetch fresh wishlist
      await wishlistService.removeFromWishlist(productId);
      const response = await wishlistService.getWishlist();
      console.log("✅ Wishlist after remove:", response);
      return response;
    } catch (error: any) {
      console.error("❌ Remove from wishlist error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        // normalize server response: some APIs return { products: [...] } and
        // others return the array directly. Accept both to be resilient.
        const products = action.payload?.products ?? action.payload ?? [];
        console.log("📦 Setting wishlist items:", products);
        state.items = products;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add to wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const products = action.payload?.products ?? action.payload ?? [];
        console.log("📦 Setting wishlist items after add:", products);
        state.items = products;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Remove from wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        const products = action.payload?.products ?? action.payload ?? [];
        console.log("📦 Setting wishlist items after remove:", products);
        state.items = products;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
