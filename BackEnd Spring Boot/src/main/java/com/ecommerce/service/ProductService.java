
package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.request.CreateProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Product createProduct(CreateProductRequest req,List<MultipartFile> images);
    void deleteProduct(Long productId);
    Product updateProductStock(Long productId, int newStock);
    Product updateProduct(Long productId,CreateProductRequest product,List<MultipartFile> newImages);
    Product findProductById(Long productId);
    List<Product> searchProduct(String query);
    Page<Product> getAllProducts(
            String category,
            String brand,
            String colors,
            Integer minPrice,
            Integer maxPrice,
            Integer minDiscount,
            String sort,
            // String stock
            Integer quantity,
            Integer pageNumber
    );


    List<Product> getAllProducts();
}

