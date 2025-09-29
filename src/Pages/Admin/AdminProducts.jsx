import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    images: [], // new files
  });
  const [existingImageUrls, setExistingImageUrls] = useState([]); // server images
  const [imagePreviews, setImagePreviews] = useState([]); // selected file previews
  const [editingId, setEditingId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("access_token");
  const adminId = localStorage.getItem("admin_id");

  useEffect(() => {
    fetchProducts();
    return () => {
      imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
    };
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/products/admin/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError("Error fetching products");
      setTimeout(() => setError(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/150?text=No+Image";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `http://localhost:8000${img}`;
    return `http://localhost:8000/media/${img}`;
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const fileList = files ? Array.from(files) : [];
      imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
      setFormData((p) => ({ ...p, images: fileList }));
      setImagePreviews(fileList.map((f) => URL.createObjectURL(f)));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const handleResetImages = () => {
    imagePreviews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
    setFormData((p) => ({ ...p, images: [] }));
    setImagePreviews([]);
    setExistingImageUrls([]);
    const fileInput = document.getElementById("image-input");
    if (fileInput) fileInput.value = "";
  };

  const resetForm = () => {
    handleResetImages();
    setFormData({ title: "", description: "", price: "", images: [] });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.description?.trim() || !formData.price) {
      setError("Please fill title, description and price.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    if (!editingId && formData.images.length === 0) {
      setError("At least one image is required.");
      setTimeout(() => setError(null), 4000);
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("admin_id", adminId || "");

    // append new images
    formData.images.forEach((f) => payload.append("images", f));

    // signal clear images if existing ones were removed
    if (existingImageUrls.length === 0) {
      payload.append("clear_images", "true");
    }

    const url = editingId
      ? `http://localhost:8000/api/products/admin/${editingId}/update/`
      : "http://localhost:8000/api/products/admin/add/";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: payload,
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(result.message || "Failed to save product");
        setTimeout(() => setError(null), 4000);
        return;
      }
      await fetchProducts();
      resetForm();
      alert(editingId ? "Product updated" : "Product created");
    } catch (err) {
      console.error(err);
      setError("Error saving product");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      images: [],
    });
    const urls = (product.images || []).map((img) => getImageUrl(img.image || img));
    setExistingImageUrls(urls);
    setImagePreviews([]);
    setEditingId(product.product_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/products/admin/${productId}/delete/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.message || "Failed to delete product");
        setTimeout(() => setError(null), 4000);
        return;
      }
      await fetchProducts();
      alert("Product deleted");
    } catch (err) {
      console.error(err);
      setError("Error deleting product");
      setTimeout(() => setError(null), 4000);
    }
  };

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (p.title || "").toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term);
  });
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Admin Product Management</h1>

      {/* Search */}
      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border rounded-md"
        />
        <button onClick={() => { setSearchTerm(searchInput); setCurrentPage(1); }} className="bg-green-600 text-white px-4 py-2 rounded-md">Search</button>
        <button onClick={() => { setSearchInput(""); setSearchTerm(""); setCurrentPage(1); }} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Clear</button>
      </div>

      {/* Form */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">{editingId ? "Edit Product" : "Create New Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="w-full px-4 py-2 border rounded-md" required />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full px-4 py-2 border rounded-md" rows={4} required />
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" className="w-full px-4 py-2 border rounded-md" step="0.01" required />

          <div className="flex items-center gap-4">
            <input id="image-input" type="file" name="images" accept="image/*" multiple onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
            {(formData.images.length > 0 || existingImageUrls.length > 0) && (
              <button type="button" onClick={handleResetImages} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md">Clear</button>
            )}
          </div>

          {/* Previews */}
          {imagePreviews.length > 0 ? (
            <div className="flex gap-2 flex-wrap mt-2">{imagePreviews.map((src, idx) => (<img key={idx} src={src} alt={`Preview ${idx}`} className="w-28 h-28 object-cover rounded" />))}</div>
          ) : existingImageUrls.length > 0 ? (
            <div className="flex gap-2 flex-wrap mt-2">{existingImageUrls.map((src, idx) => (<img key={idx} src={src} alt={`Existing ${idx}`} className="w-28 h-28 object-cover rounded" />))}</div>
          ) : null}

          <div className="flex gap-4">
            <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded-md">{editingId ? "Update" : "Create"}</button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-6 py-2 rounded-md">Cancel</button>}
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>

      {/* Products list */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        {loading ? <p>Loading...</p> : currentProducts.length === 0 ? <p className="text-gray-500">No products found.</p> : (
          <div className="space-y-4">
            {currentProducts.map((product) => (
              <div key={product.product_id} className="flex justify-between items-center border-b py-4">
                <div onClick={() => openProductModal(product)} className="cursor-pointer flex items-center gap-4">
                  {product.images && product.images.length > 0 ? (
                    <img src={getImageUrl(product.images[0].image || product.images[0])} alt={product.title} className="w-16 h-16 object-cover rounded" />
                  ) : <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">No Image</div>}
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-600 truncate w-[500px]">{product.description}</p>
                    <p className="text-green-700 font-bold">Rs. {product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-blue-600" title="Edit"><Pencil size={20} /></button>
                  <button onClick={() => handleDelete(product.product_id)} className="text-red-600" title="Delete"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>Prev</button>
            {[...Array(totalPages)].map((_, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx + 1)} className={`px-3 py-1 rounded ${currentPage === idx + 1 ? "bg-green-600 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>{idx + 1}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>Next</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(6px)" }}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <div className="mb-4">
              <div className="flex gap-2 overflow-x-auto mb-4">
                {selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images.map((img, i) => (
                  <img key={i} src={getImageUrl(img.image || img)} alt={`img-${i}`} className="w-40 h-28 object-cover rounded" />
                )) : <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">No images</div>}
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{selectedProduct.description}</p>
            <p className="text-green-700 font-bold mb-4">Rs. {selectedProduct.price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
