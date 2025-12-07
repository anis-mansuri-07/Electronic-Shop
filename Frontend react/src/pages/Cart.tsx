import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import {
  MdDelete,
  MdDeleteForever,
  MdAdd,
  MdRemove,
  MdShoppingCart,
  MdArrowBack,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../store/slices/cartSlice";
import { buildFirstImage } from "../utils/image";
import Navbar from "../components/Navbar";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, isLoading, error } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [isAuthenticated, dispatch, navigate]);

  // Debug: Log cart data when it changes
  useEffect(() => {
    if (cart) {
      console.log("🛒 CART DATA:", {
        totalItem: cart.totalItem,
        totalMrpPrice: cart.totalMrpPrice,
        totalSellingPrice: cart.totalSellingPrice,
        discount: cart.discount,
        itemCount: cart.cartItems?.length,
      });
    }
  }, [cart]);

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(
        updateCartItem({ cartItemId, cartItem: { quantity: newQuantity } })
      ).unwrap();
      // Force refresh to ensure latest backend data
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      // Force refresh to ensure latest backend data
      await dispatch(fetchCart()).unwrap();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCartClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClear = async () => {
    try {
      setClearing(true);
      await dispatch(clearCart()).unwrap();
      setConfirmOpen(false);
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setClearing(false);
    }
  };

  const handleCancelClear = () => {
    setConfirmOpen(false);
  };

  if (isLoading && !cart) {
    return (
      <>
        <Navbar />
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <IconButton onClick={() => navigate(-1)}>
            <MdArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Shopping Cart
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!cart || cart.cartItems.length === 0 ? (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <MdShoppingCart size={80} style={{ opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mt: 2, mb: 3 }}>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{ textTransform: "none" }}
            >
              Continue Shopping
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Items ({cart.totalItem})</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleClearCartClick}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    borderWidth: 2,
                    "&:hover": { borderWidth: 2 },
                  }}
                >
                  Clear Cart
                </Button>
              </Box>

              {Array.from(cart.cartItems).map((item) => (
                <Card key={item.id} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" gap={2}>
                    <CardMedia
                      component="img"
                      image={buildFirstImage(item.product.images)}
                      alt={item.product.title}
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/product/${item.product.id}`)}
                    />
                    <Box flex={1}>
                      <Typography
                        variant="h6"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "primary.main" },
                        }}
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        {item.product.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {item.product.category.name}
                      </Typography>

                      {/* Price */}
                      <Box display="flex" alignItems="center" gap={1} mb={2}>
                        <Typography variant="h6" color="primary">
                          ₹{item.sellingPrice * item.quantity}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ₹{item.mrpPrice * item.quantity}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          {Math.round(
                            ((item.mrpPrice - item.sellingPrice) /
                              item.mrpPrice) *
                              100
                          )}
                          % off
                        </Typography>
                      </Box>

                      {/* Quantity Controls */}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1 || isLoading}
                          >
                            <MdRemove />
                          </IconButton>
                          <Typography
                            sx={{ minWidth: 30, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={isLoading}
                          >
                            <MdAdd />
                          </IconButton>
                        </Box>

                        <IconButton
                          color="error"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isLoading}
                        >
                          <MdDelete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Grid>

            {/* Price Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, position: "sticky", top: 20 }}>
                <Typography variant="h6" mb={2}>
                  Price Details
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Price ({cart.totalItem} items)</Typography>
                  <Typography>₹{Math.round(cart.totalMrpPrice)}</Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography>Discount</Typography>
                  <Typography color="success.main">
                    {cart.discount}%
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6">Total Amount</Typography>
                  <Typography variant="h6" color="primary">
                    ₹{Math.round(cart.totalSellingPrice)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="success.main"
                  mb={2}
                  textAlign="center"
                  fontWeight={600}
                >
                  You will save ₹
                  {Math.round(cart.totalMrpPrice - cart.totalSellingPrice)} on
                  this order
                </Typography>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={clearing ? undefined : handleCancelClear}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            width: { xs: "92%", sm: 480 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 0 }}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(239,68,68,0.1)",
                color: "error.main",
              }}
            >
              <MdDeleteForever size={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Clear your cart?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This action will remove all items from your cart.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Items
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {cart?.totalItem ?? 0}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="text.secondary">
                Current total
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">
                ₹{cart?.totalSellingPrice ?? 0}
              </Typography>
            </Stack>
          </Card>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCancelClear}
            disabled={clearing}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2, px: 2 }}
          >
            Keep Items
          </Button>
          <Button
            onClick={handleConfirmClear}
            disabled={clearing}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
              boxShadow: "0 8px 20px rgba(239,68,68,0.25)",
            }}
            startIcon={<MdDelete />}
          >
            {clearing ? "Clearing..." : "Clear Cart"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Cart;
