package com.ecommerce.service.impl;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Transaction;
import com.ecommerce.repo.TransactionRepository;
import com.ecommerce.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;

    @Override
    public void createTransaction(Order order, String paymentId, String paymentLinkId){
        Transaction transaction = new Transaction();
        transaction.setOrder(order);
        transaction.setAmount(order.getTotalSellingPrice());
        transaction.setStatus("SUCCESS"); // initial status before payment success
        transaction.setPaymentMethod(order.getPaymentOrder().getPaymentMethod()); // if you store payment method in Order
//        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setPaymentId(paymentId);
        transaction.setPaymentLinkId(paymentLinkId);

        transactionRepository.save(transaction);
    }

    @Override
    public List<Transaction> getAllTransaction() {
        return transactionRepository.findAll();
    }
}
