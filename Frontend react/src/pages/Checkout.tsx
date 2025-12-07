import { useEffect, useState } from "react";
// Razorpay modal integration
declare global {
  interface Window {
    Razorpay: any;
  }
}
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Card,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { fetchCart } from "../store/slices/cartSlice";
import { fetchUserProfile } from "../store/slices/userSlice";
import orderService from "../services/orderService";
import type { AddressRequest, PaymentLinkResponse } from "../types/order";

const initialAddress: AddressRequest = {
  locality: "",
  address: "",
  city: "",
  state: "Gujarat",
  pinCode: "",
  mobile: "",
};

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, isLoading: cartLoading } = useAppSelector((s) => s.cart);
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { profile } = useAppSelector((s) => s.user);

  const [address, setAddress] = useState<AddressRequest>(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(
    null
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ROLE_USER") {
      navigate("/login");
      return;
    }
    if (!cart) dispatch(fetchCart());
    if (!profile) dispatch(fetchUserProfile());
  }, [isAuthenticated, user, cart, profile, dispatch, navigate]);

  // Pre-fill mobile from user profile
  useEffect(() => {
    if (profile?.phoneNumber && !address.mobile) {
      setAddress((prev) => ({ ...prev, mobile: profile.phoneNumber || "" }));
    }
  }, [profile, address.mobile]);

  const handleChange =
    (field: keyof AddressRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear field error when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Locality validation
    if (!address.locality.trim()) {
      errors.locality = "Locality is required";
    }

    // Address validation
    if (!address.address.trim()) {
      errors.address = "Address is required";
    } else if (address.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    // City validation
    if (!address.city.trim()) {
      errors.city = "City is required";
    }

    // Pin code validation (6 digits)
    if (!address.pinCode.trim()) {
      errors.pinCode = "Pin code is required";
    } else if (!/^\d{6}$/.test(address.pinCode.trim())) {
      errors.pinCode = "Pin code must be exactly 6 digits";
    }

    // Mobile validation (10 digits, Indian format starting with 6-9)
    if (!address.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(address.mobile.trim())) {
      errors.mobile = "Mobile number must be 10 digits starting with 6-9";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = Object.values(address).every((v) => v.trim().length > 0);

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    try {
      setSubmitting(true);
      setError(null);
      const res = await orderService.createOrder(address, "RAZORPAY");
      setPaymentLink(res);
      if (res.paymentUrl) {
        // Open Razorpay payment link in a new tab. Razorpay will redirect back
        // to /payment-success/{orderId}?payment_id=...&payment_link_id=...
        window.open(res.paymentUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Razorpay script loader */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Checkout
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {cartLoading && !cart ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : !cart ? (
          <Alert severity="warning">Cart not found. Add items first.</Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" mb={2}>
                  Shipping Address
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Locality"
                    value={address.locality}
                    onChange={handleChange("locality")}
                    required
                    error={!!fieldErrors.locality}
                    helperText={fieldErrors.locality}
                  />
                  <TextField
                    label="Address"
                    value={address.address}
                    onChange={handleChange("address")}
                    required
                    multiline
                    minRows={2}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="City"
                      value={address.city}
                      onChange={handleChange("city")}
                      required
                      error={!!fieldErrors.city}
                      helperText={fieldErrors.city}
                    />
                    <TextField
                      fullWidth
                      label="State"
                      value={address.state}
                      onChange={handleChange("state")}
                      required
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      fullWidth
                      label="Pin Code"
                      value={address.pinCode}
                      onChange={handleChange("pinCode")}
                      required
                      error={!!fieldErrors.pinCode}
                      helperText={fieldErrors.pinCode}
                    />
                    <TextField
                      fullWidth
                      label="Mobile"
                      value={address.mobile}
                      onChange={handleChange("mobile")}
                      required
                      error={!!fieldErrors.mobile}
                      helperText={fieldErrors.mobile}
                    />
                  </Stack>
                </Stack>
              </Card>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>
                  Payment Method
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Razorpay (default)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  A secure payment link will open in a new tab.
                </Typography>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Card sx={{ p: 3, position: "sticky", top: 16 }}>
                <Typography variant="h6" mb={2}>
                  Order Summary
                </Typography>
                <Stack spacing={1} mb={2}>
                  <Typography variant="body2">
                    Items: {cart.totalItem}
                  </Typography>
                  <Typography variant="body2">
                    MRP: ₹{cart.totalMrpPrice}
                  </Typography>
                  <Typography variant="body2">
                    Discount: {cart.discount}%
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Total: ₹{cart.totalSellingPrice}
                  </Typography>
                </Stack>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={!isFormValid || submitting}
                  onClick={handlePlaceOrder}
                  sx={{ textTransform: "none", mb: 2 }}
                >
                  {submitting ? "Creating Order..." : "Place Order & Pay"}
                </Button>
                {paymentLink && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Order #{paymentLink.orderId} created. Complete payment in
                    the opened tab.
                  </Alert>
                )}
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => navigate("/cart")}
                  sx={{ textTransform: "none" }}
                >
                  Back to Cart
                </Button>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Checkout;
