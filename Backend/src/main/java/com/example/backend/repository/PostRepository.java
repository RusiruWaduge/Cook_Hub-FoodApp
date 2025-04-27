package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.Post;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserEmail(String userEmail);  // Find posts by user's email

    // Add this line to get only public posts
    List<Post> findByIsPublicTrue();
}