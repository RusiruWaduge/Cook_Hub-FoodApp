import React, { useState, useEffect } from "react";
import { FaUserCircle, FaLock, FaGlobe, FaShareAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",
    isPublic: true,
  });

  const [user, setUser] = useState({});

  // Fetch user details and posts using token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (token) {
      setUser({ name, email });

      axios
        .get("http://localhost:8080/api/posts/byLoggedInUser", {
          headers: {
            Authorization: `Bearer ${token}`,  // Fixed string interpolation here
          },
        })
        .then((res) => setPosts(res.data))
        .catch((err) => console.error("Error fetching posts:", err));
    }
  }, []);

  // Handle new post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:8080/api/posts", newPost, {
        headers: {
          Authorization: `Bearer ${token}`, // Fixed string interpolation here
        },
      });
      setPosts([res.data, ...posts]);
      setNewPost({ title: "", content: "", image: "", isPublic: true });
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  // Toggle post visibility
  const handleToggleVisibility = async (id, currentVisibility) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${id}/visibility`, // Fixed template literal here
        { isPublic: !currentVisibility },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Fixed string interpolation here
          },
        }
      );

      // Update UI after successful backend update
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, isPublic: res.data.isPublic } : post
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#FFF3E0] via-[#F0F4C3] to-[#E0F2F1] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex items-center gap-4">
            <FaUserCircle className="text-5xl text-[#F97316]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.name || "Jane Doe"}
              </h2>
              <p className="text-gray-600">
                {user.email || "jane.doe@email.com"}
              </p>
            </div>
          </div>

          {/* New Post Form */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4 text-[#4B5563]">
              ✍ Create New Post
            </h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                placeholder="Post Title"
                required
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                rows="4"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="Write your content here..."
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="url"
                value={newPost.image}
                onChange={(e) =>
                  setNewPost({ ...newPost, image: e.target.value })
                }
                placeholder="Image URL (optional)"
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="ml-auto bg-[#F97316] text-white px-5 py-2 rounded-lg hover:bg-[#FF9F00]"
                >
                  Post
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div>
            <h3 className="text-2xl font-bold text-[#4B5563] mb-6">
              📚 Your Posts
            </h3>
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-5 shadow-md rounded-xl space-y-3"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold">{post.title}</h4>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() =>
                          handleToggleVisibility(post.id, post.isPublic)
                        }
                        title="Toggle Visibility"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {post.isPublic ? (
                          <FaGlobe className="text-green-500" />
                        ) : (
                          <FaLock className="text-red-500" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          alert("Share functionality coming soon!")
                        }
                        title="Share"
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <FaShareAlt />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-sm italic text-gray-400">
                    Visibility: {post.isPublic ? "Public" : "Private"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
