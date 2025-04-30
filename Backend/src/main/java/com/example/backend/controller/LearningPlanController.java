package com.example.backend.controller;

import com.example.backend.model.LearningPlan;
import com.example.backend.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/learningplans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    // Create a new Learning Plan
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@Valid @RequestBody LearningPlan learningPlan) {
        LearningPlan createdPlan = learningPlanService.createLearningPlan(learningPlan);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    // Get all Learning Plans
    @GetMapping
    public List<LearningPlan> getAllLearningPlans() {
        return learningPlanService.getAllLearningPlans();
    }

    // Get a Learning Plan by ID
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanService.getLearningPlanById(id);
        return plan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Delete a Learning Plan
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable String id) {
        if (learningPlanService.deleteLearningPlan(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


}