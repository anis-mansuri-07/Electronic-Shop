package com.ecommerce.service;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;

public interface CartService {

    CartItem addCartItem
            (
                    User user,
                    Product product,
                    int quantity
            );

    Cart findUserCart(User user);
    void clearCart(User user);
}
