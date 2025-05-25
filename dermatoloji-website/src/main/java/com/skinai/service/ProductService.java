package com.skinai.service;

import com.skinai.model.Product;
import com.skinai.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }
    
    public List<Product> getProductsBySkinType(String skinType) {
        return productRepository.findBySkinType(skinType);
    }
    
    public List<Product> getProductsByProductType(String productType) {
        return productRepository.findByProductType(productType);
    }
    
    public List<Product> getProductsBySkinTypeAndProductType(String skinType, String productType) {
        return productRepository.findBySkinTypeAndProductType(skinType, productType);
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, Product product) {
        if (productRepository.existsById(id)) {
            product.setId(id);
            return productRepository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }
    
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
} 