import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Home from "./components/Home"; 
import Login from "./components/Login"; 
import Register from "./components/Register"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
// import CommunityPage from "./components/CommunityPage"; // Import the CommunityPage component
// import LeaningPage from "./components/PlanManagement"
// import CreateLearningPlan from "./components/CreateLearningPlan";
import "./index.css";

function App() {
  return (
    <Router>
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
        {/* <Route path="/community/:id" element={<CommunityPage />} />
        <Route path="/learning" element={<LeaningPage />} />
        <Route path="/create-learning-plan" element={<CreateLearningPlan />} /> */}
      </Routes>
    </Router>
  );
}

export default App;