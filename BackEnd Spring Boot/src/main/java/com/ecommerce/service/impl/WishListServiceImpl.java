package com.ecommerce.service.impl;


import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.WishList;
import com.ecommerce.repo.WishListRepository;
import com.ecommerce.service.WishListService;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class WishListServiceImpl implements WishListService {
    private final WishListRepository wishListRepository;
    @Override
    public WishList createWishList(User user) {
        WishList wishList = new WishList();
        wishList.setUser(user);

        return wishListRepository.save(wishList);
    }

    @Override
    public WishList getWishListByUserId(User user) {
        WishList wishList = wishListRepository.findByUserId(user.getId());
        if(wishList == null) wishList = createWishList(user);
        return wishList;
    }

    @Override
    public WishList addProductToWishList(User user, Product product) {
        WishList wishList = getWishListByUserId(user);
        if(wishList.getProducts().contains(product)) {
            wishList.getProducts().remove(product);
        } else {
            wishList.getProducts().add(product);
        }
        return wishListRepository.save(wishList);
    }

    @Override
    public WishList removeProductFromWishList(User user, Long productId) throws Exception{
        // Get the user's wishlist
        WishList wishList = getWishListByUserId(user);

        if (wishList == null) {
            throw new Exception("Wishlist not found for user: " + user.getEmail());
        }

        boolean removed = wishList.getProducts().removeIf(p -> p.getId().equals(productId));

        if (!removed) {
            throw new Exception("Product with ID " + productId + " not found in wishlist.");
        }


        return wishListRepository.save(wishList);
    }

}
