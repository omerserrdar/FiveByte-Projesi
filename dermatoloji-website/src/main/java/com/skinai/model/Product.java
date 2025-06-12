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
    private String type;
    private String image;
    private String usage;
    private double rating;
    private int reviewCount;
    private String badge;

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getType() { return type; }
    public String getImage() { return image; }
    public String getUsage() { return usage; }
    public double getRating() { return rating; }
    public int getReviewCount() { return reviewCount; }
    public String getBadge() { return badge; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setType(String type) { this.type = type; }
    public void setImage(String image) { this.image = image; }
    public void setUsage(String usage) { this.usage = usage; }
    public void setRating(double rating) { this.rating = rating; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public void setBadge(String badge) { this.badge = badge; }
} 