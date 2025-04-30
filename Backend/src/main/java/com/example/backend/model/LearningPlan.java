package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Document(collection = "learning_plans")
public class LearningPlan {

    @Id
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String goal;

    @NotBlank
    private String skills;

    private String image;

    private List<Step> steps;

    // Constructors
    public LearningPlan() {}

    public LearningPlan(String id, String title, String goal, String skills, String image, List<Step> steps) {
        this.id = id;
        this.title = title;
        this.goal = goal;
        this.skills = skills;
        this.image = image;
        this.steps = steps;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    // Inner Step class
    public static class Step {
        private String topic;
        private String resources;
        private String timeline;

        // Constructors
        public Step() {}

        public Step(String topic, String resources, String timeline) {
            this.topic = topic;
            this.resources = resources;
            this.timeline = timeline;
        }

        // Getters and Setters
        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }

        public String getResources() {
            return resources;
        }

        public void setResources(String resources) {
            this.resources = resources;
        }

        public String getTimeline() {
            return timeline;
        }

        public void setTimeline(String timeline) {
            this.timeline = timeline;
        }
    }
}