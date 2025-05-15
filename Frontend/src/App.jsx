import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import LearningPlans from "./components/LearningPlans";
import LearningPlanDetails from "./components/LearningPlanDetails";
import CreateLearningPlan from "./components/CreateLeaningPlan";
import CommunityPage from "./components/CommunityPage";
import ProfilePage from "./components/CreatePost";


import "./index.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/learning" element={<LearningPlans />} />
          <Route path="/learning-plan/:id" element={<LearningPlanDetails />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/create-learning-plan"
            element={<CreateLearningPlan />}
          />
        </Routes>
      </>
    </Router>
  );
}

export default App;