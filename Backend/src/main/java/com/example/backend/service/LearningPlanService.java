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
}