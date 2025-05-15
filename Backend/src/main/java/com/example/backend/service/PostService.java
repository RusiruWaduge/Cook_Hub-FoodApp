package com.example.backend.service;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PostDTO;
import com.example.backend.exception.PostNotFoundException;
import com.example.backend.model.Post;
import com.example.backend.model.User;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Get posts by email
    public List<PostDTO> getPostsByUserEmail(String email) {
        List<Post> posts = postRepository.findByUserEmail(email);

        return posts.stream().map(post -> {
            User user = userRepository.findByEmail(post.getUserEmail()).orElse(null);
            String username = (user != null) ? user.getUsername() : "Unknown";

            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setUserEmail(post.getUserEmail());
            postDTO.setTitle(post.getTitle());
            postDTO.setContent(post.getContent());
            postDTO.setImage(post.getImage());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

    // Get only public posts
    public List<PostDTO> getPublicPosts() {
        List<Post> posts = postRepository.findByIsPublicTrue();

        return posts.stream().map(post -> {
            User user = userRepository.findByEmail(post.getUserEmail()).orElse(null);
            String username = (user != null) ? user.getUsername() : "Unknown";

            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setUserEmail(post.getUserEmail());
            postDTO.setTitle(post.getTitle());
            postDTO.setContent(post.getContent());
            postDTO.setImage(post.getImage());
            postDTO.setIsPublic(post.getIsPublic());
            postDTO.setUsername(username);
            return postDTO;
        }).collect(Collectors.toList());
    }

    // Create a post for the logged-in user
    public Post createPost(PostDTO dto) {
        if (dto.getUserEmail() == null || dto.getUserEmail().isEmpty()) {
            throw new IllegalArgumentException("User email is required to create a post.");
        }

        Post post = new Post();
        post.setUserEmail(dto.getUserEmail());
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setImage(dto.getImage());
        post.setIsPublic(dto.getIsPublic()); 


        return postRepository.save(post);
    }



    public Post updateVisibility(String postId, boolean isPublic) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String loggedInUserEmail = authentication.getName();

            if (!post.getUserEmail().equals(loggedInUserEmail)) {
                throw new AccessDeniedException("You do not have permission to update this post.");
            }

            post.setIsPublic(isPublic);
            return postRepository.save(post);
        } else {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }
    }

    // Update post details (title, content, image URL)
    public Post updatePost(String postId, PostDTO dto) {
        Optional<Post> existingPostOptional = postRepository.findById(postId);
        if (existingPostOptional.isPresent()) {
            Post existingPost = existingPostOptional.get();

            // Ensure the logged-in user is updating their own post
            String loggedInUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            if (!existingPost.getUserEmail().equals(loggedInUserEmail)) {
                throw new AccessDeniedException("You do not have permission to update this post.");
            }

            // Update post fields
            existingPost.setTitle(dto.getTitle());
            existingPost.setContent(dto.getContent());
            existingPost.setImage(dto.getImage());  // Update image if provided
            existingPost.setIsPublic(dto.getIsPublic()); 

            return postRepository.save(existingPost);
        } else {
            throw new PostNotFoundException("Post not found with id: " + postId);
        }
    }

    // Delete a post by ID
    public boolean deletePost(String postId, String userEmail) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();

            // Ensure the logged-in user is deleting their own post
            if (!post.getUserEmail().equals(userEmail)) {
                throw new AccessDeniedException("You do not have permission to delete this post.");
            }

            postRepository.delete(post); // Delete the post
            return true;
        } else {
            return false; // Post not found
        }
    }

}