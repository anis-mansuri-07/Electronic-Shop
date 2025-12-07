import { Box, Container, Card, CardContent, Typography } from "@mui/material";
import { MdStore } from "react-icons/md";
import type { ReactNode } from "react";

interface AuthContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const AuthContainer = ({ title, subtitle, children }: AuthContainerProps) => {
  return (
    <Box
      className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden"
      sx={{
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <Box className="absolute inset-0 opacity-20">
        <Box className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <Box className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700" />
      </Box>

      <Container maxWidth="sm" className="relative z-10">
        {/* Logo/Brand */}
        <Box className="text-center mb-8 animate-fade-in">
          <Box
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <MdStore className="text-4xl" style={{ color: "#667eea" }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 800,
              color: "#ffffff",
              fontSize: { xs: "1.75rem", md: "2rem" },
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            eShop
          </Typography>
        </Box>

        <Card
          className="w-full rounded-3xl overflow-hidden relative shadow-2xl animate-scale-in"
          sx={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <CardContent className="p-8 md:p-10">
            <Typography
              variant="h4"
              component="h1"
              className="mb-3 font-bold text-center"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: { xs: "1.75rem", md: "2rem" },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="body1"
              className="mb-8 text-gray-600 text-center"
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <Box className="mt-6 text-center animate-fade-in">
          <Typography variant="body2" className="text-white/80 text-sm">
            © 2025 eShop. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthContainer;
