package com.skinai.controller;

import com.skinai.model.Favorite;
import com.skinai.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {
    @Autowired
    private FavoriteRepository favoriteRepository;

    @GetMapping
    public ResponseEntity<?> getFavorites(@RequestParam String email) {
        Favorite fav = favoriteRepository.findByUserEmail(email);
        return ResponseEntity.ok(fav != null ? fav.getProductIds() : List.of());
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestParam String email, @RequestBody String productId) {
        Favorite fav = favoriteRepository.findByUserEmail(email);
        if (fav == null) {
            fav = new Favorite();
            fav.setUserEmail(email);
            fav.setProductIds(new ArrayList<>());
        }
        if (!fav.getProductIds().contains(productId)) {
            fav.getProductIds().add(productId);
        }
        favoriteRepository.save(fav);
        return ResponseEntity.ok(fav.getProductIds());
    }

    @DeleteMapping
    public ResponseEntity<?> removeFavorite(@RequestParam String email, @RequestBody String productId) {
        Favorite fav = favoriteRepository.findByUserEmail(email);
        if (fav != null && fav.getProductIds().contains(productId)) {
            fav.getProductIds().remove(productId);
            favoriteRepository.save(fav);
        }
        return ResponseEntity.ok(fav != null ? fav.getProductIds() : List.of());
    }
} 