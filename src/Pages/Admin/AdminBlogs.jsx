import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Undo2, Redo2 } from 'lucide-react';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    status: 'active',
  });
  // History stacks for undo/redo (index-based)
  const [titleHistory, setTitleHistory] = useState([formData.title]);
  const [titleIndex, setTitleIndex] = useState(0);
  const [contentHistory, setContentHistory] = useState([formData.content]);
  const [contentIndex, setContentIndex] = useState(0);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [adminBlogs, setAdminBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchAdminBlogs();
    fetchUserBlogs();
  }, []);

  const fetchAdminBlogs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blogs/admin/adminposts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch admin blogs');
      const data = await response.json();
      setAdminBlogs(data || []);
    } catch (err) {
      setError('Error fetching admin blogs');
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blogs/admin/userposts/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user blogs');
      const data = await response.json();
      setUserBlogs(data || []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching user blogs');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === 'title') {
        setTitleHistory([value]);
        setTitleIndex(0);
      }
      if (name === 'content') {
        setContentHistory([value]);
        setContentIndex(0);
      }
      return { ...prev, [name]: value };
    });
  };

  const handleOptimize = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Title and content are required to optimize.");
      return;
    }
    setIsOptimizing(true);
    try {
      const AZURE_OPENAI_API_KEY = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
      if (!AZURE_OPENAI_API_KEY) {
        alert("Azure OpenAI API key is not set in environment variables.");
        setIsOptimizing(false);
        return;
      }
      const response = await fetch(
        "https://rashm-macq7mj4-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_API_KEY,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content:
                  "You are an expert content writer and SEO specialist. Your task is to: 1. Improve grammar, clarity, and readability of a blog post. 2. Optimize for SEO by incorporating relevant keywords naturally. 3. Return the result as JSON wrapped in ```json with fields `optimized_content`, `title`",
              },
              { role: "user", content: `\n${formData.content}` },
            ],
            max_tokens: 3000,
            temperature: 0.7,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }
      let contentStr = data.choices?.[0]?.message?.content || "";
      if (contentStr.includes("```json")) {
        contentStr = contentStr
          .replace(/```json\s*/, "")
          .replace(/\s*```$/, "");
      }
      let parsed;
      try {
        parsed = JSON.parse(contentStr);
      } catch (err) {
        alert("Failed to parse GPT response.");
        setIsOptimizing(false);
        console.error("Parse error:", err);
        return;
      }
      // Add new optimization to history for both title and content
      setTitleHistory((h) => {
        const newHistory = h.slice(0, titleIndex + 1).concat(parsed.title || formData.title);
        setTitleIndex(newHistory.length - 1);
        return newHistory;
      });
      setContentHistory((h) => {
        const newHistory = h.slice(0, contentIndex + 1).concat(parsed.optimized_content || formData.content);
        setContentIndex(newHistory.length - 1);
        return newHistory;
      });
      setFormData((prev) => ({
        ...prev,
        title: parsed.title || prev.title,
        content: parsed.optimized_content || prev.content,
      }));
      setIsOptimized(true);
      alert("Content optimized successfully!");
    } catch (error) {
      alert("Optimization failed.");
      console.error("Optimization error:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Undo/redo for title
  const handleUndoTitle = () => {
    if (titleIndex > 0) {
      setTitleIndex((idx) => {
        setFormData((prev) => ({ ...prev, title: titleHistory[idx - 1] }));
        return idx - 1;
      });
    }
  };
  const handleRedoTitle = () => {
    if (titleIndex < titleHistory.length - 1) {
      setTitleIndex((idx) => {
        setFormData((prev) => ({ ...prev, title: titleHistory[idx + 1] }));
        return idx + 1;
      });
    }
  };
  // Undo/redo for content
  const handleUndoContent = () => {
    if (contentIndex > 0) {
      setContentIndex((idx) => {
        setFormData((prev) => ({ ...prev, content: contentHistory[idx - 1] }));
        return idx - 1;
      });
    }
  };
  const handleRedoContent = () => {
    if (contentIndex < contentHistory.length - 1) {
      setContentIndex((idx) => {
        setFormData((prev) => ({ ...prev, content: contentHistory[idx + 1] }));
        return idx + 1;
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting blog:', {
      title: formData.title,
      content: formData.content,
      status: formData.status,
      image: formData.image,
    });
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('status', formData.status);
    if (formData.image) data.append('image', formData.image);
    try {
      const url = editingBlogId
        ? `http://localhost:8000/api/blogs/admin/${editingBlogId}/update/`
        : 'http://localhost:8000/api/blogs/admin/post/';
      const method = editingBlogId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await response.json();
      if (response.ok) {
        resetForm();
        setIsOptimized(false);
        alert(editingBlogId ? 'Blog updated successfully!' : 'Blog created successfully!');
        await fetchAdminBlogs();
        await fetchUserBlogs();
      } else {
        setError(result.errors ? JSON.stringify(result.errors) : (result.message || 'Failed to save blog'));
        alert('Failed to save blog. Please check the form and try again.');
      }
    } catch (err) {
      setError('Error saving blog');
      alert('Error saving blog. Please try again.');
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      image: null,
      status: blog.status,
    });
    setTitleHistory([blog.title]);
    setTitleIndex(0);
    setContentHistory([blog.content]);
    setContentIndex(0);
    setEditingBlogId(blog.blog_id);
    setImagePreview(blog.image_url || null);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/blogs/admin/${blogId}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchAdminBlogs();
        fetchUserBlogs();
        alert('Blog deleted successfully!');
      } else {
        const result = await response.json();
        setError(result.errors ? JSON.stringify(result.errors) : (result.message || 'Failed to delete blog'));
        alert('Failed to delete blog. Please try again.');
      }
    } catch (err) {
      setError('Error deleting blog');
      alert('Error deleting blog. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', image: null, status: 'active' });
    setTitleHistory(['']);
    setTitleIndex(0);
    setContentHistory(['']);
    setContentIndex(0);
    setEditingBlogId(null);
    setImagePreview(null);
    setIsOptimized(false);
    if (document.querySelector('input[name=image]')) document.querySelector('input[name=image]').value = '';
  };

  // Automatically clear error after 7 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Pagination state
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const blogsPerPage = 5;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Sort/Filter by status
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Filtered blogs based on search and status
  const filteredAdminBlogs = adminBlogs.filter(
    (blog) =>
      (statusFilter === 'all' || blog.status === statusFilter) &&
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const filteredUserBlogs = userBlogs.filter(
    (blog) =>
      (statusFilter === 'all' || blog.status === statusFilter) &&
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic for filtered blogs
  const adminTotalPages = Math.ceil(filteredAdminBlogs.length / blogsPerPage);
  const adminBlogsToShow = filteredAdminBlogs.slice((adminPage - 1) * blogsPerPage, adminPage * blogsPerPage);
  const userTotalPages = Math.ceil(filteredUserBlogs.length / blogsPerPage);
  const userBlogsToShow = filteredUserBlogs.slice((userPage - 1) * blogsPerPage, userPage * blogsPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Admin Blog Management
      </h1>
      {/* Blog Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row justify-center mb-8 gap-2 items-center">
        <input
          type="text"
          placeholder="Search blogs by title or content..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => {
            setSearchTerm(searchInput);
            setAdminPage(1);
            setUserPage(1);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
            setAdminPage(1);
            setUserPage(1);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Clear
        </button>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setAdminPage(1);
            setUserPage(1);
          }}
          className="ml-0 sm:ml-4 px-4 py-2 border rounded-md bg-white text-gray-800"
        >
          <option value="all">Sorting by Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {editingBlogId ? 'Edit Blog' : 'Create New Blog'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-800">Title</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                maxLength="200"
              />
              <button type="button" onClick={handleUndoTitle} disabled={titleIndex === 0} title="Undo Title Optimization" className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-40"><Undo2 size={18} /></button>
              <button type="button" onClick={handleRedoTitle} disabled={titleIndex === titleHistory.length - 1} title="Redo Title Optimization" className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-40"><Redo2 size={18} /></button>
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-800">Content</label>
            <div className="flex gap-2 items-center">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="6"
                required
                maxLength="5000"
              />
              <button type="button" onClick={handleUndoContent} disabled={contentIndex === 0} title="Undo Content Optimization" className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-40"><Undo2 size={18} /></button>
              <button type="button" onClick={handleRedoContent} disabled={contentIndex === contentHistory.length - 1} title="Redo Content Optimization" className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-40"><Redo2 size={18} /></button>
            </div>
          </div>
          <div className="flex gap-2 mb-2 items-center">
            <button
              type="button"
              onClick={handleOptimize}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 flex items-center"
              disabled={isOptimizing}
            >
              {isOptimizing && (
                <svg className="animate-spin mr-2 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              Optimize
            </button>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-800">Image</label>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => { setFormData({ ...formData, image: null }); setImagePreview(null); if (document.querySelector('input[name=image]')) document.querySelector('input[name=image]').value = ''; }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md"
              >
                Clear
              </button>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-48 h-32 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-800">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#1B7B19] hover:bg-green-800 text-white px-6 py-2 rounded-md transition-colors"
            >
              {editingBlogId ? 'Update Blog' : 'Create Blog'}
            </button>
            {editingBlogId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      {/* Admin Blogs Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Blogs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : adminBlogs.length === 0 ? (
          <p className="text-gray-500">No admin blogs found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {adminBlogsToShow.map((blog) => (
                <div
                  key={blog.blog_id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedBlog(blog); setShowBlogModal(true); }}>
                    <img
                      src={blog.image_url || '/no-image.png'}
                      alt={blog.title}
                      className="w-24 h-16 object-cover rounded-md"
                      onError={(e) => (e.target.src = '/no-image.png')}
                    />
                    <div>
                      <h3 className="font-semibold">{blog.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {blog.date} | {blog.status}
                      </p>
                      <p className="text-gray-600 text-xs">
                        By: Admin
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.blog_id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Admin Blogs Pagination */}
            {adminTotalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setAdminPage((p) => Math.max(1, p - 1))}
                  disabled={adminPage === 1}
                  className={`px-3 py-1 rounded ${adminPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Prev
                </button>
                {[...Array(adminTotalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAdminPage(idx + 1)}
                    className={`px-3 py-1 rounded ${adminPage === idx + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setAdminPage((p) => Math.min(adminTotalPages, p + 1))}
                  disabled={adminPage === adminTotalPages}
                  className={`px-3 py-1 rounded ${adminPage === adminTotalPages ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* User Blogs Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">User Blogs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : userBlogs.length === 0 ? (
          <p className="text-gray-500">No user blogs found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {userBlogsToShow.map((blog) => (
                <div
                  key={blog.blog_id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedBlog(blog); setShowBlogModal(true); }}>
                    <img
                      src={blog.image_url || '/no-image.png'}
                      alt={blog.title}
                      className="w-24 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{blog.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {blog.date} | {blog.status}
                      </p>
                      <p className="text-gray-600 text-xs">
                        By: {blog.user_fname && blog.user_lname
                          ? `${blog.user_fname} ${blog.user_lname}`
                          : (blog.user_fname || 'User')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(blog.blog_id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* User Blogs Pagination */}
            {userTotalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className={`px-3 py-1 rounded ${userPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Prev
                </button>
                {[...Array(userTotalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setUserPage(idx + 1)}
                    className={`px-3 py-1 rounded ${userPage === idx + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                  disabled={userPage === userTotalPages}
                  className={`px-3 py-1 rounded ${userPage === userTotalPages ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {/* Blog Modal */}
        {showBlogModal && selectedBlog && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setShowBlogModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-4 text-center break-words">{selectedBlog.title}</h2>
              <img
                src={selectedBlog.image_url || '/no-image.png'}
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-md mb-6 border"
                onError={(e) => (e.target.src = '/no-image.png')}
              />
              <div className="mb-4 max-h-60 overflow-y-auto px-1">
                <p className="text-gray-700 whitespace-pre-line text-lg">{selectedBlog.content}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-gray-500 text-sm border-t pt-3 mt-4">
                <span>{selectedBlog.date} | {selectedBlog.status}</span>
                <span>{new Date(`1970-01-01T${selectedBlog.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>By: {selectedBlog.user_fname && selectedBlog.user_lname
                  ? `${selectedBlog.user_fname} ${selectedBlog.user_lname}`
                  : (selectedBlog.user_fname || 'Admin')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;