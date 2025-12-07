import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import {
  MdLocalShipping,
  MdSecurity,
  MdSupport,
  MdStar,
  MdTrendingUp,
  MdVerifiedUser,
  MdLoop,
  MdThumbUp,
} from "react-icons/md";
import { FaAward, FaUsers, FaGlobe } from "react-icons/fa";
import Navbar from "../components/Navbar";

const About = () => {
  const features = [
    {
      icon: <MdLocalShipping className="text-5xl" />,
      title: "Fast Delivery",
      description: "Quick and reliable shipping to your doorstep",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MdSecurity className="text-5xl" />,
      title: "Secure Payment",
      description: "Your transactions are safe and encrypted",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MdSupport className="text-5xl" />,
      title: "24/7 Support",
      description: "Our team is always here to help you",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MdStar className="text-5xl" />,
      title: "Quality Products",
      description: "Only the best electronics from trusted brands",
      color: "from-orange-500 to-red-500",
    },
  ];

  const stats = [
    { icon: <FaUsers />, number: "10K+", label: "Happy Customers" },
    { icon: <FaAward />, number: "500+", label: "Products" },
    { icon: <FaGlobe />, number: "50+", label: "Cities Served" },
    { icon: <MdStar />, number: "4.8", label: "Average Rating" },
  ];

  const whyChoose = [
    {
      icon: <MdTrendingUp className="text-3xl" />,
      title: "Wide Selection",
      description:
        "Browse through thousands of products from top brands across various categories including smartphones, laptops, audio devices, and accessories.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MdVerifiedUser className="text-3xl" />,
      title: "Best Prices",
      description:
        "We offer competitive pricing with regular discounts and special offers to ensure you get the best value for your money.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <MdLoop className="text-3xl" />,
      title: "Easy Returns",
      description:
        "Not satisfied with your purchase? Our hassle-free return policy makes it easy to return or exchange products within 30 days.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MdThumbUp className="text-3xl" />,
      title: "Customer First",
      description:
        "Your satisfaction is our priority. We strive to provide exceptional customer service and support at every step of your shopping journey.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <Box className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <Box
        className="relative text-white py-20 overflow-hidden"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box className="absolute inset-0 opacity-10">
          <Box className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <Box className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        </Box>

        <Container maxWidth="lg" className="relative z-10">
          <Box className="text-center animate-fade-in">
            <Typography
              variant="h2"
              className="font-bold mb-4"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontWeight: 900,
                textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}
            >
              About eShop
            </Typography>
            <Typography
              variant="h5"
              className="max-w-3xl mx-auto text-white/95"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.4rem" },
                lineHeight: 1.6,
              }}
            >
              Your trusted destination for the latest electronics and technology
              products
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" className="py-16">
        {/* Stats Section */}
        <Box className="mb-20 -mt-16 relative z-10">
          <Box className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Box key={index}>
                <Card
                  className="modern-card text-center p-6"
                  sx={{
                    background: "white",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  }}
                >
                  <Box
                    className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl"
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography
                    variant="h4"
                    className="font-bold mb-1"
                    sx={{ color: "#667eea" }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 font-medium"
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Mission Section */}
        <Box className="mb-20">
          <Card
            className="modern-card overflow-hidden"
            sx={{
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
            }}
          >
            <CardContent className="p-10">
              <Typography
                variant="h4"
                className="font-bold mb-4 text-center"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Our Mission
              </Typography>
              <Typography
                variant="body1"
                className="text-gray-700 text-center max-w-3xl mx-auto text-lg"
                sx={{ lineHeight: 1.8 }}
              >
                At eShop, we are committed to providing our customers with the
                best shopping experience. We offer a wide range of high-quality
                electronics products at competitive prices, backed by excellent
                customer service and fast, reliable delivery. Our goal is to
                make cutting-edge technology accessible to everyone.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Features Grid */}
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
              Our Core Values
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Box key={index}>
                <Card className="modern-card h-full text-center p-6 hover:scale-105 transition-transform duration-300">
                  <Box
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    className="font-bold text-gray-900 mb-2"
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className="text-gray-600 leading-relaxed"
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Why Choose Us */}
        <Box>
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
              Why Choose eShop?
            </Typography>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whyChoose.map((item, index) => (
              <Box key={index}>
                <Card className="modern-card h-full p-6">
                  <Box className="flex items-start gap-4">
                    <Box
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-medium`}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        className="font-bold text-gray-900 mb-2"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-gray-600 leading-relaxed"
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
