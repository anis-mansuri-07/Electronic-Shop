import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Navbar from "../../components/AdminNavbar";
import adminOrderService from "../../services/adminOrderService";
import { ORDER_STATUS_OPTIONS, OrderStatus } from "../../types/adminOrder";
import type { AdminOrder } from "../../types/adminOrder";

const statusColor = (status: string) => {
  switch (status) {
    case OrderStatus.DELIVERED:
      return "success";
    case OrderStatus.CANCELLED:
      return "error";
    case OrderStatus.SHIPPED:
      return "info";
    case OrderStatus.CONFIRMED:
      return "primary";
    case OrderStatus.PLACED:
      return "secondary";
    default:
      return "warning"; // PENDING
  }
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status")?.toUpperCase() as
    | OrderStatus
    | undefined;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let raw: unknown;
      if (statusFilter && ORDER_STATUS_OPTIONS.includes(statusFilter)) {
        raw = await adminOrderService.getByStatus(statusFilter);
      } else {
        raw = await adminOrderService.getAll();
      }
      if (Array.isArray(raw)) {
        setOrders(raw as AdminOrder[]);
      } else {
        console.error("Expected array of orders but got", raw);
        setError("Unexpected response format from server (not a list)");
        setOrders([]);
      }
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingId(orderId);
      const updated = await adminOrderService.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: updated.orderStatus } : o
        )
      );
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (value: string) => {
    if (value === "ALL") {
      searchParams.delete("status");
      setSearchParams(searchParams);
    } else {
      searchParams.set("status", value.toLowerCase());
      setSearchParams(searchParams);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            Manage Orders
          </Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Status Filter</InputLabel>
              <Select
                label="Status Filter"
                value={statusFilter || "ALL"}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={fetchOrders} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Stack>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card sx={{ p: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : !Array.isArray(orders) || orders.length === 0 ? (
            <Typography variant="body2" color="text.secondary" p={2}>
              No orders found.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>User Email</TableCell>
                  <TableCell align="right">Total Items</TableCell>
                  <TableCell align="right">Selling Price (₹)</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Change Status</TableCell>
                  <TableCell>View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id} hover>
                    <TableCell>{o.id}</TableCell>
                    <TableCell>{o.userEmail || o.user?.email || "-"}</TableCell>
                    <TableCell align="right">
                      {o.totalItem ??
                        o.items?.reduce((a, i) => a + (i.quantity || 0), 0) ??
                        0}
                    </TableCell>
                    <TableCell align="right">
                      {o.totalSellingPrice ?? "-"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={o.orderStatus}
                        color={statusColor(o.orderStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={o.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              o.id,
                              e.target.value as OrderStatus
                            )
                          }
                          disabled={updatingId === o.id}
                        >
                          {ORDER_STATUS_OPTIONS.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/admin/orders/${o.id}`}
                        size="small"
                        variant="outlined"
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Container>
    </>
  );
};

export default AdminOrders;
