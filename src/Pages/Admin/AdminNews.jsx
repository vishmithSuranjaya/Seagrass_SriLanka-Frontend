import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Clock, User, X, Save, Eye, EyeOff, Image } from 'lucide-react';

function AdminNews() {
  const [news, setNews] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching news from API
    const mockNews = [
      {
        news_id: '1',
        title: 'Revolutionary AI Technology Breakthrough',
        content: 'Scientists have made a groundbreaking discovery in artificial intelligence that could transform how we interact with technology. This new development promises to revolutionize various industries including healthcare, education, and transportation. The research team spent over three years developing this innovative approach that combines machine learning with quantum computing principles.',
        created_at: '2024-06-20T10:30:00Z',
        updated_at: '2024-06-21T14:15:00Z',
        image: null,
        admin_id: 'admin123',
        is_published: true
      },
      {
        news_id: '2',
        title: 'Local Community Wins Environmental Award',
        content: 'The Kalutara community has been recognized with a prestigious environmental conservation award for their outstanding efforts in sustainable development and green initiatives. The award ceremony took place last week, highlighting the community\'s dedication to preserving natural resources and promoting eco-friendly practices.',
        created_at: '2024-06-18T16:45:00Z',
        updated_at: '2024-06-18T16:45:00Z',
        image: null,
        admin_id: 'admin456',
        is_published: false
      },
      {
        news_id: '3',
        title: 'New Digital Infrastructure Project Launched',
        content: 'A major digital infrastructure project has been launched to improve connectivity and digital services across the region. This initiative aims to bridge the digital divide and provide better access to online resources for all citizens.',
        created_at: '2024-06-15T09:20:00Z',
        updated_at: '2024-06-19T11:30:00Z',
        image: null,
        admin_id: 'admin123',
        is_published: true
      }
    ];
    setNews(mockNews);
  }, []);

  const handleAddNews = () => {
    setSelectedNews(null);
    setShowAddModal(true);
  };

  const handleEditNews = (newsItem) => {
    setSelectedNews(newsItem);
    setShowEditModal(true);
  };

  const handleDeleteNews = (newsItem) => {
    setSelectedNews(newsItem);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage news articles</p>
            </div>
            <button
              onClick={handleAddNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Article
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-3xl font-bold text-gray-900">{news.length}</p>
              </div>
              <FileText size={32} className="text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">{news.filter(n => n.is_published).length}</p>
              </div>
              <Eye size={32} className="text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-3xl font-bold text-orange-600">{news.filter(n => !n.is_published).length}</p>
              </div>
              <EyeOff size={32} className="text-orange-600" />
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Articles</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {news.map((newsItem) => (
              <NewsItem
                key={newsItem.news_id}
                news={newsItem}
                onEdit={handleEditNews}
                onDelete={handleDeleteNews}
                formatDate={formatDate}
                truncateContent={truncateContent}
              />
            ))}
          </div>
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">Start by creating your first news article</p>
            <button
              onClick={handleAddNews}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Article
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <NewsModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          news={null}
          onSave={(newsData) => {
            // Add news logic here
            console.log('Adding news:', newsData);
            const newNews = {
              ...newsData,
              news_id: Date.now().toString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              admin_id: 'current_admin_id'
            };
            setNews([newNews, ...news]);
            setShowAddModal(false);
          }}
          title="Add New Article"
        />
      )}

      {showEditModal && (
        <NewsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          news={selectedNews}
          onSave={(newsData) => {
            // Update news logic here
            console.log('Updating news:', newsData);
            setNews(news.map(n => 
              n.news_id === selectedNews.news_id 
                ? { ...n, ...newsData, updated_at: new Date().toISOString() }
                : n
            ));
            setShowEditModal(false);
          }}
          title="Edit Article"
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          news={selectedNews}
          onConfirm={() => {
            // Delete news logic here
            console.log('Deleting news:', selectedNews?.news_id);
            setNews(news.filter(n => n.news_id !== selectedNews?.news_id));
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}

// News Item Component
function NewsItem({ news, onEdit, onDelete, formatDate, truncateContent }) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{news.title}</h3>
            <div className="flex items-center gap-2">
              {news.is_published ? (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <Eye size={12} />
                  Published
                </span>
              ) : (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <EyeOff size={12} />
                  Draft
                </span>
              )}
              {news.image && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <Image size={12} />
                  Image
                </span>
              )}
            </div>
          </div>
          
          <p className="text-gray-600 mb-3">{truncateContent(news.content)}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Created: {formatDate(news.created_at)}</span>
            </div>
            {news.updated_at !== news.created_at && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Updated: {formatDate(news.updated_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Admin ID: {news.admin_id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(news)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit article"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(news)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete article"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// News Modal Component
function NewsModal({ isOpen, onClose, news, onSave, title }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    is_published: true
  });

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || '',
        content: news.content || '',
        image: news.image || null,
        is_published: news.is_published ?? true
      });
    } else {
      setFormData({
        title: '',
        content: '',
        image: null,
        is_published: true
      });
    }
  }, [news]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would upload the file to your server
      // For now, we'll just store the file name
      setFormData({ ...formData, image: file.name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter article title (max 200 characters)"
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your article content here (max 2000 characters)"
              maxLength={2000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/2000 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {formData.image && (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Image size={16} />
                  {formData.image}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload an image to accompany your article</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_published" className="ml-2 text-sm font-medium text-gray-700">
              Publish article immediately
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              {news ? 'Update Article' : 'Create Article'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, news, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Article</h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Are you sure you want to delete the article "{news?.title}"?
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNews;