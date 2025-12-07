package com.ecommerce.controller;

import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.WishList;
import com.ecommerce.response.WishListResponse;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;
import com.ecommerce.service.WishListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishListController {

    private final WishListService wishListService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<WishListResponse> getUserWishList() throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        WishList wishList = wishListService.getWishListByUserId(user);
        return ResponseEntity.ok(new WishListResponse(wishList));
    }

    // Add a product to the wishlist of the authenticated user
    @PostMapping("/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<WishListResponse> addProductToWishList(@PathVariable Long productId) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        Product product = productService.findProductById(productId);
        WishList updatedWishList = wishListService.addProductToWishList(user, product);

        return ResponseEntity.status(HttpStatus.CREATED).body(new WishListResponse(updatedWishList));
    }

   //    Remove a product from wishlist
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<WishListResponse> removeProductFromWishList(@PathVariable Long productId) throws Exception {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email);

        WishList updatedWishList = wishListService.removeProductFromWishList(user, productId);
        return ResponseEntity.ok(new WishListResponse(updatedWishList));
    }
}




