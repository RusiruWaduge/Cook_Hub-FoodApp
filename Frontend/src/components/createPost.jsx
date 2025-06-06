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
import Navbar from "./Navbar";
import axios from "axios";

// Normalize image property into images array (backend legacy fix)
const normalizePostImage = (post) => {
  if (post.images && post.images.length > 0) return post;
  // fallback if no images array, convert image string to array or empty
  if (post.image) return { ...post, images: [post.image] };
  return { ...post, images: [] };
};

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    images: [], // <-- changed to array
    isPublic: true,
  });
  const [editingPostId, setEditingPostId] = useState(null);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [fullImage, setFullImage] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

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
        .then((res) => {
          setPosts(res.data.map(normalizePostImage));
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const totalPosts = posts.length;
  const publicPosts = posts.filter((post) => post.isPublic).length;
  const privatePosts = posts.filter((post) => !post.isPublic).length;

  const handleImageChange = (e) => {
    setValidationError("");
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length + newPost.images.length > 3) {
      setValidationError("You can select up to 3 images only.");
      e.target.value = null;
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      setValidationError("Please upload a valid image file.");
      e.target.value = null;
      return;
    }

    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    )
      .then((imagesBase64) => {
        setNewPost((prev) => ({
          ...prev,
          images: [...prev.images, ...imagesBase64],
        }));
      })
      .catch(() => {
        setValidationError("Error reading one or more image files.");
      });
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
        setPosts(
          posts.map((p) => (p.id === editingPostId ? normalizePostImage(res.data) : p))
        );
        setEditingPostId(null);
      } else {
        const res = await axios.post("http://localhost:8080/api/posts", newPost, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts([normalizePostImage(res.data), ...posts]);
      }
      setNewPost({ title: "", content: "", images: [], isPublic: true });
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
      images: post.images || [],
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

      {loading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div
        className={`relative z-10 min-h-screen bg-gradient-to-br from-[#FFF7E0] via-[#FFF4C1] to-[#FFEFBA] p-6 transition-opacity duration-700 ${
          loading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
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
            <h3 className="text-2xl font-semibold text-orange-600 flex items-center gap-3 mb-2">
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
                Add Images
              </label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {validationError && (
                <p className="text-red-600 font-semibold mt-2">{validationError}</p>
              )}

              {newPost.images.length > 0 && (
                <div className="flex gap-4 mt-4 overflow-x-auto max-w-full">
                  {newPost.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-40 h-40 rounded-3xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition duration-300 flex-shrink-0"
                    >
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onClick={() => handleImageClick(img)}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNewPost((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx),
                          }))
                        }
                        className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 text-red-600 hover:text-red-800 shadow"
                        title="Remove image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="cursor-pointer inline-block bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 max-w-max animate-bounce-once"
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

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-300 rounded-xl h-48 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white bg-opacity-60 backdrop-blur-md p-5 rounded-xl shadow-md cursor-pointer transform transition duration-300 hover:shadow-xl hover:scale-[1.03] mb-8"
                  >
                    {/* MULTIPLE IMAGES WITH SLIDER STYLE */}
                    {post.images && post.images.length > 0 && (
                      <div className="flex gap-4 overflow-x-auto mb-4 py-2">
                        {post.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${post.title} img ${idx + 1}`}
                            className="w-[350px] h-[350px] object-cover rounded-xl flex-shrink-0 cursor-pointer"
                            onClick={() => handleImageClick(img)} // open modal on click
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <h4 className="text-xl font-semibold text-orange-600">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            handleToggleVisibility(post.id, post.isPublic)
                          }
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
                        <div
                          className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h3 className="text-xl font-bold mb-4">
                            Confirm Deletion
                          </h3>
                          <p className="mb-6">
                            Are you sure you want to delete this post? This
                            action cannot be undone.
                          </p>
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
            )}
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
