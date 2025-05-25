package com.skinai.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String imageUrl;
    private String skinType; // Karma, Kuru, Yağlı, Hassas
    private String productType; // Temizleyici, Nemlendirici, Serum, Güneş Kremi
    private String brand;
    private String ingredients;
    private String usageInstructions;
    private boolean isActive;
} 