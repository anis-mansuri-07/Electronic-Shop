import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  IconButton,
  Divider,
} from "@mui/material";
import {
  MdShoppingCart,
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import { productService } from "../services/productService";
import { buildImageUrl } from "../utils/image";
import type { Product } from "../types/product";
import Navbar from "../components/Navbar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { items: wishlistItems, isLoading: wishlistLoading } = useAppSelector(
    (state) => state.wishlist
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch product details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch wishlist on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const isInWishlist = (): boolean => {
    return product
      ? wishlistItems.some((item) => item.id === product.id)
      : false;
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist()) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      await dispatch(
        addToCart({ productId: product.id, quantity: 1 })
      ).unwrap();
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getImageUrl = (imagePath: string) => buildImageUrl(imagePath);

  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setSelectedImageIndex(
        (prev) => (prev - 1 + product.images.length) % product.images.length
      );
    }
  };

  if (loading) {
    return (
      <Box className="min-h-screen bg-gray-50">
        <Navbar />
        <Box className="flex justify-center items-center py-20">
          <CircularProgress size={60} sx={{ color: "#8b5cf6" }} />
        </Box>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box className="min-h-screen bg-gray-50">
        <Navbar />
        <Container maxWidth="lg" className="py-12">
          <Alert severity="error" className="mb-4">
            {error || "Product not found"}
          </Alert>
          <Button
            startIcon={<MdArrowBack />}
            onClick={() => navigate("/products")}
            variant="outlined"
          >
            Back to Products
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gray-50">
      <Navbar />
      <Container maxWidth="lg" className="py-8">
        {/* Back Button */}
        <Button
          startIcon={<MdArrowBack />}
          onClick={() => navigate("/products")}
          variant="text"
          className="mb-4 text-gray-600 hover:text-purple-600"
          sx={{ textTransform: "none" }}
        >
          Back to Products
        </Button>

        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <Box>
            <Paper
              elevation={3}
              className="rounded-2xl overflow-hidden bg-white"
            >
              {/* Main Image */}
              <Box className="relative bg-gray-100 aspect-square overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <>
                    <Box
                      component="img"
                      src={getImageUrl(product.images[selectedImageIndex])}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      onError={(e: any) => {
                        e.target.src =
                          "https://via.placeholder.com/600x600?text=No+Image";
                      }}
                    />
                    {product.images.length > 1 && (
                      <>
                        <IconButton
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                          onClick={prevImage}
                          size="large"
                        >
                          <MdChevronLeft className="text-2xl" />
                        </IconButton>
                        <IconButton
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                          onClick={nextImage}
                          size="large"
                        >
                          <MdChevronRight className="text-2xl" />
                        </IconButton>
                        <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {product.images.map((_, index) => (
                            <Box
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === selectedImageIndex
                                  ? "bg-purple-600 w-6"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </Box>
                      </>
                    )}
                  </>
                ) : (
                  <Box className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <Typography variant="body1" className="text-gray-400">
                      No Image Available
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <Box className="p-4 border-t border-gray-200">
                  <Box className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <Box
                        key={index}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === selectedImageIndex
                            ? "border-purple-600 shadow-md"
                            : "border-gray-200 hover:border-purple-300"
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Box
                          component="img"
                          src={getImageUrl(image)}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e: any) => {
                            e.target.src =
                              "https://via.placeholder.com/80x80?text=No+Image";
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Product Info */}
          <Box>
            {/* Brand & Category */}
            <Box className="flex items-center gap-3 mb-4">
              {product.brand && (
                <Chip
                  label={product.brand}
                  className="bg-purple-100 text-purple-700 font-semibold"
                />
              )}
              {product.category && (
                <Chip
                  label={product.category.name}
                  variant="outlined"
                  className="border-purple-300 text-purple-700"
                />
              )}
              {product.discountPercent > 0 && (
                <Chip
                  label={`${product.discountPercent}% OFF`}
                  className="bg-red-500 text-white font-semibold"
                />
              )}
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              className="font-bold text-gray-900 mb-4"
              component="h1"
            >
              {product.title}
            </Typography>

            {/* Price */}
            <Box className="mb-6">
              <Box className="flex items-baseline gap-3 mb-2">
                <Typography variant="h3" className="font-bold text-gray-900">
                  {formatPrice(product.sellingPrice)}
                </Typography>
                {product.mrpPrice > product.sellingPrice && (
                  <Typography
                    variant="h6"
                    className="text-gray-400 line-through"
                  >
                    {formatPrice(product.mrpPrice)}
                  </Typography>
                )}
              </Box>
              {product.mrpPrice > product.sellingPrice && (
                <Typography
                  variant="body1"
                  className="text-green-600 font-semibold"
                >
                  You save{" "}
                  {formatPrice(product.mrpPrice - product.sellingPrice)} (
                  {product.discountPercent}%)
                </Typography>
              )}
            </Box>

            <Divider className="my-6" />

            {/* Description */}
            <Box className="mb-6">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 mb-2"
              >
                Description
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-700 leading-relaxed"
              >
                {product.description}
              </Typography>
            </Box>

            {/* Product Details */}
            <Box className="mb-6 space-y-3">
              <Box className="flex items-center gap-4">
                <Typography variant="body2" className="text-gray-600 w-32">
                  Color:
                </Typography>
                <Box className="flex items-center gap-2">
                  {product.color && (
                    <>
                      <Box
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        sx={{ backgroundColor: product.color.toLowerCase() }}
                      />
                      <Typography
                        variant="body2"
                        className="text-gray-900 font-medium"
                      >
                        {product.color}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              <Box className="flex items-center gap-4">
                <Typography variant="body2" className="text-gray-600 w-32">
                  Availability:
                </Typography>
                <Typography
                  variant="body2"
                  className={
                    product.quantity > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {product.quantity > 0
                    ? `In Stock (${product.quantity} available)`
                    : "Out of Stock"}
                </Typography>
              </Box>

              {product.brand && (
                <Box className="flex items-center gap-4">
                  <Typography variant="body2" className="text-gray-600 w-32">
                    Brand:
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-900 font-medium"
                  >
                    {product.brand}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider className="my-6" />

            {/* Action Buttons */}
            <Box className="space-y-3">
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<MdShoppingCart />}
                disabled={product.quantity === 0}
                onClick={handleAddToCart}
                className="custom-btn"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                {product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={
                  isInWishlist() ? <MdFavorite /> : <MdFavoriteBorder />
                }
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className="custom-outlined-btn"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.5,
                  color: isInWishlist() ? "#ef4444" : undefined,
                  borderColor: isInWishlist() ? "#ef4444" : undefined,
                  "&:hover": {
                    borderColor: isInWishlist() ? "#dc2626" : undefined,
                    backgroundColor: isInWishlist()
                      ? "rgba(239, 68, 68, 0.04)"
                      : undefined,
                  },
                }}
              >
                {isInWishlist() ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProductDetails;
