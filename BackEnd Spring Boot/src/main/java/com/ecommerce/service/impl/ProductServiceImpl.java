package com.ecommerce.service.impl;

import com.ecommerce.repo.*;
import com.ecommerce.util.ImageStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.request.CreateProductRequest;
import com.ecommerce.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;



@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;
    private final CartItemRepository cartItemRepository;
    private final WishListRepository wishListRepository;
    private final WishListProductRepository wishListProductRepository;

    @Override
    public Product createProduct(CreateProductRequest req,List<MultipartFile> images) {

        Category category = categoryRepository.findByCategoryName(req.getCategory());
        if (category == null) {
            throw new EntityNotFoundException("Category  " + req.getCategory() + " not found");

        }

        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        Product product = new Product();

        // Save actual images and get URLs
        List<String> imageUrls = imageStorageService.saveProductImages(images);
        product.setImages(imageUrls); // Set saved image URLs to product
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());

        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());

        product.setColor(req.getColor());

        product.setCategory(category); // Category object fetched/created earlier
        product.setBrand(req.getBrand());

        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setDiscountPercent(discountPercentage);

        product.setQuantity(req.getQuantity());




        return productRepository.save(product);
    }

    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if (mrpPrice <= 0) {
            throw new IllegalArgumentException("MRP price must be greater than zero");
        }
        return (int) (((double) (mrpPrice - sellingPrice) / mrpPrice) * 100);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        // DELETE CART ITEMS FIRST
        cartItemRepository.deleteByProductId(id);

        wishListProductRepository.deleteByProductId(id);
        // NOW DELETE PRODUCT
        productRepository.delete(product);
    }



    @Override
    public Product updateProductStock(Long productId, int newStock) {
        Product existingProduct = findProductById(productId);

        if (newStock < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative.");
        }

        existingProduct.setQuantity(newStock);
        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }



    @Override
    public Product updateProduct(Long productId, CreateProductRequest req, List<MultipartFile> newImages) {
        Product existingProduct = findProductById(productId);

        // Validate category
        Category category = categoryRepository.findByCategoryName(req.getCategory());
        if (category == null) {
            throw new EntityNotFoundException("Category '" + req.getCategory() + "' not found");
        }

        // Recalculate discount
        int discountPercentage = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        // Update fields
        existingProduct.setTitle(req.getTitle());
        existingProduct.setDescription(req.getDescription());
        existingProduct.setMrpPrice(req.getMrpPrice());
        existingProduct.setSellingPrice(req.getSellingPrice());
        existingProduct.setDiscountPercent(discountPercentage);
        existingProduct.setQuantity(req.getQuantity());
        existingProduct.setColor(req.getColor());
        existingProduct.setBrand(req.getBrand());
        existingProduct.setCategory(category);

        //  Handle image update logic
        if (newImages != null && !newImages.isEmpty()) {
            // Save new images and replace existing URLs
            List<String> imageUrls = imageStorageService.saveProductImages(newImages);
            existingProduct.setImages(imageUrls);
        }

        existingProduct.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(existingProduct);
    }


    @Override
    public Product findProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + productId));
    }


    @Override
    public List<Product> searchProduct(String query) {
        return productRepository.searchProduct(query);
    }

    @Override
    public Page<Product> getAllProducts(String category, String brand, String colors, Integer minPrice, Integer maxPrice, Integer minDiscount, String sort, Integer quantity, Integer pageNumber) {

        Specification<Product> spec = (root, query, criteriaBuilder) ->{
            List<Predicate> predicates = new ArrayList<>();
            if(category != null){
                predicates.add(criteriaBuilder.equal(root.get("category").get("categoryName"), category));
            }
            if (brand != null && !brand.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("brand"), brand));
            }

            if(minPrice != null && maxPrice != null){
                predicates.add(criteriaBuilder.between(root.get("sellingPrice"), minPrice, maxPrice));
            } else if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sellingPrice"), minPrice));
            } else if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sellingPrice"), maxPrice));
            }
            if(minDiscount != null){
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("discountPercent"), minDiscount));
            } // Add more filters as needed
            if (colors!= null && !colors.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("color"), colors));
            }
            if(quantity != null){
                predicates.add(criteriaBuilder.equal(root.get("quantity"), quantity));
            }
//            Replace stock with quantity if you want to filter by available quantity
            return  criteriaBuilder.and(predicates.toArray(new Predicate[0]));

        };

        Pageable pageable;
        if(sort != null && !sort.isEmpty()){
            pageable = switch (sort) {
                case "price_low" -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10,
                        Sort.by("sellingPrice").ascending());
                case "price_high" -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10
                        , Sort.by("sellingPrice").descending());
                default -> PageRequest.of(pageNumber != null ? pageNumber : 0, 10
                        , Sort.unsorted());
            };
        }else {
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, Sort.unsorted());
        }


        return productRepository.findAll(spec, pageable);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}


