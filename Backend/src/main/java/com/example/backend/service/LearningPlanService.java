package com.example.backend.service;


import com.example.backend.model.LearningPlan;
import com.example.backend.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    public LearningPlan createLearningPlan(LearningPlan learningPlan) {
        return repository.save(learningPlan);
    }

    public List<LearningPlan> getAllLearningPlans() {
        return repository.findAll();
    }

    public Optional<LearningPlan> getLearningPlanById(String id) {
        return repository.findById(id);
    }

    // ✨ ADD THIS: Delete Learning Plan by ID
    public boolean deleteLearningPlan(String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Method to update a learning plan
    public LearningPlan updateLearningPlan(String id, LearningPlan updatedPlan) {
        // Use Optional's isPresent() method to check if the plan exists
        Optional<LearningPlan> existingPlanOptional = getLearningPlanById(id);

        if (existingPlanOptional.isPresent()) {
            LearningPlan existingPlan = existingPlanOptional.get(); // Get the existing plan

            // Update the fields
            existingPlan.setTitle(updatedPlan.getTitle());
            existingPlan.setGoal(updatedPlan.getGoal());
            existingPlan.setSkills(updatedPlan.getSkills());
            existingPlan.setImage(updatedPlan.getImage());
            existingPlan.setSteps(updatedPlan.getSteps());

            // Save the updated plan
            return repository.save(existingPlan);
        } else {
            return null; // Plan not found
        }
    }
}
