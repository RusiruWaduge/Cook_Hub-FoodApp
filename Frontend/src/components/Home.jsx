import React, { useEffect, useState } from "react";
import Navbar from "./Navbar"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate(); // Initialize navigate hook
  const [foodCommunities, setFoodCommunities] = useState([

  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });

  const usersToFollow = [
    { id: 1, name: "Alice 🍳" },
    { id: 2, name: "Bob 🍜" },
    { id: 3, name: "Charlie 🍕" },
    { id: 4, name: "Dana 🥗" },
  ];

  const foodPosts = [
    {
      id: 1,
      title: "Vegan Avocado Toast 🥑🍞",
      description:
        "A healthy and delicious vegan breakfast option. Packed with nutrients and perfect for any time of the day!",
      imageUrl:
        "https://vancouverwithlove.com/wp-content/uploads/2023/05/high-protein-avocado-toast-featured.jpg",
      author: "Healthy Eaters 🌿",
    },
    {
      id: 2,
      title: "Chocolate Lava Cake 🍫🍰",
      description:
        "Indulge in this rich, molten chocolate cake that melts in your mouth. A dessert lover's dream!",
      imageUrl:
        "https://www.allrecipes.com/thmb/dfGgVmzpoHhrsLjxGBa_0rIWyq0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/276304lava-cakeKim-e03d3bc55516400e8d05b8d84b524b73.jpg",
      author: "Dessert Lovers 🍰",
    },
  ];

  useEffect(() => {
    // Get the username from local storage
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Foodie");

    // Fetch communities from the backend
    const fetchCommunities = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/communities");
        setFoodCommunities(response.data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching communities:", error);
      }
    };

    fetchCommunities();
  }, []);


  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "Foodie");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  const handleDeleteCommunity = async (communityId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/communities/${communityId}`);
      console.log("Community deleted successfully:", response.data);
      // Optionally, update the UI by removing the community from the list
    } catch (error) {
      console.error("Error deleting community:", error.response ? error.response.data : error.message);
      alert("Failed to delete the community. Please try again later.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    // Logic to submit the new community data to the backend
    try {
      const response = await axios.post("http://localhost:8080/api/communities", newCommunity);
      console.log("Community created successfully:", response.data);
      // Optionally, update the UI with the new community
      setFoodCommunities([...foodCommunities, response.data]);
      setNewCommunity({ name: "", description: "" }); // Clear the form inputs after successful submission
      setShowForm(false); // Close the form
    } catch (error) {
      console.error("Error creating community:", error.response ? error.response.data : error.message);
      alert("Failed to create the community. Please try again later.");
    }
  };
  
  

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF2] via-[#FFDCB9] to-[#FFAA6B] p-10 font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start gap-6 flex-col lg:flex-row">
            {/* Left Column: Users to Follow */}
            <div className="lg:w-1/4 w-full">
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-[#F97316] mb-2">
                  Welcome, {username} 👋
                </h1>
                <button
                  onClick={handleLogout}
                  className="bg-[#EF4444] text-white py-2 px-5 rounded-lg shadow-md hover:bg-[#DC2626]"
                >
                  Logout
                </button>
              </div>
              <h2 className="text-xl font-semibold text-[#4B5563] mb-4">
                👥 Follow Users
              </h2>
              <ul className="space-y-4">
                {usersToFollow.map((user) => (
                  <li
                    key={user.id}
                    className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                  >
                    <span className="text-[#4B5563] font-medium">{user.name}</span>
                    <button className="bg-[#F97316] text-white text-sm px-3 py-1 rounded-md hover:bg-[#FF9F00]">
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Center Column: Food Posts */}
            <div className="lg:w-2/4 w-full">
              <h2 className="text-2xl font-semibold text-[#4B5563] mb-6">
                🥘 Latest Food Posts
              </h2>
              <div className="space-y-8">
                {foodPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#F97316] mb-2">
                      {post.title}
                    </h3>
                    <p className="text-[#4B5563] text-sm mb-3">{post.description}</p>
                    <div className="text-sm italic text-[#6B7280] mb-4">
                      {post.author}
                    </div>
                    <div className="flex gap-4">
                      <button className="bg-[#FF9F00] text-white px-4 py-2 rounded hover:bg-[#F97316]">
                        👍 Like
                      </button>
                      <button className="bg-[#FF9F00] text-white px-4 py-2 rounded hover:bg-[#F97316]">
                        💬 Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Communities */}
            <div className="lg:w-1/4 w-full">
              <h2 className="text-xl font-semibold text-[#4B5563] mb-4">
                🍽️ Food Communities
              </h2>

              <button
                onClick={() => setShowForm(!showForm)}
                className="mb-4 bg-[#10B981] text-white px-4 py-2 rounded-lg hover:bg-[#059669]"
              >
                ➕ Create Community
              </button>

              {showForm && (
                <form
                  onSubmit={handleFormSubmit}
                  className="bg-white p-4 rounded-xl shadow space-y-3 mb-6"
                >
                  <input
                    type="text"
                    placeholder="Community Name"
                    value={newCommunity.name}
                    onChange={(e) =>
                      setNewCommunity({ ...newCommunity, name: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newCommunity.description}
                    onChange={(e) =>
                      setNewCommunity({ ...newCommunity, description: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#F97316] text-white px-4 py-2 rounded hover:bg-[#FF9F00]"
                  >
                    Create
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {foodCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="bg-white p-4 rounded-xl border border-[#FFB84D] shadow"
                  >
                    <h3 className="text-lg font-bold text-[#F97316] mb-1">
                      {community.name}
                    </h3>
                    <p className="text-[#4B5563] text-sm">{community.description}</p>
                    <button
      className="mt-3 bg-[#FF9F00] text-white py-1 px-3 rounded text-sm hover:bg-[#F97316]"
      onClick={() => navigate(`/community/${community.id}`)} // Navigate to the community page
    >
      Join Now
    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;