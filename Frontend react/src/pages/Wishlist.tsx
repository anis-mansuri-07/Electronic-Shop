import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { buildFirstImage } from "../utils/image";
import Navbar from "../components/Navbar";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.wishlist);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [isAuthenticated, navigate, dispatch]);

  const handleRemove = async (productId: number) => {
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <Box className="flex justify-center items-center py-32">
          <CircularProgress size={60} sx={{ color: "#667eea" }} thickness={4} />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Container maxWidth="xl" className="py-10">
        {/* Header */}
        <Box className="mb-8 animate-fade-in">
          <Typography
            variant="h3"
            className="font-bold mb-2"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: "2rem", md: "3rem" },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Wishlist
          </Typography>
          <Typography variant="body1" className="text-gray-600 text-lg">
            {items.length} {items.length === 1 ? "item" : "items"} saved for
            later
          </Typography>
        </Box>

        {error && (
          <Box className="mb-6 animate-fade-in">
            <Alert severity="error" className="rounded-2xl shadow-soft">
              {error}
            </Alert>
          </Box>
        )}

        {items.length === 0 ? (
          <Box className="text-center py-32 animate-fade-in">
            <Box className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <MdShoppingCart className="text-6xl text-gray-400" />
            </Box>
            <Typography variant="h5" className="font-bold text-gray-800 mb-2">
              Your wishlist is empty
            </Typography>
            <Typography variant="body1" className="text-gray-500 mb-6">
              Start adding products you love!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/products")}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                },
              }}
            >
              Browse Products
            </Button>
          </Box>
        ) : (
          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
            {items.map((product) => (
              <Box key={product.id} className="animate-slide-up">
                <Card className="product-card h-full flex flex-col relative">
                  {/* Remove Button */}
                  <IconButton
                    className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => handleRemove(product.id)}
                    size="small"
                    sx={{
                      "&:hover": {
                        backgroundColor: "#fee2e2",
                      },
                    }}
                  >
                    <MdDelete className="text-xl text-red-500" />
                  </IconButton>

                  {/* Product Image */}
                  <Box
                    className="product-card-image cursor-pointer bg-gradient-to-br from-gray-100 to-gray-200 h-64"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <CardMedia
                      component="img"
                      image={buildFirstImage(product.images)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      onError={(e: any) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </Box>

                  <CardContent className="flex-1 flex flex-col p-5">
                    {/* Title */}
                    <Typography
                      variant="h6"
                      className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-purple-600"
                      onClick={() => navigate(`/products/${product.id}`)}
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontSize: "1.05rem",
                        lineHeight: "1.4",
                        minHeight: "2.8rem",
                      }}
                    >
                      {product.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-4 flex-1"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: "1.5",
                      }}
                    >
                      {product.description}
                    </Typography>

                    {/* Price Section */}
                    <Box className="mb-4">
                      <Box className="flex items-baseline gap-2 mb-1">
                        <Typography
                          variant="h5"
                          className="font-bold"
                          sx={{
                            background:
                              "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {formatPrice(product.sellingPrice)}
                        </Typography>
                        {product.mrpPrice > product.sellingPrice && (
                          <Typography
                            variant="body2"
                            className="text-gray-400 line-through"
                          >
                            {formatPrice(product.mrpPrice)}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Color */}
                    {product.color && (
                      <Box className="flex items-center gap-2 mb-4">
                        <Box
                          className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                          sx={{
                            backgroundColor: product.color.toLowerCase(),
                          }}
                        />
                        <Typography
                          variant="caption"
                          className="text-gray-600 font-medium"
                        >
                          {product.color}
                        </Typography>
                      </Box>
                    )}

                    {/* Add to Cart Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<MdShoppingCart className="text-lg" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add to cart
                        navigate(`/products/${product.id}`);
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        py: 1.5,
                        borderRadius: "12px",
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Wishlist;
