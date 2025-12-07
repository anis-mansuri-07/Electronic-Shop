package com.ecommerce.service.impl;

import com.ecommerce.entity.Product;
import lombok.AllArgsConstructor;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.User;
import com.ecommerce.repo.CartItemRepository;
import com.ecommerce.repo.CartRepository;
import com.ecommerce.service.CartService;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartItem addCartItem(User user, Product product, int quantity) {
        Cart cart = findUserCart(user);
        CartItem isPresent = cartItemRepository.findByCartAndProduct(cart, product);
        CartItem cartItem;

        if (isPresent == null) {
            cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            // Store unit prices, not line totals
            cartItem.setMrpPrice(product.getMrpPrice());
            cartItem.setSellingPrice(product.getSellingPrice());
            cartItem.setCart(cart);
            cart.getCartItems().add(cartItem);
            cartItemRepository.save(cartItem);
        } else {
            // Just update quantity, keep unit prices unchanged
            isPresent.setQuantity(isPresent.getQuantity() + quantity);
            cartItem = isPresent;
            cartItemRepository.save(isPresent);
        }

        recalculateCart(cart);
        return cartItem;
    }


    @Override
    public Cart findUserCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        // Create new cart if not exists
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cart.setTotalItem(0);
            cart.setTotalMrpPrice(0);
            cart.setTotalSellingPrice(0);
            cart.setDiscount(0);
            cartRepository.save(cart);
            return cart;
        }


        return cart;
    }

    public void recalculateCart(Cart cart) {
        int totalItems = 0;
        int totalMrp = 0;
        int totalSelling = 0;

        for (CartItem ci : cart.getCartItems()) {
            totalItems += ci.getQuantity();
            totalMrp += ci.getQuantity() * ci.getMrpPrice();
            totalSelling += ci.getQuantity() * ci.getSellingPrice();
        }

        cart.setTotalItem(totalItems);
        cart.setTotalMrpPrice(totalMrp);
        cart.setTotalSellingPrice(totalSelling);
        cart.setDiscount(calculateDiscountPercentage(totalMrp, totalSelling));

        cartRepository.save(cart);
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            return 0;
        }
        return (int) (((double) (mrpPrice - sellingPrice) / mrpPrice) * 100);
    }

    // Clear Cart Method
    @Override
    public void clearCart(User user) {
        Cart cart = cartRepository.findByUserId(user.getId());

        if (cart != null && !cart.getCartItems().isEmpty()) {
            // delete all cart items associated with the cart
            cartItemRepository.deleteAll(cart.getCartItems());
            cart.getCartItems().clear();

            // reset totals
            cart.setTotalItem(0);
            cart.setTotalMrpPrice(0);
            cart.setTotalSellingPrice(0);
            cart.setDiscount(0);

            cartRepository.save(cart);
        }
    }
}
