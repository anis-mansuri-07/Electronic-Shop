import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from "react-icons/fa";
import { MdFlashOn } from "react-icons/md";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import categoryService from "../services/categoryService";
import type { CategoryResponse } from "../types/category";
import { buildImageUrl } from "../utils/image";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  console.log("🏠 Home - User from Redux:", user);
  console.log("🏠 Home - Full Name:", user?.fullName);

  const displayName = user?.fullName || null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await categoryService.getAll();
        console.log("🏷️ Fetched categories from backend:", data);
        console.log("🏷️ First category imageUrl:", data[0]?.imageUrl);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    navigate("/products", { state: { categoryFilter: categoryName } });
  };

  const features = [
    {
      icon: <FaTruck className="text-3xl" />,
      title: "Free Shipping",
      description: "On All Orders",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaShieldAlt className="text-3xl" />,
      title: "Secure Payment",
      description: "100% secure transactions",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaUndo className="text-3xl" />,
      title: "Easy Returns",
      description: "7 Days return policy",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FaHeadset className="text-3xl" />,
      title: "24/7 Support",
      description: "Dedicated customer service",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <Box
        className="relative py-8 md:py-10 overflow-hidden"
        sx={{
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        }}
      >
        <Container maxWidth="xl" className="relative z-10">
          <Box className="text-center">
            {displayName && (
              <Box className="mb-2">
                <Typography
                  variant="caption"
                  className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
                  sx={{
                    fontSize: { xs: "0.75rem", md: "0.8rem" },
                  }}
                >
                  👋 Welcome back, {displayName}
                </Typography>
              </Box>
            )}

            <Typography
              variant="h1"
              className="font-bold mb-2"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "2rem", md: "2.8rem", lg: "3.2rem" },
                fontWeight: 700,
                color: "#1e40af",
                letterSpacing: "-0.02em",
              }}
            >
              eShop
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: "#64748b",
                mb: 3,
                fontWeight: 400,
              }}
            >
              Your Premium Electronics Destination
            </Typography>

            {/* Quick Stats */}
            <Box className="flex justify-center items-center gap-6 mt-4">
              {[
                { number: "500+", label: "Products" },
                { number: "10K+", label: "Customers" },
                { number: "4.8★", label: "Rating" },
              ].map((stat, index) => (
                <Box key={index} className="text-center">
                  <Typography
                    variant="h6"
                    className="font-bold text-blue-600"
                    sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-gray-500"
                    sx={{ fontSize: { xs: "0.7rem", md: "0.75rem" } }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" className="py-16">
        {/* Categories Section */}
        <Box className="mb-20">
          <Box className="text-center mb-12">
            <Typography
              variant="h3"
              className="font-bold mb-3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "2rem", md: "3rem" },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Shop by Category
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-lg">
              Explore our curated collection of premium electronics
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {loadingCategories ? (
              <Box className="col-span-full flex justify-center py-8">
                <CircularProgress />
              </Box>
            ) : (
              categories.map((category) => (
                <Box key={category.id} className="flex justify-center">
                  <Card
                    className="cursor-pointer group"
                    onClick={() => handleCategoryClick(category.categoryName)}
                    sx={{
                      width: 200,
                      height: 200,
                      borderRadius: "50%",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      className="w-full h-full text-white flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 transition-transform duration-500 group-hover:scale-110"
                      sx={{
                        backgroundImage: category.imageUrl
                          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${buildImageUrl(
                              category.imageUrl
                            )})`
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        className="font-bold mb-1 px-4 text-center"
                      >
                        {category.categoryName}
                      </Typography>
                      <Typography variant="caption" className="text-white/90">
                        {category.productCount || 0} Products
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Features Section */}
        <Box className="mb-20">
          <Box className="text-center mb-12">
            <Typography
              variant="h3"
              className="font-bold mb-3"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "2rem", md: "3rem" },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Us
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-lg">
              Experience shopping with confidence and convenience
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Box key={index}>
                <Card className="modern-card h-full text-center p-6">
                  <CardContent>
                    <Box
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      className="font-bold mb-2 text-gray-900"
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Section */}
        <Box
          className="rounded-3xl p-12 text-center text-white relative overflow-hidden"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Box className="absolute inset-0 opacity-10">
            <Box className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <Box className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </Box>

          <Box className="relative z-10">
            <Typography
              variant="h4"
              className="font-bold mb-4"
              sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
            >
              Start Your Shopping Journey Today
            </Typography>
            <Typography
              variant="body1"
              className="mb-6 text-white/90 text-lg max-w-2xl mx-auto"
            >
              Browse our extensive collection of electronics and enjoy exclusive
              deals
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<MdFlashOn />}
              onClick={() => navigate("/products")}
              sx={{
                backgroundColor: "#ffffff",
                color: "#667eea",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "1.1rem",
                px: 5,
                py: 2,
                borderRadius: "14px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Explore Products
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
