package com.example.backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    // Custom query method to find a user by email
    Optional<User> findByEmail(String email);

    // Custom query method to check if a user exists by email
    boolean existsByEmail(String email);
}