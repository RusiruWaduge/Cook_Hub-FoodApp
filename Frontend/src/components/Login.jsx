import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true); // Start showing loading spinner
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const welcomeMsg = res.data.message || "";
      const usernameMatch = welcomeMsg.match(/Welcome back,\s*(.+)!/);
      const username = usernameMatch ? usernameMatch[1] : "User";

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      }

      // Simulate loading for a moment before navigating
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5 seconds
    } catch (err) {
      setIsLoading(false); // Stop loading if error
      alert("Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const decoded = jwtDecode(token);

      const res = await axios.post("http://localhost:8080/api/auth/google", {
        token,
      });

      const jwt = res.data.token;
      const welcomeMsg = res.data.message || "";
      const usernameMatch = welcomeMsg.match(/Welcome back,\s*(.+)!/);
      const username = usernameMatch ? usernameMatch[1] : "User";

      localStorage.setItem("token", jwt);
      localStorage.setItem("username", username);
      navigate("/");
    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="w-1/2 bg-black text-white flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold mb-8">Welcome Back 👋</h1>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 mb-4 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 mb-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
            <div className="text-right text-sm mb-4 text-gray-400">
              Forgot password?
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-full transition duration-300"
            >
              Sign in
            </button>
          </form>

          <div className="my-4 text-center text-gray-400">or</div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google login failed")}
            />
          </div>

          <p className="mt-6 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="text-teal-400 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right side with blurred image */}
      <div className="w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-75"
          style={{
            backgroundImage:
              "url('https://media.istockphoto.com/id/1457433817/photo/group-of-healthy-food-for-flexitarian-diet.jpg?s=612x612&w=0&k=20&c=v48RE0ZNWpMZOlSp13KdF1yFDmidorO2pZTu2Idmd3M=')",
          }}
        ></div>
        {/* Optional: add overlay content here */}
      </div>
    </div>
  );
};

export default Login;
