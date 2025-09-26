import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

const AdminGallery = () => {
  const [galleryList, setGalleryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    caption: '',
    image: null,
  });
  const [editingImageId, setEditingImageId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [popupImage, setPopupImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  // Helper to get image URL (handles relative, absolute, and error fallback)
  const getImageUrl = (img) => {
    if (!img) return '';
    if (imageErrors[img.image_id]) {
      return 'https://via.placeholder.com/400x400?text=Image+Not+Available';
    }
    if (img.image?.startsWith('http://') || img.image?.startsWith('https://')) {
      return img.image;
    }
    if (img.image?.startsWith('/')) {
      return `http://localhost:8000${img.image}`;
    }
    if (img.image) {
      return `http://localhost:8000/media/${img.image}`;
    }
    return 'https://via.placeholder.com/400x400?text=No+Image';
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6;

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchGalleryList();
  }, []);

  const fetchGalleryList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/core/admin/gallery/my-images/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch gallery');
      const data = await response.json();
      setGalleryList(data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching gallery images');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, caption: e.target.value });
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
    if (!formData.caption) return setError('Caption is required');
    if (!editingImageId && !formData.image) return setError('Please select an image to upload.');

    const data = new FormData();
    data.append('caption', formData.caption);
    if (formData.image) data.append('image', formData.image);

    try {
      const url = editingImageId
        ? `http://localhost:8000/api/core/admin/gallery/${editingImageId}/update/`
        : 'http://localhost:8000/api/core/admin/gallery/upload/';
      const method = editingImageId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        fetchGalleryList();
        resetForm();
        alert(editingImageId ? 'Image updated successfully' : 'Image added successfully');
      } else {
        setError(result.details ? JSON.stringify(result.details) : (result.error || result.message || 'Failed to save image'));
      }
    } catch {
      setError('Error saving gallery image');
    }
  };

  const handleEdit = (image) => {
    setFormData({ caption: image.caption, image: null });
    setEditingImageId(image.image_id);
    setImagePreview(image.image ? `http://localhost:8000${image.image}` : null);
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/core/admin/gallery/${imageId}/delete/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchGalleryList();
        alert('Image deleted successfully');
      } else {
        const result = await response.json();
        setError(result.details ? JSON.stringify(result.details) : (result.error || result.message || 'Failed to delete image'));
      }
    } catch {
      setError('Error deleting gallery image');
    }
  };

  const resetForm = () => {
    setFormData({ caption: '', image: null });
    setEditingImageId(null);
    setImagePreview(null);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Filter & paginate
  const filteredList = galleryList.filter(g => g.caption.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.ceil(filteredList.length / imagesPerPage);
  const imagesToShow = filteredList.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Admin Gallery Management
      </h1>

      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          placeholder="Search images by caption..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={() => { setSearchTerm(searchInput); setCurrentPage(1); }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={() => { setSearchInput(""); setSearchTerm(""); setCurrentPage(1); }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{editingImageId ? 'Edit Image' : 'Add New Image'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-800">Caption</label>
            <input
              type="text"
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              maxLength="100"
            />
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
                onClick={() => {
                  setFormData((prev) => ({ ...prev, image: null }));
                  setImagePreview(null);
                  if (document.querySelector('input[name=image]')) document.querySelector('input[name=image]').value = '';
                }}
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
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#1B7B19] hover:bg-green-800 text-white px-6 py-2 rounded-md transition-colors"
            >
              {editingImageId ? 'Update Image' : 'Add Image'}
            </button>
            {editingImageId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Gallery Images</h2>
        {loading ? <p>Loading...</p> : filteredList.length === 0 ? (
          <p className="text-gray-500">No images found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagesToShow.map((img) => (
                <div key={img.image_id} className="border rounded-lg overflow-hidden relative cursor-pointer" onClick={() => setPopupImage(img)}>
                  <img
                    src={getImageUrl(img)}
                    alt={img.caption}
                    className="w-full h-48 object-cover"
                    onError={() => handleImageError(img.image_id)}
                  />
                  <div className="p-2 flex justify-between items-center bg-white" onClick={e => e.stopPropagation()}>
                    <span className="text-gray-700 font-medium">{img.caption}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(img)} className="text-blue-600 hover:text-blue-800">
                        <Pencil size={20} />
                      </button>
                      <button onClick={() => handleDelete(img.image_id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      {/* Popup View */}
      {popupImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="relative max-w-auto bg-white rounded-2xl shadow-2xl p-4 border border-gray-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPopupImage(null)}
              aria-label="Close popup"
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center 
             rounded-full bg-red-500 text-white text-2xl font-bold 
             hover:bg-red-600 active:bg-red-700 
             shadow-lg transition-all cursor-pointer"
            >
              &times;
            </button>

            <div className="rounded-lg overflow-hidden mb-4 h-[550px]">
              <img
                src={getImageUrl(popupImage)}
                alt={popupImage.caption}
                className="w-full h-full object-cover"
                onError={() => handleImageError(popupImage.image_id)}
              />
            </div>

            {popupImage.caption && (
              <p className="text-center text-sm text-gray-600 mt-2 px-2 truncate">
                {popupImage.caption}
              </p>
            )}
          </div>
        </div>
      )}

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
      </div>
    </div>
  );
};

export default AdminGallery;
