import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const token = localStorage.getItem("access_token");
  const adminId = localStorage.getItem("admin_id");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/products/admin/list/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching products");
      setTimeout(() => setError(null), 4000);
      setLoading(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/150?text=No+Image";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `http://localhost:8000${image}`;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(originalImageUrl || null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleResetImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(originalImageUrl || null);
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("price", formData.price);
    formPayload.append("admin_id", adminId);

    if (formData.image) {
      formPayload.append("image", formData.image);
    } else if (!editingId) {
      setError("Image is required.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    const url = editingId
      ? `http://localhost:8000/api/products/admin/${editingId}/update/`
      : "http://localhost:8000/api/products/admin/add/";
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formPayload,
      });

      const result = await response.json();
      if (response.ok) {
        fetchProducts();
        resetForm();
        alert(editingId ? "Product updated" : "Product created");
      } else {
        setError(result.message || "Failed to save product");
        setTimeout(() => setError(null), 4000);
      }
    } catch (err) {
      setError("Error saving product");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      image: null,
    });
    setEditingId(product.product_id);

    const url = product.image ? getImageUrl(product.image) : null;
    setImagePreview(url);
    setOriginalImageUrl(url);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/products/admin/${id}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        fetchProducts();
        alert("Product deleted");
      } else {
        const result = await response.json();
        setError(result.message || "Failed to delete product");
        setTimeout(() => setError(null), 4000);
      }
    } catch (err) {
      setError("Error deleting product");
      setTimeout(() => setError(null), 4000);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", description: "", price: "", image: null });
    setEditingId(null);
    setImagePreview(null);
    setOriginalImageUrl(null);
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Admin Product Management
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md"
        />
        <button
          onClick={() => {
            setSearchTerm(searchInput);
            setCurrentPage(1);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearchInput("");
            setSearchTerm("");
            setCurrentPage(1);
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>

      {/* Form */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">
          {editingId ? "Edit Product" : "Create New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md"
            rows="4"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-md"
            step="0.01"
            required
          />

          <div className="flex items-center gap-4">
            <input
              id="image-input"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md"
            />
            {(formData.image || editingId) && (
              <button
                type="button"
                onClick={handleResetImage}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-md"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : currentProducts.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <div
                key={product.product_id}
                className="flex justify-between items-center border-b py-4"
              >
                <div
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowModal(true);
                  }}
                  className="cursor-pointer flex items-center gap-4"
                >
                  {product.image && (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-600 truncate w-[500px]">
                      {product.description}
                    </p>
                    <p className="text-green-700 font-bold">${product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600">
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.product_id)}
                    className="text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === idx + 1
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backdropFilter: "blur(6px)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            {selectedProduct.image && (
              <img
                src={getImageUrl(selectedProduct.image)}
                alt={selectedProduct.title}
                className="w-full h-64 object-cover rounded mb-4"
              />
            )}
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {selectedProduct.description}
            </p>
            <p className="text-green-700 font-bold mb-4">
              ${selectedProduct.price}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
