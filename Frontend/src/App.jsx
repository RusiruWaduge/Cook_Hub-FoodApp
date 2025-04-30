import React from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import Home from "./components/Home"; 
import Login from "./components/Login"; 
import Register from "./components/Register"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
import Navbar from "./components/Navbar"; // Import the Navbar component
import Footer from "./components/Footer"; // Import the Footer component
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
        <Route path="/register" element={<Register />} />s
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/footer" element={<Footer />} />
      </Routes>
    </Router>
  );
}

export default App;