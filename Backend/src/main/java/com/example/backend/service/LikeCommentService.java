package com.example.backend.service;

import com.example.backend.model.LikeComment;
import com.example.backend.repository.LikeCommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class LikeCommentService {

    @Autowired
    private LikeCommentRepository likeCommentRepository;

    public void toggleLike(String postId, String userId, String username) {
        LikeComment existingLike = likeCommentRepository
                .findTopByPostIdAndUserIdAndLiked(postId, userId, true);

        if (existingLike == null) {
            LikeComment newLike = new LikeComment();
            newLike.setPostId(postId);
            newLike.setUserId(userId);
            newLike.setUsername(username);
            newLike.setLiked(true);
            likeCommentRepository.save(newLike);
        } else {
            likeCommentRepository.delete(existingLike);
        }
    }

    public void addComment(String postId, String username, String commentContent) {
        LikeComment comment = new LikeComment();
        comment.setPostId(postId);
        comment.setUsername(username);
        comment.setComment(commentContent);
        comment.setLiked(false);
        likeCommentRepository.save(comment);
    }

    public int getLikeCount(String postId) {
        return likeCommentRepository.countByPostIdAndLiked(postId, true);
    }

    public List<LikeComment> getComments(String postId) {
        return likeCommentRepository.findByPostIdAndCommentIsNotNull(postId);
    }

    public Map<String, Boolean> getUserLikeStatus(String postId, String userId) {
        Map<String, Boolean> response = new HashMap<>();
        response.put("liked", likeCommentRepository.existsByPostIdAndUserIdAndLiked(postId, userId, true));
        return response;
    }

    public void updateComment(String id, String username, String newContent) {
        LikeComment comment = likeCommentRepository.findById(id).orElse(null);
        if (comment != null && comment.getUsername().equals(username) && comment.getComment() != null) {
            comment.setComment(newContent);
            likeCommentRepository.save(comment);
        } else {
            throw new RuntimeException("Comment not found or you are not authorized to update it.");
        }
    }
    
    public void deleteComment(String id, String username) {
        LikeComment comment = likeCommentRepository.findById(id).orElse(null);
        if (comment != null && comment.getUsername().equals(username) && comment.getComment() != null) {
            likeCommentRepository.deleteById(id);
        } else {
            throw new RuntimeException("Comment not found or you are not authorized to delete it.");
        }
    }
    
}