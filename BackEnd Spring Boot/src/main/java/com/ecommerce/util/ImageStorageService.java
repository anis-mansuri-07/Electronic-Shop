//package com.ecommerce.util;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.*;
//import java.util.*;
//
//@Service
//public class ImageStorageService {
//
//    private static final String CATEGORY_UPLOAD_DIR = "src/main/resources/static/images/categories/";
//    private static final String PRODUCT_UPLOAD_DIR = "src/main/resources/static/images/products/";
//
//    public String saveCategoryImage(MultipartFile file) {
//        return saveFile(file, CATEGORY_UPLOAD_DIR, "/images/categories/");
//    }
//
//    public List<String> saveProductImages(List<MultipartFile> files) {
//        List<String> urls = new ArrayList<>();
//        for (MultipartFile f : files) {
//            urls.add(saveFile(f, PRODUCT_UPLOAD_DIR, "/images/products/"));
//        }
//        return urls;
//    }
//
//    private String saveFile(MultipartFile file, String folderPath, String urlPrefix) {
//        try {
//            Files.createDirectories(Paths.get(folderPath));
//            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//            Path destination = Paths.get(folderPath + fileName);
//            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
//            return urlPrefix + fileName; // e.g. /images/categories/uuid_logo.png
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
//        }
//    }
//}

package com.ecommerce.util;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Service
public class ImageStorageService {

    // Store outside classpath - in project root uploads folder
    private static final String UPLOAD_BASE_DIR = "uploads/images/";
    private static final String CATEGORY_UPLOAD_DIR = UPLOAD_BASE_DIR + "categories/";
    private static final String PRODUCT_UPLOAD_DIR = UPLOAD_BASE_DIR + "products/";

    public String saveCategoryImage(MultipartFile file) {
        return saveFile(file, CATEGORY_UPLOAD_DIR, "images/categories/");
    }

    public List<String> saveProductImages(List<MultipartFile> files) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile f : files) {
            urls.add(saveFile(f, PRODUCT_UPLOAD_DIR, "images/products/"));
        }
        return urls;
    }

    private String saveFile(MultipartFile file, String folderPath, String urlPrefix) {
        try {
            Files.createDirectories(Paths.get(folderPath));
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path destination = Paths.get(folderPath + fileName);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);
            return urlPrefix + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + file.getOriginalFilename(), e);
        }
    }
}
