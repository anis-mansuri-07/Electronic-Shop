package com.ecommerce.repo;

import com.ecommerce.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<WishList,Long> {
    WishList findByUserId(long userId);
}

