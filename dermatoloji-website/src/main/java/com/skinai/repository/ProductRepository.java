package com.skinai.repository;

import com.skinai.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findBySkinType(String skinType);
    List<Product> findByProductType(String productType);
    List<Product> findBySkinTypeAndProductType(String skinType, String productType);
} 