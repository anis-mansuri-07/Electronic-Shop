import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import Navbar from "../components/Navbar";
import paymentService from "../services/paymentService";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get("payment_id");
  const paymentLinkId = searchParams.get("payment_link_id");
  const [message, setMessage] = useState<string>("Payment successful.");

  useEffect(() => {
    // Fire-and-forget verification if params exist; UI remains success regardless
    const verify = async () => {
      if (!paymentId || !paymentLinkId) return;
      try {
        const res = await paymentService.verifyPayment(
          paymentId,
          paymentLinkId
        );
        if (res?.message) setMessage(res.message);
      } catch (err) {
        // Silently ignore errors; UI continues to show success
        console.warn("Payment verification warning:", err);
      }
    };
    verify();
  }, [paymentId, paymentLinkId]);

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h5" gutterBottom>
          Payment Status
        </Typography>
        {message && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}
        <Stack spacing={2}>
          {orderId && (
            <Button
              variant="contained"
              onClick={() => navigate(`/orders/${orderId}`)}
              sx={{ textTransform: "none" }}
            >
              View Order Details
            </Button>
          )}
          <Button
            variant="text"
            onClick={() => navigate("/orders")}
            sx={{ textTransform: "none" }}
          >
            Back to Orders
          </Button>
          <Button
            variant="text"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none" }}
          >
            Back to Home
          </Button>
        </Stack>
        <Box mt={4}>
          <Typography variant="body2" color="text.secondary">
            If the payment shows as pending, please refresh after a few seconds
            or revisit from your order history.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default PaymentSuccess;
