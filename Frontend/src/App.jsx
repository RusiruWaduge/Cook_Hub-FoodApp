import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Home from "./components/Home"; 
import Login from "./components/Login"; 
import Register from "./components/Register"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
// import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar"; // Import the Navbar component
import Footer from "./components/Footer"; // Import the Footer component
// import CommunityPlatform from "./components/CommunityPlatform";
// import LeaningPage from "./components/PlanManagement"
// import CreateLearningPlan from "./components/CreateLearningPlan";
import LearningPlans from "./components/LearningPlans";
import LearningPlanDetails from "./components/LearningPlanDetails";
import CreateLearningPlan from "./components/CreateLeaningPlan";
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
        {/* <Route path="/CreatePost" element={<CreatePost />} /> */}
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
        {/* <Route path="/community/:id" element= {<CommunityPlatform /> }/> */}
        {/* // <Route path="/learning" element={<LeaningPage />} />
        // <Route path="/create-learning-plan" element={<CreateLearningPlan />} /> */ }
        <Route path="/learning" element={<LearningPlans />} />
        <Route path="/learning-plan/:id" element={<LearningPlanDetails />} />
        
        <Route path="/create-learning-plan" element={<CreateLearningPlan />} />
      </Routes>
    </Router>
  );
}

export default App;