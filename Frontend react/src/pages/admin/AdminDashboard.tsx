import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Stack,
} from "@mui/material";
import { FaUsers, FaBox, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import adminDashboardService from "../../services/adminDashboardService";
import type {
  DashboardStatsResponse,
  OrderStatusCounts,
} from "../../types/admin";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import AdminNavbar from "../../components/AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatusCounts | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CARDS = useMemo(
    () => [
      {
        key: "users",
        icon: <FaUsers className="text-3xl" />,
        title: "Total Users",
        color: "#3b82f6",
        value: stats?.totalUsers ?? 0,
      },
      {
        key: "products",
        icon: <FaBox className="text-3xl" />,
        title: "Products",
        color: "#22c55e",
        value: stats?.totalProducts ?? 0,
      },
      {
        key: "orders",
        icon: <FaShoppingCart className="text-3xl" />,
        title: "Orders",
        color: "#a855f7",
        value: stats?.totalOrders ?? 0,
      },
      {
        key: "revenue",
        icon: <FaChartLine className="text-3xl" />,
        title: "Revenue",
        color: "#f59e0b",
        value: stats?.totalRevenue ?? 0,
        isCurrency: true,
      },
      {
        key: "categories",
        icon: <FaBox className="text-3xl" />,
        title: "Categories",
        color: "#06b6d4",
        value: stats?.totalCategories ?? 0,
      },
      {
        key: "cancelled",
        icon: <FaShoppingCart className="text-3xl" />,
        title: "Cancelled Orders",
        color: "#ef4444",
        value: stats?.totalCancelledOrders ?? 0,
      },
      {
        key: "refunds",
        icon: <FaChartLine className="text-3xl" />,
        title: "Refund Amount",
        color: "#f97316",
        value: stats?.totalRefundAmount ?? 0,
        isCurrency: true,
      },
    ],
    [stats]
  );

  const pieData = useMemo(() => {
    if (!orderStatus) return [] as { name: string; value: number }[];
    return Object.entries(orderStatus).map(([name, value]) => ({
      name,
      value,
    }));
  }, [orderStatus]);

  const PIE_COLORS = [
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [s, o] = await Promise.all([
          adminDashboardService.getStats(),
          adminDashboardService.getOrderStatus(),
        ]);
        if (!mounted) return;
        setStats(s);
        setOrderStatus(o);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {/* Dashboard Content */}
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Dashboard Overview
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper elevation={2} className="p-6">
            <Typography color="error">{error}</Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Left: Stats and Chart */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Grid container spacing={3}>
                {CARDS.map((card) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={card.key}>
                    <Paper elevation={3} sx={{ p: 2.5, borderRadius: 2 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box sx={{ color: card.color }}>{card.icon}</Box>
                        <Chip
                          label={card.title}
                          size="small"
                          sx={{ bgcolor: "#f3f4f6" }}
                        />
                      </Stack>
                      <Typography variant="h5" fontWeight={800} sx={{ mt: 1 }}>
                        {card.isCurrency
                          ? `₹${(card.value as number).toLocaleString("en-IN")}`
                          : (card.value as number).toLocaleString("en-IN")}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Orders by Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                      >
                        {pieData.map((_, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AdminDashboard;
