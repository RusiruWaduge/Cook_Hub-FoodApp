package com.example.backend.service;


import com.example.backend.model.FoodCommunity;
import com.example.backend.repository.FoodCommunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FoodCommunityService {

    @Autowired
    private FoodCommunityRepository foodCommunityRepository;

    public FoodCommunity createCommunity(FoodCommunity community) {
        return foodCommunityRepository.save(community);
    }

    public List<FoodCommunity> getAllCommunities() {
        return foodCommunityRepository.findAll();
    }

    public Optional<FoodCommunity> getCommunityById(String id) {
        return foodCommunityRepository.findById(id);
    }

    public FoodCommunity joinCommunity(String id, String userName) {
        Optional<FoodCommunity> optionalCommunity = foodCommunityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            FoodCommunity community = optionalCommunity.get();
            if (!community.getMembers().contains(userName)) {
                community.getMembers().add(userName);
                return foodCommunityRepository.save(community);
            }
            return community;
        }
        return null;
    }

    public FoodCommunity leaveCommunity(String id, String userName) {
        Optional<FoodCommunity> optionalCommunity = foodCommunityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            FoodCommunity community = optionalCommunity.get();
            if (community.getMembers().contains(userName)) {
                community.getMembers().remove(userName);
                return foodCommunityRepository.save(community);
            }
        }
        return null;
    }

    public FoodCommunity updateCommunity(String id, FoodCommunity updated) {
        Optional<FoodCommunity> optionalCommunity = foodCommunityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            FoodCommunity community = optionalCommunity.get();
            community.setName(updated.getName());
            community.setDescription(updated.getDescription());
            return foodCommunityRepository.save(community);
        }
        return null;
    }

    public boolean deleteCommunity(String id) {
        Optional<FoodCommunity> optionalCommunity = foodCommunityRepository.findById(id);
        if (optionalCommunity.isPresent()) {
            FoodCommunity community = optionalCommunity.get();
            community.cleanUpMembers();
            foodCommunityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}