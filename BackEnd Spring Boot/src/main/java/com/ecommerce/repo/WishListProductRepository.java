package com.ecommerce.repo;

import com.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface WishListProductRepository extends JpaRepository<Product, Long> {

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM wish_list_products WHERE products_id = :productId", nativeQuery = true)
    void deleteByProductId(Long productId);
}
