import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import {
  MdDashboard,
  MdCategory,
  MdInventory,
  MdShoppingCart,
  MdPeople,
  MdLogout,
  MdAccountCircle,
  MdKeyboardArrowDown,
  MdAdminPanelSettings,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Debug logging
  console.log("🔍 AdminNavbar - User:", user);
  console.log("🔍 AdminNavbar - User Role:", user?.role);
  console.log(
    "🔍 AdminNavbar - Is SUPER_ADMIN?:",
    user?.role === "ROLE_SUPER_ADMIN"
  );

  const [categoryMenu, setCategoryMenu] = useState<null | HTMLElement>(null);
  const [productMenu, setProductMenu] = useState<null | HTMLElement>(null);
  const [orderMenu, setOrderMenu] = useState<null | HTMLElement>(null);
  const [profileMenu, setProfileMenu] = useState<null | HTMLElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "#1e293b", boxShadow: 2 }}>
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            mr: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin Panel
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
          {/* Dashboard */}
          <Button
            startIcon={<MdDashboard />}
            onClick={() => navigate("/admin/dashboard")}
            sx={{
              color: isActive("/admin/dashboard") ? "#fff" : "#cbd5e1",
              bgcolor: isActive("/admin/dashboard")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            Dashboard
          </Button>

          {/* Categories */}
          <Button
            startIcon={<MdCategory />}
            endIcon={<MdKeyboardArrowDown />}
            onClick={(e) => setCategoryMenu(e.currentTarget)}
            sx={{
              color: location.pathname.includes("/admin/categories")
                ? "#fff"
                : "#cbd5e1",
              bgcolor: location.pathname.includes("/admin/categories")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            Categories
          </Button>
          <Menu
            anchorEl={categoryMenu}
            open={Boolean(categoryMenu)}
            onClose={() => setCategoryMenu(null)}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={() => {
                navigate("/admin/categories/create");
                setCategoryMenu(null);
              }}
            >
              Create Category
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/admin/categories");
                setCategoryMenu(null);
              }}
            >
              Manage Categories
            </MenuItem>
          </Menu>

          {/* Products */}
          <Button
            startIcon={<MdInventory />}
            endIcon={<MdKeyboardArrowDown />}
            onClick={(e) => setProductMenu(e.currentTarget)}
            sx={{
              color: location.pathname.includes("/admin/products")
                ? "#fff"
                : "#cbd5e1",
              bgcolor: location.pathname.includes("/admin/products")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            Products
          </Button>
          <Menu
            anchorEl={productMenu}
            open={Boolean(productMenu)}
            onClose={() => setProductMenu(null)}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={() => {
                navigate("/admin/products/create");
                setProductMenu(null);
              }}
            >
              Create Product
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/admin/products");
                setProductMenu(null);
              }}
            >
              Manage Products
            </MenuItem>
          </Menu>

          {/* Orders */}
          <Button
            startIcon={<MdShoppingCart />}
            endIcon={<MdKeyboardArrowDown />}
            onClick={(e) => setOrderMenu(e.currentTarget)}
            sx={{
              color: location.pathname.includes("/admin/orders")
                ? "#fff"
                : "#cbd5e1",
              bgcolor: location.pathname.includes("/admin/orders")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            Orders
          </Button>
          <Menu
            anchorEl={orderMenu}
            open={Boolean(orderMenu)}
            onClose={() => setOrderMenu(null)}
            sx={{ mt: 1 }}
          >
            <MenuItem
              onClick={() => {
                navigate("/admin/orders");
                setOrderMenu(null);
              }}
            >
              All Orders
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/admin/orders?status=pending");
                setOrderMenu(null);
              }}
            >
              Pending Orders
            </MenuItem>
          </Menu>

          {/* Users */}
          <Button
            startIcon={<MdPeople />}
            onClick={() => navigate("/admin/users")}
            sx={{
              color: isActive("/admin/users") ? "#fff" : "#cbd5e1",
              bgcolor: isActive("/admin/users")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              textTransform: "none",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
            }}
          >
            Users
          </Button>

          {/* Manage Admins - Only for Super Admin */}
          {user?.role === "ROLE_SUPER_ADMIN" && (
            <Button
              startIcon={<MdAdminPanelSettings />}
              onClick={() => navigate("/admin/manage-admins")}
              sx={{
                color: isActive("/admin/manage-admins") ? "#fff" : "#cbd5e1",
                bgcolor: isActive("/admin/manage-admins")
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
                textTransform: "none",
                px: 2,
                "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
              }}
            >
              Manage Admins
            </Button>
          )}
        </Box>

        {/* Profile Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
            {user?.role === "ROLE_SUPER_ADMIN" ? "Super Admin" : "Admin"}
          </Typography>
          <IconButton
            onClick={(e) => setProfileMenu(e.currentTarget)}
            sx={{ color: "#fff" }}
          >
            <MdAccountCircle size={28} />
          </IconButton>
          <Menu
            anchorEl={profileMenu}
            open={Boolean(profileMenu)}
            onClose={() => setProfileMenu(null)}
            sx={{ mt: 1 }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/admin/profile");
                setProfileMenu(null);
              }}
            >
              <MdAccountCircle style={{ marginRight: 8 }} />
              My Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleLogout();
                setProfileMenu(null);
              }}
            >
              <MdLogout style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
