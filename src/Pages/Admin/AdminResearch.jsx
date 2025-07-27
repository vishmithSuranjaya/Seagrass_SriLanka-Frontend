import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const AdminResearch = () => {
  const [researchList, setResearchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', link: '' });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;

  const token = localStorage.getItem('access_token');
  const adminId = localStorage.getItem('admin_id');

  useEffect(() => { fetchResearchArticles(); }, []);

  const fetchResearchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/research/admin/list/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch research articles');
      const data = await response.json();
      setResearchList(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching research articles');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, admin_id: adminId };
    const url = editingId
      ? `http://localhost:8000/api/research/admin/${editingId}/update/`
      : 'http://localhost:8000/api/research/admin/add/';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok) {
        fetchResearchArticles();
        resetForm();
        alert(editingId ? 'Research article updated' : 'Research article created');
      } else {
        setError(result.message || 'Failed to save article');
      }
    } catch (err) {
      setError('Error saving research article');
    }
  };

  const handleEdit = (article) => {
    setFormData({ title: article.title, description: article.description, link: article.link });
    setEditingId(article.research_id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/research/admin/${id}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchResearchArticles();
        alert('Research article deleted');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to delete article');
      }
    } catch (err) {
      setError('Error deleting research article');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', link: '' });
    setEditingId(null);
  };

  const filteredResearch = researchList.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredResearch.length / articlesPerPage);
  const currentArticles = filteredResearch.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Admin Research Article Management
      </h1>

      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md"
        />
        <button
          onClick={() => { setSearchTerm(searchInput); setCurrentPage(1); }}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >Search</button>
        <button
          onClick={() => { setSearchInput(''); setSearchTerm(''); setCurrentPage(1); }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >Clear</button>
      </div>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Edit Article' : 'Create New Article'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="w-full px-4 py-2 border rounded-md" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full px-4 py-2 border rounded-md" required rows="4" />
          <input type="url" name="link" value={formData.link} onChange={handleInputChange} placeholder="Link" className="w-full px-4 py-2 border rounded-md" required />
          <div className="flex gap-4">
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-md">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded-md">Cancel</button>}
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Research Articles</h2>
        {loading ? (
          <p>Loading...</p>
        ) : currentArticles.length === 0 ? (
          <p className="text-gray-500">No research articles found.</p>
        ) : (
          <div className="space-y-4">
            {currentArticles.map((article) => (
              <div key={article.research_id} className="flex justify-between items-center border-b py-4">
                <div onClick={() => { setSelectedResearch(article); setShowModal(true); }} className="cursor-pointer">
                  <h3 className="font-semibold">{article.title}</h3>
                  <p className="text-sm text-gray-600 truncate w-[500px]">{article.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(article)} className="text-blue-600"><Pencil size={20} /></button>
                  <button onClick={() => handleDelete(article.research_id)} className="text-red-600"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button 
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
            >Prev</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                 key={idx}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >{idx + 1}</button>
            ))}
            <button 
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
            >Next</button>
          </div>
        )}
      </div>

      {showModal && selectedResearch && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(6px)' }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">{selectedResearch.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedResearch.description}</p>
            <a href={selectedResearch.link} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">View Full Article</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResearch;
