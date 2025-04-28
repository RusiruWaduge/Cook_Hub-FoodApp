// src/components/LearningPlanDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LearningPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/learningplans/${id}`);
        setPlan(response.data);
      } catch {
        setError("Failed to fetch the plan details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlanDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl text-red-500">
        {error}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl text-red-500">
        Plan not found!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFEBEE] via-[#FFF3E0] to-[#E3F2FD] p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-bold text-[#F97316] mb-4">{plan.title}</h2>
        <p className="text-gray-700 mb-6">{plan.goal}</p>
        <p className="text-gray-700 mb-6">
          <strong>Skills:</strong> {plan.skills}
        </p>

        <div className="flex justify-center mb-6">
          <img
            src={plan.image}
            alt={plan.title}
            className="w-full max-w-[600px] rounded-lg shadow-lg"
          />
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">📋 Topics to Cover</h3>

        <div className="space-y-6">
          {plan.steps.map((step, index) => (
            <div
              key={index}
              className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-300 shadow"
            >
              <h4 className="text-xl font-semibold text-orange-600">{step.topic}</h4>
              <p className="text-gray-700">
                <strong>Resources:</strong>{" "}
                <a
                  href={step.resources}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {step.resources}
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Timeline:</strong> {step.timeline}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate("/learning")}
            className="bg-[#F97316] text-white px-6 py-2 rounded-lg hover:bg-orange-500"
          >
            🔙 Back to Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPlanDetails;
