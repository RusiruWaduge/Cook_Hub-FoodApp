import React, { useState, useEffect } from "react";
import { FaUserCircle, FaLock, FaGlobe, FaShareAlt, FaThumbsUp, FaComment, FaEdit, FaTrashAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import axios from "axios";

const CreatePost = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    image: "",  // Holds the image URL (URL string, not a file)
    isPublic: true,
  });
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
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
            Authorization: `Bearer ${token}`,
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
      if (editingPostId) {
        // If we are editing a post, update it
        const res = await axios.put(`http://localhost:8080/api/posts/${editingPostId}`, newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Update the post list with the updated post
        setPosts(posts.map((post) => (post.id === editingPostId ? res.data : post)));
        setEditingPostId(null); // Reset the editing state
      } else {
        // Create a new post
        const res = await axios.post("http://localhost:8080/api/posts", newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts([res.data, ...posts]);
      }

      // Reset the form
      setNewPost({ title: "", content: "", image: "", isPublic: true });
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  // Handle like button click
  const handleLikePost = (postId) => {
    console.log("Liked post with id:", postId);
    // Add logic for liking the post (e.g., send API request to update like count)
  };

  // Handle comment button click
  const handleCommentPost = (postId) => {
    console.log("Commented on post with id:", postId);
    // Add logic for adding a comment
  };

  // Handle image URL input
  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setNewPost({ ...newPost, image: imageUrl });
  };

  // Start editing a post by populating the form
  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    setNewPost({
      title: postToEdit.title,
      content: postToEdit.content,
      image: postToEdit.image,
      isPublic: postToEdit.isPublic,
    });
    setEditingPostId(postId); // Set the post ID to indicate we're editing
  };

  // Handle delete post functionality
  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(posts.filter((post) => post.id !== postId)); // Remove post from state after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
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
              <h2 className="text-2xl font-bold text-gray-800">{user.name || "Jane Doe"}</h2>
              <p className="text-gray-600">{user.email || "jane.doe@email.com"}</p>
            </div>
          </div>

          {/* New Post Form */}
          <div className="bg-white shadow-md rounded-2xl p-6 mb-10">
            <h3 className="text-xl font-semibold mb-4 text-[#4B5563]">{editingPostId ? "✍ Edit Post" : "✍ Create New Post"}</h3>
            <form onSubmit={handlePostSubmit} className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post Title"
                required
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                rows="4"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Write your content here..."
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="url"
                value={newPost.image}
                onChange={handleImageChange}
                placeholder="Image URL (optional)"
                className="w-full p-3 border rounded-lg"
              />
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="ml-auto bg-[#F97316] text-white px-5 py-2 rounded-lg hover:bg-[#FF9F00]"
                >
                  {editingPostId ? "Update Post" : "Post"}
                </button>
              </div>
            </form>
          </div>

          {/* Posts List */}
          <div>
            <h3 className="text-2xl font-bold text-[#4B5563] mb-6">📚 Your Posts</h3>
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-5 shadow-md rounded-xl space-y-3">
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
                        onClick={() => handleToggleVisibility(post.id, post.isPublic)}
                        title="Toggle Visibility"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {post.isPublic ? <FaGlobe className="text-green-500" /> : <FaLock className="text-red-500" />}
                      </button>

                      <button
                        onClick={() => alert("Share functionality coming soon!")}
                        title="Share"
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <FaShareAlt />
                      </button>

                      <button
                        onClick={() => handleEditPost(post.id)}
                        title="Edit Post"
                        className="text-gray-500 hover:text-blue-500"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        title="Delete Post"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700">{post.content}</p>
                  <p className="text-sm italic text-gray-400">
                    Visibility: {post.isPublic ? "Public" : "Private"}
                  </p>

                  {/* Like and Comment Section */}
                  <div className="flex items-center gap-6 mt-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                    >
                      <FaThumbsUp /> Like
                    </button>
                    <button
                      onClick={() => handleCommentPost(post.id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-500"
                    >
                      <FaComment /> Comment
                    </button>
                  </div>
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
