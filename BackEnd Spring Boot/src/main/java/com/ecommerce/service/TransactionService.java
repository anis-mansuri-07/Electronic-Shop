package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Transaction;

import java.util.List;

public interface TransactionService {

    void createTransaction(Order order, String paymentId, String paymentLinkId);


    List<Transaction> getAllTransaction();
}
