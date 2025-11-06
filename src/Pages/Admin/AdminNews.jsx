import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

const AdminNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    is_published: true,
  });
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 5;

  const token = localStorage.getItem('access_token'); 

  useEffect(() => {
    fetchNewsList();
  }, []);

  const fetchNewsList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/news/admin/list/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data = await response.json();
      setNewsList(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching news articles');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('is_published', formData.is_published ? 'true' : 'false');
    // Set admin_id and user_id automatically from localStorage (or AuthContext)
    const adminId = localStorage.getItem('admin_id');
    const userId = localStorage.getItem('user_id');
    if (adminId) data.append('admin_id', adminId);
    if (userId) data.append('user_id', userId);

    try {
      const url = editingNewsId
        ? `http://localhost:8000/api/news/admin/${editingNewsId}/update/`
        : 'http://localhost:8000/api/news/admin/add/';
      const method = editingNewsId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        fetchNewsList();
        resetForm();
        alert(editingNewsId ? 'News updated successfully' : 'News created successfully');
      } else {
        setError(result.errors ? JSON.stringify(result.errors) : (result.message || 'Failed to save news'));
      }
    } catch (err) {
      setError('Error saving news article');
    }
  };

  const handleEdit = (news) => {
    setFormData({
      title: news.title,
      content: news.content,
      image: null,
      is_published: news.is_published,
    });
    setEditingNewsId(news.news_id);
    setImagePreview(news.image ? `http://localhost:8000${news.image}` : null);
  };

  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/news/admin/${newsId}/delete/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchNewsList();
        alert('News deleted successfully');
      } else {
        const result = await response.json();
        setError(result.errors ? JSON.stringify(result.errors) : (result.message || 'Failed to delete news'));
      }
    } catch (err) {
      setError('Error deleting news article');
    }
  };

  const handleTogglePublish = async (newsId, isPublished) => {
    try {
      const response = await fetch(`http://localhost:8000/api/news/admin/${newsId}/update/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_published: !isPublished }),
      });

      if (response.ok) {
        fetchNewsList();
        alert(`News ${isPublished ? 'unpublished' : 'published'} successfully`);
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to toggle publish status');
      }
    } catch (err) {
      setError('Error toggling publish status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      image: null,
      is_published: true,
    });
    setEditingNewsId(null);
    setImagePreview(null);
  };

  // Automatically clear error after 7 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Filtered news based on search
  const filteredNewsList = newsList.filter(
    (news) =>
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic for filtered news
  const totalPages = Math.ceil(filteredNewsList.length / newsPerPage);
  const newsToShow = filteredNewsList.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Admin News Management
      </h1>
      {/* News Search Bar */}
      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          placeholder="Search news by title or content..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
            setCurrentPage(1);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {editingNewsId ? 'Edit News Article' : 'Create New Article'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-800">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              maxLength="200"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-800">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="6"
              required
              maxLength="10000"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-800">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-48 h-32 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="h-4 w-4"
              />
              Publish Immediately
            </label>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#1B7B19] hover:bg-green-800 text-white px-6 py-2 rounded-md transition-colors"
            >
              {editingNewsId ? 'Update Article' : 'Create Article'}
            </button>
            {editingNewsId && (
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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">News Articles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : filteredNewsList.length === 0 ? (
          <p className="text-gray-500">No news articles found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {newsToShow.map((news) => (
                <div
                  key={news.news_id}
                  className="flex items-center justify-between border-b py-4"
                >
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedNews(news); setShowNewsModal(true); }}>
                    <img
                      src={
                        news.image
                          ? `http://localhost:8000${news.image}`
                          : '/no-image.png'
                      }
                      alt={news.title}
                      className="w-24 h-16 object-cover rounded-md"
                      
                    />
                    <div>
                      <h3 className="font-semibold">{news.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {new Date(news.created_at).toDateString()} |{' '}
                        {news.is_published ? 'Published' : 'Unpublished'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(news)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleTogglePublish(news.news_id, news.is_published)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                      title={news.is_published ? 'Unpublish' : 'Publish'}
                    >
                      {news.is_published ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={() => handleDelete(news.news_id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        {/* News Modal */}
        {showNewsModal && selectedNews && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                onClick={() => setShowNewsModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-4 text-center break-words">{selectedNews.title}</h2>
              <img
                src={selectedNews.image ? `http://localhost:8000${selectedNews.image}` : '/no-image.png'}
                alt={selectedNews.title}
                className="w-full h-64 object-cover rounded-md mb-6 border"
                
              />
              <div className="mb-4 max-h-60 overflow-y-auto px-1">
                <p className="text-gray-700 whitespace-pre-line text-lg">{selectedNews.content}</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-gray-500 text-sm border-t pt-3 mt-4">
                <span>{selectedNews.created_at ? new Date(selectedNews.created_at).toDateString() : ''} | {selectedNews.is_published ? 'Published' : 'Unpublished'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNews;