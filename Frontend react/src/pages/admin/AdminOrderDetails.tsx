import { useEffect, useState } from "react";
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
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
  Link,
} from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import adminOrderService from "../../services/adminOrderService";
import type { OrderResponse } from "../../types/order";
import { useAppSelector } from "../../store/hooks";
import { Role } from "../../types/auth";

const AdminOrderDetails = () => {
  const { user } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !user ||
      (user.role !== Role.ROLE_ADMIN && user.role !== Role.ROLE_SUPER_ADMIN)
    ) {
      navigate("/login");
      return;
    }
    const fetchOrder = async () => {
      try {
        const data = await adminOrderService.getById(Number(orderId));
        setOrder(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [user, orderId, navigate]);

  // format date dd/mm/yyyy
  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const d = new Date(value);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          variant="text"
          onClick={() => navigate(-1)}
          sx={{ mb: 2, textTransform: "none" }}
        >
          ← Back
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
                Placed: {formatDate(order.orderDate)}
              </Typography>
              {order.deliveredDate && (
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Delivered: {formatDate(order.deliveredDate)}
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
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                User
              </Typography>
              <Link
                component={RouterLink}
                to={`/admin/users`}
                underline="hover"
              >
                {order.userEmail}
              </Link>
              {/* Shipping address block with multiple backend naming fallbacks */}
              {(order.shippingAddress ||
                order.address ||
                (order as any).locality) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary" mb={1}>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" mb={0.5}>
                    {order.shippingAddress
                      ? `${order.shippingAddress.locality} ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pinCode}`
                      : order.address
                      ? `${order.address.locality} ${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pinCode}`
                      : `${(order as any).locality || ""} ${
                          (order as any).address || ""
                        }, ${(order as any).city || ""}, ${
                          (order as any).state || ""
                        } - ${(order as any).pinCode || ""}`}
                  </Typography>
                  <Typography variant="body2" mb={0.5}>
                    Mobile:{" "}
                    {order.shippingAddress
                      ? order.shippingAddress.mobile
                      : order.address
                      ? order.address.mobile
                      : (order as any).mobile || "-"}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
};

export default AdminOrderDetails;
