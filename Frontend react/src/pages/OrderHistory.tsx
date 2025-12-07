import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useAppSelector } from "../store/hooks";
import orderService from "../services/orderService";
import type { OrderResponse } from "../types/order";

const OrderHistory = () => {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "ROLE_USER") {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          My Orders
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Card sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" mb={2}>
              No orders yet
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{ textTransform: "none" }}
            >
              Shop Now
            </Button>
          </Card>
        ) : (
          <Stack spacing={2}>
            {orders.map((order) => (
              <Card
                key={order.id}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
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
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {order.totalItem} items • Placed on{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    Total Paid: ₹{order.totalSellingPrice}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </>
  );
};

export default OrderHistory;
