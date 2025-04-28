// src/components/LearningPlans.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const navigate = useNavigate();

  // Fetch learning plans from the API
  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/learningplans");
        const data = await response.json();
        // console.log("API Response:", data); // Log the API response to inspect its structure
        setLearningPlans(data);
      } catch (error) {
        console.error("Error fetching learning plans:", error);
      }
    };

    fetchLearningPlans();
  }, []);

  const handlePlanClick = (plan) => {
    if (!plan) {
      console.error("Plan is undefined.");
      return;
    }
    if (!plan.id) {
      // Check for `id` instead of `_id`
      console.error("Plan doesn't have an id:", plan);
      return;
    }
    navigate(`/learning-plan/${plan.id}`); // Navigate using `plan.id`
  };

  const handleCreateNewPlan = () => {
    navigate("/create-learning-plan");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F97316]">
                Your Culinary Journey
              </h2>
              <p className="text-gray-600 mt-2">
                Master cooking techniques and expand your culinary skills
              </p>
            </div>
          </div>

          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Culinary Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-600">Active Courses</p>
                <p className="text-2xl font-bold text-amber-800">5</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Recipes Mastered</p>
                <p className="text-2xl font-bold text-green-800">28</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Hours This Week</p>
                <p className="text-2xl font-bold text-red-800">9.5</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Cuisines Explored</p>
                <p className="text-2xl font-bold text-orange-800">7</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPlans.map((plan) => (
              <div
                key={plan.id} // Use _id instead of id
                onClick={() => handlePlanClick(plan)} // Pass the whole plan object here
                className="cursor-pointer group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden hover:scale-[1.02]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <span className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
                    {plan.category || "General"}
                  </span>
                  <h3 className="absolute bottom-3 left-3 text-xl font-bold text-white">
                    {plan.title}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 mb-4 line-clamp-2">{plan.goal}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{plan.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          plan.progress < 30
                            ? "bg-red-400"
                            : plan.progress < 70
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${plan.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Skills you'll learn:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {plan.skills
                        .split(", ")
                        .slice(0, 3)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      {plan.skills.split(", ").length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          +{plan.skills.split(", ").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">
                      {plan.duration || "Unknown"}
                    </span>
                    <button
                      className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanClick(plan); // Pass the whole plan object here
                      }}
                    >
                      Continue
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty state for creating new plan */}
            <div
              onClick={handleCreateNewPlan}
              className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                Start New Culinary Adventure
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Create a personalized cooking plan to expand your kitchen skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPlans;