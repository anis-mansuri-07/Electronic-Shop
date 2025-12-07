package com.ecommerce.controller;


import com.ecommerce.entity.PaymentOrder;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.response.PaymentLinkResponse;
import com.ecommerce.service.PaymentService;
import com.ecommerce.service.TransactionService;
import com.ecommerce.service.UserService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final TransactionService transactionService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse> paymentSuccess(@PathVariable("paymentId") String paymentId,
                                                      @RequestParam String paymentLinkId) throws RazorpayException {

        PaymentOrder paymentOrder = paymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);
        boolean paymentSuccess = paymentService.proceedPaymentOrder(
                paymentOrder,
                paymentId,
                paymentLinkId
        );

        ApiResponse apiResponse = new ApiResponse();

        if (paymentSuccess) {
            transactionService.createTransaction(paymentOrder.getOrder(), paymentId, paymentLinkId);
            apiResponse.setMessage("Payment successful");
            return ResponseEntity.ok(apiResponse);
        } else {
            apiResponse.setMessage("Payment failed or verification unsuccessful.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }

    }
}
