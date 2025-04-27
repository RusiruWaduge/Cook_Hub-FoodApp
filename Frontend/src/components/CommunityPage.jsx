import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./LoadingSpinner"; // You should create this component

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCommunity, setEditCommunity] = useState({
    name: "",
    description: "",
  });
  const [newPost, setNewPost] = useState({
    author: "",
    content: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchCommunity(), fetchPosts()]);
      } catch (error) {
        toast.error("Failed to load community data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/communities/${id}`
      );
      setCommunity(res.data);
    } catch (err) {
      console.error("Error fetching community:", err);
      throw err;
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/communities/${id}/posts`
      );
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      throw err;
    }
  };

  const handleJoinCommunity = async () => {
    const userName = localStorage.getItem("username"); // or use the context if you have one
    if (!userName) {
      toast.error("You must be logged in to join a community.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/communities/${id}/join`,
        null,
        {
          params: { userName },
        }
      );

      toast.success("You have joined the community!");
      fetchCommunity();
    } catch (err) {
      console.error("Error joining community:", err);
      toast.error("An error occurred while trying to join.");
    }
  };

  const handleLeaveCommunity = async () => {
    const userName = localStorage.getItem("username"); // Ensure user is logged in
    if (!userName) {
      toast.error("You must be logged in to leave a community.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to leave this community?"
    );
    if (!confirmation) return; // Prevent action if user cancels

    try {
      await axios.post(
        `http://localhost:8080/api/communities/${id}/leave`,
        null,
        { params: { userName } }
      );

      toast.success("You have left the community.");
      fetchCommunity(); // Refresh community data after leaving
    } catch (err) {
      console.error("Error leaving community:", err);
      toast.error("An error occurred while trying to leave the community.");
    }
  };

  const handleAddPost = async () => {
    if (!newPost.author || !newPost.content) {
      toast.warning("Please fill in all required fields");
      return;
    }

    try {
      setIsProcessing(true);
      const post = {
        ...newPost,
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      };
      await axios.post(
        `http://localhost:8080/api/communities/${id}/posts`,
        post
      );
      setNewPost({ author: "", content: "", image: "" });
      setShowForm(false);
      toast.success("Post published successfully!");
      fetchPosts();
    } catch (err) {
      toast.error("Error adding post");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLike = async (postId) => {
    const userName = localStorage.getItem("username"); // Retrieve the logged-in username from localStorage
    if (!userName) {
      toast.error("You must be logged in to like or unlike a post.");
      return;
    }

    try {
      const post = posts.find((p) => p.id === postId); // Find the specific post by its ID

      if (!post) {
        toast.error("Post not found.");
        return;
      }

      // Check if the user has already liked the post
      const hasLiked = post.likedBy && post.likedBy.includes(userName);

      if (hasLiked) {
        // Unlike the post
        await axios.post(
          `http://localhost:8080/api/communities/${id}/posts/${postId}/unlike`, // Use a new endpoint for unliking
          null,
          { params: { userName } }
        );
        toast.info("You have unliked this post.");
      } else {
        // Like the post
        await axios.post(
          `http://localhost:8080/api/communities/${id}/posts/${postId}/like`,
          null,
          { params: { userName } }
        );
        toast.success("You have liked this post.");
      }

      fetchPosts(); // Refresh the posts
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("An error occurred while toggling the like.");
    }
  };

  const handleEditCommunity = () => {
    setEditMode(true);
    setEditCommunity({
      name: community.name,
      description: community.description,
    });
  };

  const handleUpdateCommunity = async () => {
    if (!editCommunity.name.trim()) {
      toast.warning("Community name cannot be empty");
      return;
    }

    try {
      setIsProcessing(true);
      await axios.put(
        `http://localhost:8080/api/communities/${id}`,
        editCommunity
      );
      toast.success("Community updated successfully!");
      setEditMode(false);
      fetchCommunity();
    } catch (err) {
      toast.error("Failed to update community");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCommunity = async () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${community.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsProcessing(true);
      await axios.delete(`http://localhost:8080/api/communities/${id}`);
      toast.success("Community deleted successfully");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the community";
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditCommunity({ ...editCommunity, [e.target.name]: e.target.value });
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  if (!community)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Community Not Found
          </h2>
          <p className="mb-4">
            The community you're looking for doesn't exist or may have been
            removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Return Home
          </button>
        </div>
      </div>
    );

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gradient-to-br from-[#FFFBF2] via-[#FFDCB9] to-[#FFAA6B] p-4 md:p-10 font-sans">
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-lg">Processing your request...</p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Members */}
            <div className="lg:w-1/4 w-full order-1">
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6">
                <h3 className="text-2xl font-semibold text-[#F97316] mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Members ({community.members?.length || 0})
                </h3>
                <div className="max-h-96 overflow-y-auto pr-2">
                  {community.members?.length > 0 ? (
                    <ul className="space-y-2">
                      {community.members.map((member, i) => (
                        <li
                          key={i}
                          className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center"
                        >
                          <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                            {member.charAt(0).toUpperCase()}
                          </span>
                          {member}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      <p className="text-gray-500 mt-2">
                        No members yet. Be the first to join!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-2/4 w-full order-3 lg:order-2">
              {/* Community Header */}
              <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
                {!editMode ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-[#F97316] mb-1">
                          {community.name}
                        </h2>
                        <p className="text-[#4B5563]">
                          {community.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleEditCommunity}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Community"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          onClick={handleDeleteCommunity}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Community"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleJoinCommunity}
                        className="flex items-center bg-[#10B981] text-white px-4 py-2 rounded hover:bg-[#059669] transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Join Community
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4 text-[#F97316]">
                      Edit Community
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Community Name"
                          value={editCommunity.name}
                          onChange={handleEditChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Community Description"
                          value={editCommunity.description}
                          onChange={handleEditChange}
                          rows="3"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateCommunity}
                          className="flex items-center bg-[#10B981] text-white px-4 py-2 rounded hover:bg-[#059669] transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditMode(false)}
                          className="flex items-center bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Post Creation */}
              <div className="bg-white p-4 rounded-xl shadow mb-4">
                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center justify-center w-full bg-[#2563EB] text-white px-4 py-3 rounded hover:bg-[#1D4ED8] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create a Post
                  </button>
                ) : (
                  <div className="bg-white p-6 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-semibold text-[#F97316]">
                        Create a Post
                      </h3>
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="author"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Your Name*
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          placeholder="Enter your name"
                          value={newPost.author}
                          onChange={handleChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          What's on your mind?*
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          placeholder="Share your thoughts with the community..."
                          value={newPost.content}
                          onChange={handleChange}
                          rows="3"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="image"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Image URL (optional)
                        </label>
                        <input
                          type="url"
                          id="image"
                          name="image"
                          placeholder="https://example.com/image.jpg"
                          value={newPost.image}
                          onChange={handleChange}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={handleAddPost}
                          disabled={!newPost.author || !newPost.content}
                          className={`flex items-center bg-[#10B981] text-white px-4 py-2 rounded hover:bg-[#059669] transition-colors ${
                            !newPost.author || !newPost.content
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Publish Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Posts List */}
              <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-semibold text-[#F97316]">
                    Community Posts
                  </h3>
                  <span className="text-sm text-gray-500">
                    {posts.length} post{posts.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {posts.length > 0 ? (
                  <ul className="space-y-6">
                    {posts.map((post) => (
                      <li
                        key={post.id}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mr-3 flex-shrink-0">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-[#F97316] font-medium">
                              {post.author}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                        <p className="text-[#4B5563] mb-3 whitespace-pre-line">
                          {post.content}
                        </p>
                        {post.image && (
                          <div className="mb-3 rounded-lg overflow-hidden">
                            <img
                              src={post.image}
                              alt="Post visual"
                              className="w-full h-auto max-h-96 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://via.placeholder.com/600x400?text=Image+not+available";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex justify-between items-center mt-3">
                          <button
                            onClick={() => handleLike(post.id)}
                            className="flex items-center text-[#EF4444] hover:text-red-700 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {post.likes} Like{post.likes !== 1 ? "s" : ""}
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-600 mt-4">
                      No posts yet
                    </h4>
                    <p className="text-gray-500 mt-1">
                      Be the first to share something with the community!
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-4 bg-[#F97316] text-white px-4 py-2 rounded hover:bg-[#E05D0E] transition-colors"
                    >
                      Create First Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Actions */}
            <div className="lg:w-1/4 w-full order-2 lg:order-3">
              <div className="bg-white p-6 rounded-xl shadow-lg sticky top-6 space-y-4">
                <h3 className="text-lg font-semibold text-[#F97316] mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                  </svg>
                  Community Actions
                </h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center justify-center w-full bg-[#F97316] text-white py-3 px-4 rounded-md hover:bg-[#E05D0E] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  Start a Discussion
                </button>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top:
                        document.querySelector(
                          ".bg-white.p-6.rounded-xl.shadow"
                        ).offsetTop - 20,
                      behavior: "smooth",
                    })
                  }
                  className="flex items-center justify-center w-full bg-[#10B981] text-white py-3 px-4 rounded-md hover:bg-[#059669] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View All Posts
                </button>
                <button
                  onClick={handleLeaveCommunity}
                  className="flex items-center justify-center w-full bg-[#EF4444] text-white py-3 px-4 rounded-md hover:bg-[#DC2626] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Leave Community
                </button>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Community Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Members</div>
                      <div className="font-medium">
                        {community.members?.length || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-500">Posts</div>
                      <div className="font-medium">{posts.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;