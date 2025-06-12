package com.skinai.repository;

import com.skinai.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    Favorite findByUserEmail(String userEmail);
} 