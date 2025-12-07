package com.ecommerce.service.impl;

import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.repo.CartItemRepository;
import com.ecommerce.repo.CategoryRepository;
import com.ecommerce.repo.WishListProductRepository;
import com.ecommerce.request.CategoryRequest;
import com.ecommerce.response.CategoryHomeResponse;
import com.ecommerce.response.CategoryResponse;
import com.ecommerce.service.CategoryService;
import com.ecommerce.util.ImageStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ImageStorageService imageStorageService;
    private final CartItemRepository cartItemRepository;
    private final WishListProductRepository wishListProductRepository;

    @Override
    public CategoryResponse createCategory(CategoryRequest request, MultipartFile image) {
        Category category = new Category();
        if (categoryRepository.findByCategoryName(request.getCategoryName()) != null) {
            throw new IllegalArgumentException("Category with name " + request.getCategoryName() + " already exists.");
        }
        category.setCategoryName(request.getCategoryName());

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.saveCategoryImage(image);
            category.setImageUrl(imageUrl);
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request, MultipartFile image) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        if (request.getCategoryName() != null) {
            category.setCategoryName(request.getCategoryName());
        }

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.saveCategoryImage(image);
            category.setImageUrl(imageUrl);
        }

        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        for (Product product : category.getProducts()) {
            // Delete product from cart
            cartItemRepository.deleteByProductId(product.getId());

            // Delete product from wishlist
            wishListProductRepository.deleteByProductId(product.getId());
        }


        // Delete category
        categoryRepository.delete(category);
    }


    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new Exception("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    public List<CategoryHomeResponse> getAllCategoriesForHome() {
        return categoryRepository.findAll().stream()
                .map(cat -> CategoryHomeResponse.builder()
                        .id(cat.getId())
                        .categoryName(cat.getCategoryName())
                        .imageUrl(cat.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .categoryName(category.getCategoryName())
                .imageUrl(category.getImageUrl())
                .productCount(category.getProducts() != null ? category.getProducts().size() : 0)
                .build();
    }
}
