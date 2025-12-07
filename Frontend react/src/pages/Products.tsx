import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Pagination,
  Drawer,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MdShoppingCart,
  MdFavorite,
  MdFavoriteBorder,
  MdFilterList,
  MdSort,
} from "react-icons/md";
import { productService } from "../services/productService";
import { buildFirstImage } from "../utils/image";
import type { Product, ProductSearchParams } from "../types/product";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<ProductSearchParams>({
    category: undefined,
    brand: undefined,
    colors: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    minDiscount: undefined,
    sort: undefined,
    pageNumber: 0,
  });

  const { items: wishlistItems, isLoading: wishlistLoading } = useAppSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if we have a category filter from Home page navigation
        if (location.state?.categoryFilter && !filters.category) {
          setFilters((prev) => ({
            ...prev,
            category: location.state.categoryFilter,
          }));
          return; // Return early, the filter update will trigger another fetch
        }

        // Check if we have search results from navigation state
        if (location.state?.searchResults) {
          setProducts(location.state.searchResults);
          setTotalPages(1);
          setTotalElements(location.state.searchResults.length);
        } else {
          // Fetch products with filters
          const data = await productService.getAllProducts(filters);
          setProducts(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, location.state]);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const isInWishlist = (productId: number): boolean => {
    const inWishlist = wishlistItems.some((item) => item.id === productId);
    console.log(
      `🔍 Checking product ${productId} in wishlist:`,
      inWishlist,
      "Current wishlist IDs:",
      wishlistItems.map((i) => i.id)
    );
    return inWishlist;
  };

  const handleWishlistToggle = async (
    e: React.MouseEvent,
    productId: number
  ) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    console.log(
      `🔘 Toggle wishlist for product ${productId}, current state: ${isInWishlist(
        productId
      )}`
    );

    try {
      if (isInWishlist(productId)) {
        await dispatch(removeFromWishlist(productId)).unwrap();
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
      }
    } catch (error) {
      console.error("❌ Wishlist error:", error);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
    } catch (error) {
      console.error("❌ Add to cart error:", error);
    }
  };

  const handleFilterChange = (newFilters: ProductSearchParams) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      category: undefined,
      brand: undefined,
      colors: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
      sort: filters.sort,
      pageNumber: 0,
    });
  };

  const handleSortChange = (event: any) => {
    setFilters({ ...filters, sort: event.target.value, pageNumber: 0 });
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setFilters({ ...filters, pageNumber: page - 1 });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.colors) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.minDiscount !== undefined) count++;
    return count;
  };

  return (
    <>
      <Navbar />
      <Box className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24 pb-12">
        <Container maxWidth="xl">
          {/* Header with Sort */}
          <Box className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Box>
              <Typography
                variant="h4"
                className="font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              >
                {location.state?.searchResults
                  ? "Search Results"
                  : "All Products"}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {totalElements} product{totalElements !== 1 ? "s" : ""} found
              </Typography>
            </Box>

            <Box className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              {isMobile && (
                <Button
                  variant="outlined"
                  startIcon={<MdFilterList />}
                  onClick={() => setMobileFiltersOpen(true)}
                  sx={{
                    borderColor: "#8b5cf6",
                    color: "#8b5cf6",
                    "&:hover": {
                      borderColor: "#7c3aed",
                      backgroundColor: "rgba(139, 92, 246, 0.04)",
                    },
                  }}
                >
                  Filters{" "}
                  {activeFiltersCount() > 0 && `(${activeFiltersCount()})`}
                </Button>
              )}

              {/* Sort Dropdown */}
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={filters.sort || ""}
                  onChange={handleSortChange}
                  displayEmpty
                  startAdornment={<MdSort className="mr-2 text-purple-600" />}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8b5cf6",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7c3aed",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#8b5cf6",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Relevance</em>
                  </MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            {!isMobile && (
              <Box className="w-80 flex-shrink-0">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </Box>
            )}

            {/* Mobile Filter Drawer */}
            <Drawer
              anchor="left"
              open={mobileFiltersOpen}
              onClose={() => setMobileFiltersOpen(false)}
            >
              <Box sx={{ width: 300, p: 2 }}>
                <FilterSidebar
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    handleFilterChange(newFilters);
                    setMobileFiltersOpen(false);
                  }}
                  onClearFilters={() => {
                    handleClearFilters();
                    setMobileFiltersOpen(false);
                  }}
                />
              </Box>
            </Drawer>

            {/* Products Grid */}
            <Box className="flex-1">
              {loading ? (
                <Box className="flex justify-center items-center py-20">
                  <CircularProgress
                    sx={{
                      color: "#8b5cf6",
                    }}
                  />
                </Box>
              ) : error ? (
                <Alert severity="error" className="mb-6">
                  {error}
                </Alert>
              ) : products.length === 0 ? (
                <Box className="text-center py-20">
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    className="mb-4"
                  >
                    No products found
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              ) : (
                <>
                  <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                        onClick={() => navigate(`/products/${product.id}`)}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: "divider",
                          position: "relative",
                        }}
                      >
                        {/* Wishlist Icon */}
                        <IconButton
                          onClick={(e) => handleWishlistToggle(e, product.id)}
                          disabled={wishlistLoading}
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            bgcolor: "rgba(255, 255, 255, 0.9)",
                            zIndex: 1,
                            "&:hover": {
                              bgcolor: "rgba(255, 255, 255, 1)",
                            },
                          }}
                        >
                          {isInWishlist(product.id) ? (
                            <MdFavorite className="text-2xl text-red-500" />
                          ) : (
                            <MdFavoriteBorder className="text-2xl text-gray-600" />
                          )}
                        </IconButton>

                        {/* Discount Badge */}
                        {product.discountPercent > 0 && (
                          <Chip
                            label={`${product.discountPercent}% OFF`}
                            color="error"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              zIndex: 1,
                              fontWeight: "bold",
                            }}
                          />
                        )}

                        <CardMedia
                          component="img"
                          height="300"
                          image={buildFirstImage(product.images)}
                          alt={product.title}
                          sx={{
                            height: 300,
                            objectFit: "contain",
                            bgcolor: "#f5f5f5",
                            p: 2,
                          }}
                        />
                        <CardContent className="flex-1">
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            className="font-semibold line-clamp-2 min-h-[3.5rem]"
                          >
                            {product.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className="mb-3"
                          >
                            {product.brand}
                          </Typography>
                          <Box className="flex items-center gap-2 mb-2">
                            <Typography
                              variant="h6"
                              className="font-bold text-purple-600"
                            >
                              ₹{product.sellingPrice.toLocaleString()}
                            </Typography>
                            {product.discountPercent > 0 && (
                              <Typography
                                variant="body2"
                                className="line-through text-gray-500"
                              >
                                ₹{product.mrpPrice.toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                          <Box className="flex items-center gap-2">
                            <Typography
                              variant="body2"
                              className="text-green-600 font-medium"
                            >
                              {product.quantity > 0
                                ? "In Stock"
                                : "Out of Stock"}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions className="p-4 pt-0">
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<MdShoppingCart />}
                            disabled={product.quantity === 0}
                            onClick={(e) => handleAddToCart(e, product.id)}
                            sx={{
                              background:
                                product.quantity === 0
                                  ? "gray"
                                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              "&:hover": {
                                background:
                                  product.quantity === 0
                                    ? "gray"
                                    : "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                              },
                            }}
                          >
                            {product.quantity === 0
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </Button>
                        </CardActions>
                      </Card>
                    ))}
                  </Box>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box className="flex justify-center mt-8">
                      <Pagination
                        count={totalPages}
                        page={(filters.pageNumber || 0) + 1}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          "& .MuiPaginationItem-root": {
                            "&.Mui-selected": {
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Products;
