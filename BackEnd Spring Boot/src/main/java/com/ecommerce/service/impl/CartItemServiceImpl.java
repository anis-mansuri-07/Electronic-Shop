package com.ecommerce.service.impl;


import com.ecommerce.entity.Cart;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.User;
import com.ecommerce.repo.CartItemRepository;
import com.ecommerce.service.CartItemService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartItemServiceImpl implements CartItemService {
    private  final CartItemRepository cartItemRepository;
private final CartServiceImpl cartService;
    @Override
    public CartItem updateCartItem(Long userId, Long cartItemId, CartItem cartItemRequest) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));

        User cartItemUser = item.getCart().getUser();
        if (!cartItemUser.getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to update this cart item.");
        }

        if (cartItemRequest.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero.");
        }

        item.setQuantity(cartItemRequest.getQuantity());


        CartItem savedItem = cartItemRepository.save(item);

        Cart cart = item.getCart();
        cartService.recalculateCart(cart);

        return savedItem;
    }


    @Override
    public void removeCartItem(Long userId, Long cartItemId) {

        // Find the cart item by id
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + cartItemId));

        // Verify that the cart item belongs to the correct user
        User cartItemUser = item.getCart().getUser();
        if (!cartItemUser.getId().equals(userId)) {
            throw new AccessDeniedException("You are not authorized to delete this cart item.");
        }
        cartItemRepository.delete(item);

        Cart cart = item.getCart();
        cart.getCartItems().remove(item);

        cartService.recalculateCart(cart);

    }

    @Override
    public CartItem findCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("CartItem not found with id: " + id));
    }
}
