import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useAppSelector } from "../store/hooks";
import orderService from "../services/orderService";
import type { OrderResponse } from "../types/order";

const OrderDetails = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);
  const isCancellable = (status?: string) =>
    status === "PENDING" || status === "PLACED" || status === "CONFIRMED";

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ROLE_USER") {
      navigate("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(Number(orderId));
        setOrder(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [isAuthenticated, user, orderId, navigate]);

  const handleCancel = async () => {
    if (!order) return;
    try {
      if (!window.confirm("Are you sure you want to cancel this order?")) {
        return;
      }
      setCanceling(true);
      const updated = await orderService.cancelOrder(order.id);
      setOrder(updated);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          variant="text"
          onClick={() => navigate("/orders")}
          sx={{ mb: 2, textTransform: "none" }}
        >
          ← Back to Orders
        </Button>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : !order ? (
          <Alert severity="warning">Order not found.</Alert>
        ) : (
          <Card>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h5" fontWeight={700}>
                  Order #{order.id}
                </Typography>
                <Chip
                  label={order.orderStatus}
                  color={
                    order.orderStatus === "DELIVERED"
                      ? "success"
                      : order.orderStatus === "CANCELLED"
                      ? "error"
                      : "primary"
                  }
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Placed: {new Date(order.orderDate).toLocaleString()}
              </Typography>
              {order.deliveredDate && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Delivered: {new Date(order.deliveredDate).toLocaleString()}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" mb={1}>
                Items
              </Typography>
              <Stack spacing={1} mb={2}>
                {order.items.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    sx={{ bgcolor: "grey.50", p: 1.5, borderRadius: 1 }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2">
                      x{item.quantity} • ₹{item.totalPrice}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" mb={0.5}>
                Total Items: {order.totalItem}
              </Typography>
              <Typography variant="body2" mb={0.5}>
                MRP Total: ₹{order.totalMrpPrice}
              </Typography>
              <Typography variant="body2" mb={0.5}>
                Discount: ₹{order.discount}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary" mb={2}>
                Grand Total: ₹{order.totalSellingPrice}
              </Typography>
              {isCancellable(order.orderStatus) && (
                <Button
                  variant="outlined"
                  color="error"
                  disabled={canceling}
                  onClick={handleCancel}
                  sx={{ textTransform: "none" }}
                >
                  {canceling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default OrderDetails;
