package com.skinai.service;

import com.skinai.model.Product;
import com.skinai.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productDetails) {
        Product product = getProductById(id);
        
        if (productDetails.getName() != null) product.setName(productDetails.getName());
        if (productDetails.getDescription() != null) product.setDescription(productDetails.getDescription());
        if (productDetails.getType() != null) product.setType(productDetails.getType());
        if (productDetails.getImage() != null) product.setImage(productDetails.getImage());
        if (productDetails.getUsage() != null) product.setUsage(productDetails.getUsage());
        product.setRating(productDetails.getRating());
        product.setReviewCount(productDetails.getReviewCount());
        if (productDetails.getBadge() != null) product.setBadge(productDetails.getBadge());
        
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
} 