import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

const LearningPlans = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch learning plans from the API
  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/learningplans");
        const data = await response.json();
        setLearningPlans(data);
      } catch (error) {
        console.error("Error fetching learning plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  const filteredPlans = learningPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.category && plan.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePlanClick = (plan) => {
    if (!plan?.id) {
      console.error("Invalid plan:", plan);
      return;
    }
    navigate(`/learning-plan/${plan.id}`);
  };

  const handleCreateNewPlan = () => {
    navigate("/create-learning-plan");
  };

  const confirmDelete = (plan, e) => {
    e.stopPropagation();
    setPlanToDelete(plan);
    setShowDeleteModal(true);
  };

  const handleDeletePlan = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/learningplans/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setLearningPlans(learningPlans.filter(plan => plan.id !== id));
      } else {
        console.error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[#F97316]">
                Your Culinary Journey
              </h2>
              <p className="text-gray-600 mt-2">
                Master cooking techniques and expand your culinary skills
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search plans..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-orange-100 animate-slide-up">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Culinary Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200 hover:shadow-md transition-shadow">
                <p className="text-sm text-amber-600 font-medium">Active Courses</p>
                <p className="text-2xl font-bold text-amber-800 mt-1">{learningPlans.length}</p>
                <div className="h-1 w-full bg-amber-200 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500" 
                    style={{ width: `${Math.min(100, learningPlans.length * 20)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200 hover:shadow-md transition-shadow">
                <p className="text-sm text-green-600 font-medium">Recipes Mastered</p>
                <p className="text-2xl font-bold text-green-800 mt-1">
                  {learningPlans.reduce((sum, plan) => sum + (plan.recipesMastered || 0), 0)}
                </p>
                <div className="h-1 w-full bg-green-200 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${Math.min(100, learningPlans.reduce((sum, plan) => sum + (plan.recipesMastered || 0), 0) * 2)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200 hover:shadow-md transition-shadow">
                <p className="text-sm text-red-600 font-medium">Hours This Week</p>
                <p className="text-2xl font-bold text-red-800 mt-1">
                  {learningPlans.reduce((sum, plan) => sum + (plan.hoursThisWeek || 0), 0)}
                </p>
                <div className="h-1 w-full bg-red-200 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500" 
                    style={{ width: `${Math.min(100, learningPlans.reduce((sum, plan) => sum + (plan.hoursThisWeek || 0), 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 hover:shadow-md transition-shadow">
                <p className="text-sm text-blue-600 font-medium">Skills Learned</p>
                <p className="text-2xl font-bold text-blue-800 mt-1">
                  {learningPlans.reduce((sum, plan) => sum + (plan.skills?.split(", ").length || 0), 0)}
                </p>
                <div className="h-1 w-full bg-blue-200 mt-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${Math.min(100, learningPlans.reduce((sum, plan) => sum + (plan.skills?.split(", ").length || 0), 0) * 5)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Plans Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded-full w-full mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanClick(plan)}
                  className="cursor-pointer group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden hover:scale-[1.02] border border-gray-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={plan.image || "/default-culinary.jpg"}
                      alt={plan.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="absolute top-3 right-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                      {plan.category || "General"}
                    </span>
                    <h3 className="absolute bottom-3 left-3 text-xl font-bold text-white group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
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
                            (plan.progress || 0) < 30
                              ? "bg-red-400"
                              : (plan.progress || 0) < 70
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          } transition-all duration-500`}
                          style={{ width: `${plan.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Skills you'll learn:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {plan.skills?.split(", ").slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full hover:bg-amber-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {plan.skills?.split(", ").length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                            +{plan.skills.split(", ").length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        {plan.duration || "Flexible"}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1 hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlanClick(plan);
                          }}
                        >
                          Continue
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 hover:underline"
                          onClick={(e) => confirmDelete(plan, e)}
                        >
                          Delete
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Plan Card */}
              <div
                onClick={handleCreateNewPlan}
                className="cursor-pointer border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center p-8 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group hover:shadow-inner"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-4 group-hover:from-orange-200 group-hover:to-orange-300 transition-all shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors"
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
                <h3 className="text-lg font-medium text-gray-700 mb-1 group-hover:text-orange-600 transition-colors">
                  Start New Culinary Adventure
                </h3>
                <p className="text-sm text-gray-500 text-center group-hover:text-gray-600 transition-colors">
                  Create a personalized cooking plan to expand your kitchen skills
                </p>
                <div className="mt-4 px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium group-hover:bg-orange-200 transition-colors">
                  Get Started
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 rounded-xl max-w-md w-full mx-4 border border-red-100 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Delete Learning Plan</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <span className="font-semibold">"{planToDelete?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-sm"
                onClick={() => handleDeletePlan(planToDelete.id)}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LearningPlans;