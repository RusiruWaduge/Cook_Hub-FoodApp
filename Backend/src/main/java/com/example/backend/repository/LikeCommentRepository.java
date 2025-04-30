package com.example.backend.repository;

import com.example.backend.model.LikeComment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeCommentRepository extends MongoRepository<LikeComment, String> {
    LikeComment findTopByPostIdAndUserIdAndLiked(String postId, String userId, boolean liked);
    int countByPostIdAndLiked(String postId, boolean liked);
    List<LikeComment> findByPostIdAndCommentIsNotNull(String postId);
    boolean existsByPostIdAndUserIdAndLiked(String postId, String userId, boolean liked);
}