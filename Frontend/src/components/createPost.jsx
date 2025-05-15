import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaLock,
  FaGlobe,
  FaShareAlt,
  FaThumbsUp,
  FaComment,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import Navbar from "./NavBar";
import axios from "axios";

// Normalize image property into image string (backend legacy fix)
const normalizePostImage = (post) => {
  if (post.image) return post;
  return { ...post, image: "" };
};

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",
    isPublic: true,
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // Track which post is being deleted

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (token) {
      setUser({ name, email });

      axios
        .get("http://localhost:8080/api/posts/byLoggedInUser", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setPosts(res.data.map(normalizePostImage)))
        .catch((err) => console.error("Error fetching posts:", err));
    }
  }, []);

  const totalPosts = posts.length;
  const publicPosts = posts.filter((post) => post.isPublic).length;
  const privatePosts = posts.filter((post) => !post.isPublic).length;

  const handleImageChange = (e) => {
    setValidationError("");
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please upload a valid image file.");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setNewPost({ ...newPost, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingPostId) {
        const res = await axios.put(
          `http://localhost:8080/api/posts/${editingPostId}`,
          newPost,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPosts(posts.map((p) => (p.id === editingPostId ? normalizePostImage(res.data) : p)));
        setEditingPostId(null);
      } else {
        const res = await axios.post("http://localhost:8080/api/posts", newPost, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts([normalizePostImage(res.data), ...posts]);
      }
      setNewPost({ title: "", content: "", image: "", isPublic: true });
      setValidationError("");
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  const handleLikePost = (postId) => console.log("Liked post:", postId);
  const handleCommentPost = (postId) => console.log("Commented post:", postId);

  const handleImageClick = (image) => {
    setFullImage(image);
    setShowModal(true);
  };

  const handleEditPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setNewPost({
      title: post.title,
      content: post.content,
      image: post.image || "",
      isPublic: post.isPublic,
    });
    setEditingPostId(postId);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p.id !== postId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleToggleVisibility = async (postId, currentVisibility) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `http://localhost:8080/api/posts/${postId}/visibility`,
        { isPublic: !currentVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(posts.map((p) => (p.id === postId ? normalizePostImage(res.data) : p)));
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFullImage(null);
  };

  return (
    <>
      <Navbar />

      {/* Background static fruit/veggie shapes */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none"
      >
        <img src="/banana.svg" alt="" className="absolute top-10 left-5 w-24 opacity-20 animate-pulse-slow" />
        <img src="/apple.svg" alt="" className="absolute bottom-10 right-10 w-20 opacity-15 animate-pulse-slower" />
        <img src="/carrot.svg" alt="" className="absolute top-1/2 right-20 w-28 opacity-10 animate-pulse-slow" />
        <img src="/grape.svg" alt="" className="absolute bottom-20 left-20 w-16 opacity-15 animate-pulse-slower" />
        <img src="/tomato.svg" alt="" className="absolute top-20 right-1/3 w-20 opacity-10 animate-pulse-slow" />
      </div>

      <div className="relative z-10 min-h-screen bg-gradient-to-br from-[#FFF7E0] via-[#FFF4C1] to-[#FFEFBA] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-3xl p-8 mb-10 flex items-center gap-6">
            <FaUserCircle className="text-7xl text-orange-500 animate-pulse" />
            <div>
              <h1 className="text-3xl font-extrabold text-black tracking-tight">
                Welcome Back!
              </h1>
              <p className="text-black mt-1 max-w-md">
                Explore your posts, share your moments, and connect with your community.
              </p>
            </div>
          </div>

          {/* Post Count Cards */}
          <div className="flex justify-between mb-10 gap-6">
            <div className="flex-1 bg-orange-100 bg-opacity-60 rounded-3xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer animate-fadeIn border border-orange-300">
              <h2 className="text-2xl font-semibold mb-2 text-orange-600">Total Posts</h2>
              <p className="text-4xl font-extrabold text-black">{totalPosts}</p>
            </div>

            <div className="flex-1 bg-green-100 bg-opacity-50 rounded-3xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer animate-fadeIn delay-200 border border-green-300">
              <h2 className="text-2xl font-semibold mb-2 text-green-600">Public Posts</h2>
              <p className="text-4xl font-extrabold text-black">{publicPosts}</p>
            </div>

            <div className="flex-1 bg-red-100 bg-opacity-50 rounded-3xl p-6 shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer animate-fadeIn delay-400 border border-red-300">
              <h2 className="text-2xl font-semibold mb-2 text-red-600">Private Posts</h2>
              <p className="text-4xl font-extrabold text-black">{privatePosts}</p>
            </div>
          </div>

          {/* Create Post Form */}
          <div className="bg-white bg-opacity-70 backdrop-blur-md shadow-lg rounded-3xl p-10 mb-10 relative border border-gray-200 ring-1 ring-gray-300 ring-opacity-30 hover:shadow-2xl hover:ring-opacity-60 transition max-w-full">
            <h3 className="text-2xl font-semibold text-orange-600 flex items-center gap-3">
              {editingPostId ? "✍ Edit Post" : "✍ Create New Post"}
              <span className="text-orange-500 animate-pulse">●</span>
            </h3>

            <form onSubmit={handlePostSubmit} className="flex flex-col gap-6">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post Title"
                required
                className="w-full p-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-300 transition"
              />
              <textarea
                rows="5"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your content here..."
                required
                className="w-full p-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-orange-300 transition resize-none"
              />

              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-block bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 max-w-max animate-bounce-once"
              >
                Add Image
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {validationError && (
                <p className="text-red-600 font-semibold mt-2">{validationError}</p>
              )}

              {newPost.image && (
                <div className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition duration-300 mt-4">
                  <img
                    src={newPost.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(newPost.image)}
                  />
                  <button
                    type="button"
                    onClick={() => setNewPost((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 shadow"
                    title="Remove image"
                  >
                    &times;
                  </button>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-8 py-3 rounded-3xl font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 animate-pulse-once"
                  disabled={validationError !== ""}
                >
                  {editingPostId ? "Update Post" : "Post"}
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div>
            <h3 className="text-2xl font-bold text-black mb-6">📚 Your Posts</h3>
            <div className="space-y-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white bg-opacity-60 backdrop-blur-md p-5 rounded-xl shadow-md cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-[1.03]"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(post.image)}
                    />
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <h4 className="text-xl font-semibold text-orange-600">{post.title}</h4>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleToggleVisibility(post.id, post.isPublic)}
                        title="Toggle Visibility"
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {post.isPublic ? (
                          <FaGlobe className="text-green-600" />
                        ) : (
                          <FaLock className="text-red-600" />
                        )}
                      </button>

                      <button
                        onClick={() => alert("Share functionality coming soon!")}
                        title="Share"
                        className="text-gray-700 hover:text-yellow-600"
                      >
                        <FaShareAlt />
                      </button>

                      <button
                        onClick={() => handleEditPost(post.id)}
                        title="Edit Post"
                        className="text-gray-700 hover:text-yellow-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => setShowDeleteConfirm(post.id)}
                        title="Delete Post"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <p className="text-black mt-2">{post.content}</p>
                  <p className="text-sm italic text-gray-600 mt-1">
                    Visibility: {post.isPublic ? "Public" : "Private"}
                  </p>

                  {/* Like and Comment Section */}
                  <div className="flex items-center gap-6 mt-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-gray-700 hover:text-yellow-600"
                    >
                      <FaThumbsUp /> Like
                    </button>
                    <button
                      onClick={() => handleCommentPost(post.id)}
                      className="flex items-center gap-2 text-gray-700 hover:text-yellow-600"
                    >
                      <FaComment /> Comment
                    </button>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === post.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div className="bg-white p-5 rounded-3xl shadow-2xl max-w-[90vw] max-h-[90vh] overflow-hidden transform transition-transform duration-300 hover:scale-105">
            <img
              src={fullImage}
              alt="Full view"
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;