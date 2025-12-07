package com.ecommerce.service;

import com.ecommerce.request.CategoryRequest;
import com.ecommerce.response.CategoryHomeResponse;
import com.ecommerce.response.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request, MultipartFile image);
    CategoryResponse updateCategory(Long id, CategoryRequest request, MultipartFile image);
    void deleteCategory(Long id);
    List<CategoryResponse> getAllCategories();
    CategoryResponse getCategoryById(Long id) throws Exception;
    List<CategoryHomeResponse> getAllCategoriesForHome();

}
