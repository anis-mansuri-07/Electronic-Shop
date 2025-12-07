import api from "./api";

export interface PaymentVerificationResponse {
  message: string;
}

const paymentService = {
  verifyPayment: async (
    paymentId: string,
    paymentLinkId: string
  ): Promise<PaymentVerificationResponse> => {
    const response = await api.get(`/payment/${paymentId}`, {
      params: { paymentLinkId },
    });
    return response.data;
  },
};

export default paymentService;
