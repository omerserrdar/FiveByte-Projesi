package com.skinai.controller;

import com.skinai.model.Product;
import com.skinai.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/skin-type/{skinType}")
    public ResponseEntity<List<Product>> getProductsBySkinType(@PathVariable String skinType) {
        return ResponseEntity.ok(productService.getProductsBySkinType(skinType));
    }

    @GetMapping("/product-type/{productType}")
    public ResponseEntity<List<Product>> getProductsByProductType(@PathVariable String productType) {
        return ResponseEntity.ok(productService.getProductsByProductType(productType));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Product>> getProductsBySkinTypeAndProductType(
            @RequestParam String skinType,
            @RequestParam String productType) {
        return ResponseEntity.ok(productService.getProductsBySkinTypeAndProductType(skinType, productType));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable String id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
} 