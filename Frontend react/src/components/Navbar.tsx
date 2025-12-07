import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Badge,
} from "@mui/material";
import {
  MdSearch,
  MdLogout,
  MdHome,
  MdStore,
  MdInfo,
  MdShoppingCart,
  MdAccountCircle,
  MdFavoriteBorder,
  MdReceiptLong,
} from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { fetchWishlist, clearWishlist } from "../store/slices/wishlistSlice";
import { fetchCart, resetCartState } from "../store/slices/cartSlice";
import { productService } from "../services/productService";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { cart } = useAppSelector((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    // Close profile menu when route changes
    setAnchorEl(null);
  }, [location.pathname]);

  // Fetch wishlist and cart when authenticated (only for regular users, not admins)
  const isAdmin =
    user?.role === "ROLE_ADMIN" || user?.role === "ROLE_SUPER_ADMIN";
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      dispatch(fetchWishlist());
      dispatch(fetchCart());
    }
  }, [isAuthenticated, isAdmin, dispatch]);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlist());
    dispatch(resetCartState());
    handleProfileClose();
    navigate("/");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const results = await productService.searchProducts(searchQuery.trim());
        navigate("/products", {
          state: { searchQuery: searchQuery.trim(), searchResults: results },
        });
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        backdropFilter: "blur(10px)",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar className="px-4 md:px-8" sx={{ minHeight: { xs: 64, md: 70 } }}>
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center no-underline group">
          <Box className="flex items-center gap-2.5">
            <Box
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              sx={{
                background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
              }}
            >
              <MdStore className="text-white text-lg" />
            </Box>
            <Typography
              variant="h6"
              className="hidden sm:block"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                color: "#111827",
                fontSize: "1.35rem",
                letterSpacing: "-0.01em",
              }}
            >
              eShop
            </Typography>
          </Box>
        </Link>

        {/* Navigation Links - Desktop */}
        <Box className="flex-1 items-center gap-1 ml-8 hidden md:flex">
          <Link to="/" className="no-underline">
            <Button
              startIcon={<MdHome className="text-base" />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: location.pathname === "/" ? "#2563eb" : "#6b7280",
                backgroundColor:
                  location.pathname === "/" ? "#eff6ff" : "transparent",
                px: 2.5,
                py: 1,
                borderRadius: "8px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor:
                    location.pathname === "/" ? "#dbeafe" : "#f3f4f6",
                },
              }}
            >
              Home
            </Button>
          </Link>

          <Link to="/products" className="no-underline">
            <Button
              startIcon={<MdStore className="text-base" />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: location.pathname.includes("/products")
                  ? "#2563eb"
                  : "#6b7280",
                backgroundColor: location.pathname.includes("/products")
                  ? "#eff6ff"
                  : "transparent",
                px: 2.5,
                py: 1,
                borderRadius: "8px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: location.pathname.includes("/products")
                    ? "#dbeafe"
                    : "#f3f4f6",
                },
              }}
            >
              Products
            </Button>
          </Link>

          <Link to="/about" className="no-underline">
            <Button
              startIcon={<MdInfo className="text-base" />}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: location.pathname === "/about" ? "#2563eb" : "#6b7280",
                backgroundColor:
                  location.pathname === "/about" ? "#eff6ff" : "transparent",
                px: 2.5,
                py: 1,
                borderRadius: "8px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor:
                    location.pathname === "/about" ? "#dbeafe" : "#f3f4f6",
                },
              }}
            >
              About
            </Button>
          </Link>
        </Box>

        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          className="flex-1 max-w-lg mx-4 hidden lg:block"
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdSearch className="text-gray-400 text-xl" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#d1d5db",
                },
                "&.Mui-focused": {
                  backgroundColor: "#ffffff",
                  borderColor: "#2563eb",
                  boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
                },
                "& fieldset": {
                  border: "none",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: "9px 12px",
                fontSize: "0.875rem",
              },
            }}
          />
        </Box>

        {/* Right Side - Auth Buttons & Cart */}
        <Box className="flex items-center gap-3">
          {/* Shopping Cart Icon */}
          {isAuthenticated && !isAdmin && (
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <Badge
                badgeContent={cart?.totalItem || 0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#2563eb",
                    color: "white",
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                  },
                }}
              >
                <MdShoppingCart className="text-gray-700 text-xl" />
              </Badge>
            </IconButton>
          )}

          {/* Wishlist Icon */}
          {isAuthenticated && !isAdmin && (
            <IconButton
              onClick={() => navigate("/wishlist")}
              sx={{
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              <Badge
                badgeContent={wishlistItems.length}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#dc2626",
                    color: "white",
                    fontSize: "0.7rem",
                    minWidth: "18px",
                    height: "18px",
                  },
                }}
              >
                <MdFavoriteBorder className="text-gray-700 text-xl" />
              </Badge>
            </IconButton>
          )}

          {isAuthenticated && user ? (
            <>
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  borderRadius: "8px",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background:
                      "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleProfileClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    overflow: "visible",
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 8,
                      height: 8,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                      border: "1px solid #e5e7eb",
                      borderBottom: "none",
                      borderRight: "none",
                    },
                  },
                }}
              >
                <Box className="px-3 py-2.5 border-b border-gray-100">
                  <Typography
                    variant="body2"
                    className="font-medium text-gray-900 mb-1 text-sm"
                  >
                    {user.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="inline-block px-2 py-0.5 rounded-md text-xs font-medium"
                    sx={{
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                    }}
                  >
                    {user.role === "ROLE_USER"
                      ? "Customer"
                      : user.role.replace("ROLE_", "")}
                  </Typography>
                </Box>
                <MenuItem
                  onClick={() => {
                    handleProfileClose();
                    navigate("/profile");
                  }}
                  sx={{
                    py: 1.2,
                    px: 2,
                    mx: 1,
                    my: 0.3,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  <MdAccountCircle className="mr-2 text-base text-gray-600" />
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleProfileClose();
                    navigate("/wishlist");
                  }}
                  sx={{
                    py: 1.2,
                    px: 2,
                    mx: 1,
                    my: 0.3,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  <MdFavoriteBorder className="mr-2 text-base text-gray-600" />
                  My Wishlist
                  {wishlistItems.length > 0 && (
                    <Badge
                      badgeContent={wishlistItems.length}
                      sx={{
                        ml: "auto",
                        "& .MuiBadge-badge": {
                          backgroundColor: "#dc2626",
                          color: "white",
                          fontSize: "0.65rem",
                        },
                      }}
                    />
                  )}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleProfileClose();
                    navigate("/orders");
                  }}
                  sx={{
                    py: 1.2,
                    px: 2,
                    mx: 1,
                    my: 0.3,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  <MdReceiptLong className="mr-2 text-base text-gray-600" />
                  My Orders
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    py: 1.2,
                    px: 2,
                    mx: 1,
                    my: 0.3,
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    color: "#dc2626",
                    "&:hover": {
                      backgroundColor: "#fef2f2",
                    },
                  }}
                >
                  <MdLogout className="mr-2 text-base" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box className="flex items-center gap-2">
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                className="hidden sm:flex"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "8px",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  "&:hover": {
                    borderColor: "#2563eb",
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
                  boxShadow: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
                    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
