package com.ecommerce.service;

import com.ecommerce.entity.CartItem;

public interface CartItemService {
    CartItem updateCartItem(Long userId, Long cartItemId, CartItem cartItem);
    void removeCartItem(Long userId, Long cartItemId);
    CartItem findCartItemById(Long id);
}
