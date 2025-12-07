package com.ecommerce.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.Cart;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.request.AddItemRequest;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.response.CartItemResponse;
import com.ecommerce.service.CartItemService;
import com.ecommerce.service.CartService;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final CartItemService cartItemService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Cart> getUserCart() throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);
        Cart cart = cartService.findUserCart(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartItemResponse> addItemToCart(
            @Valid @RequestBody AddItemRequest request) throws Exception {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        Product product = productService.findProductById(request.getProductId());

        CartItem item = cartService.addCartItem(user, product, request.getQuantity());

         return ResponseEntity.ok(new CartItemResponse(item));

    }



    @DeleteMapping("/item/{cartItemId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse> removeCartItem(@PathVariable Long cartItemId) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        cartItemService.removeCartItem(user.getId(), cartItemId);
        return ResponseEntity.ok(new ApiResponse("Item removed from cart successfully"));
    }

    @PutMapping("/item/{cartItemId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<CartItem> updateCartItem(@PathVariable Long cartItemId,
                                                   @RequestBody CartItem cartItem) throws Exception {
        if (cartItem.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        CartItem updatedCartItem = cartItemService.updateCartItem(user.getId(), cartItemId, cartItem);
        return ResponseEntity.ok(updatedCartItem);
    }

    //  Clear Cart
    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse> clearCart() throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        cartService.clearCart(user);
        return ResponseEntity.ok(new ApiResponse("Cart cleared successfully"));
    }
}
