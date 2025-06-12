package com.skinai.controller;

import com.skinai.model.Review;
import com.skinai.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@PathVariable String productId, @RequestBody Review review) {
        review.setProductId(productId);
        return ResponseEntity.ok(reviewService.addReview(review));
    }
} 