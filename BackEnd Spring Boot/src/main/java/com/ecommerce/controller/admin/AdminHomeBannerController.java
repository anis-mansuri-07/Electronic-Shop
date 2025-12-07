package com.ecommerce.controller.admin;

import com.ecommerce.repo.ProductRepository;
import com.ecommerce.response.ProductHomeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/home-banners")
@RequiredArgsConstructor
@CrossOrigin
public class AdminHomeBannerController {

    private final ProductRepository productRepository;
    @GetMapping("/products")
    public List<ProductHomeResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(p -> new ProductHomeResponse(p.getId(), p.getTitle()))
                .collect(Collectors.toList());
    }

}
