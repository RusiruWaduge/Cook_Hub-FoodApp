import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/learningplans");
        const data = await response.json();
        setLearningPlans(data);
      } catch (error) {
        console.error("Error fetching learning plans:", error);
        toast.error("Failed to load learning plans. Please try again later.");
      }
    };

    fetchLearningPlans();
  }, []);

  const handlePlanClick = (plan) => {
    if (!plan) {
      toast.error("Something went wrong. Plan not found.");
      return;
    }
    if (!plan.id) {
      toast.error("Invalid plan data. Missing ID.");
      return;
    }
    navigate(`/learning-plan/${plan.id}`);
  };

  const handleDeletePlan = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this learning plan?")
    ) {
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/learningplans/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 204) {
        setLearningPlans(learningPlans.filter((plan) => plan.id !== id));
        toast.success("Learning plan deleted successfully.");
      } else {
        toast.error("Failed to delete the learning plan. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting learning plan:", error);
      toast.error("An error occurred while deleting. Please try again.");
    }
  };

  const handleCreateNewPlan = () => {
    navigate("/create-learning-plan");
  };

  const handleEditPlan = (id) => {
    navigate(`/edit-learning-plan/${id}`);
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                key={plan.id}
                onClick={() => handlePlanClick(plan)}
                className="cursor-pointer group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden hover:scale-[1.02] border border-gray-100"
              >
                {/* Image with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={plan.image || "/placeholder-culinary.jpg"}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "/placeholder-culinary.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <span className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                    {plan.category || "Culinary"}
                  </span>
                  <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-md">
                    {plan.title}
                  </h3>
                </div>

                {/* Card content */}
                <div className="p-5">
                  {/* Goal description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                    {plan.goal || "No description available"}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Your progress</span>
                      <span className="font-medium">
                        {plan.progress || 0}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          plan.progress < 30
                            ? "bg-red-400"
                            : plan.progress < 70
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                        } transition-all duration-300`}
                        style={{ width: `${plan.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills chips */}
                  <div className="mb-5">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Skills you'll master:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {plan.skills ? (
                        plan.skills
                          .split(", ")
                          .slice(0, 3)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100"
                            >
                              {skill.trim()}
                            </span>
                          ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          No skills specified
                        </span>
                      )}
                      {plan.skills?.split(", ").length > 3 && (
                        <span className="text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100">
                          +{plan.skills.split(", ").length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {plan.duration || "Flexible"}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="text-sm text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlanClick(plan);
                        }}
                      >
                        Continue
                      </button>
                      <button
                        className="text-sm text-gray-600 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlan(plan.id);
                        }}
                        aria-label="Edit plan"
                      >
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-sm text-gray-600 hover:text-red-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        aria-label="Delete plan"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Create new plan card */}
            <div
              onClick={handleCreateNewPlan}
              className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 hover:border-orange-300 hover:bg-orange-50/50 transition-all group"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-500 group-hover:text-orange-600"
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
              <h3 className="text-lg font-semibold text-gray-700 mb-1.5 group-hover:text-gray-900">
                Start New Culinary Journey
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-[200px] group-hover:text-gray-600">
                Craft your personalized cooking roadmap to culinary mastery
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearningPlans;