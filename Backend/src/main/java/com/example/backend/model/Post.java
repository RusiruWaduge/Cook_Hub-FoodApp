package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;
    private String title;
    private String content;
    private String image;
    private boolean isPublic;
    private String userEmail;

    public Post() {}

    public Post(String title, String content, String image, boolean isPublic, String userEmail) {
        this.title = title;
        this.content = content;
        this.image = image;
        this.isPublic = isPublic;
        this.userEmail = userEmail;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public boolean getIsPublic() { return isPublic; }
    public void setIsPublic(boolean isPublic) { this.isPublic = isPublic; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
