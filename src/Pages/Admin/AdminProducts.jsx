import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign, X, Save, Eye, EyeOff, ShoppingCart, Image } from 'lucide-react';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate fetching products from API
    const mockProducts = [
      {
        product_id: 'PROD001',
        title: 'Official T-Shirt',
        description: 'High-quality cotton t-shirt with official logo',
        price: 25.99,
        image: null,
        admin_id: 'ADMIN001'
      },
      {
        product_id: 'PROD002',
        title: 'Coffee Mug',
        description: 'Ceramic coffee mug with premium finish',
        price: 12.50,
        image: null,
        admin_id: 'ADMIN001'
      },
      {
        product_id: 'PROD003',
        title: 'Laptop Sticker Pack',
        description: 'Set of 10 premium vinyl stickers',
        price: 8.99,
        image: null,
        admin_id: 'ADMIN001'
      },
      {
        product_id: 'PROD004',
        title: 'Branded Cap',
        description: 'Adjustable cap with embroidered logo',
        price: 18.75,
        image: null,
        admin_id: 'ADMIN001'
      }
    ];
    setProducts(mockProducts);
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.product_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = priceFilter === 'all' ||
                        (priceFilter === 'low' && product.price < 15) ||
                        (priceFilter === 'medium' && product.price >= 15 && product.price < 30) ||
                        (priceFilter === 'high' && product.price >= 30);
    
    return matchesSearch && matchesPrice;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + parseFloat(product.price), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
              <p className="text-gray-600 mt-2">Manage your merchandise and products</p>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <Package size={24} className="text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600">Total Products</p>
                  <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-green-600" />
                <div>
                  <p className="text-sm text-green-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-900">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart size={24} className="text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600">Avg Price</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products by name, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under $15</option>
                <option value="medium">$15 - $30</option>
                <option value="high">Over $30</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products match your filters</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Start by adding your first product</p>
            <button
              onClick={handleAddProduct}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          product={null}
          onSave={(productData) => {
            // Add product logic here
            const newProductId = `PROD${(products.length + 1).toString().padStart(3, '0')}`;
            const newProduct = {
              ...productData,
              product_id: newProductId,
              admin_id: 'ADMIN001' // Replace with actual admin ID
            };
            setProducts([...products, newProduct]);
            setShowAddModal(false);
          }}
          title="Add New Product"
        />
      )}

      {showEditModal && (
        <ProductModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          product={selectedProduct}
          onSave={(productData) => {
            // Update product logic here
            setProducts(products.map(p => 
              p.product_id === selectedProduct.product_id 
                ? { ...selectedProduct, ...productData }
                : p
            ));
            setShowEditModal(false);
          }}
          title="Edit Product"
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          product={selectedProduct}
          onConfirm={() => {
            // Delete product logic here
            setProducts(products.filter(p => p.product_id !== selectedProduct?.product_id));
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-w-16 aspect-h-12 bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <Image size={48} className="text-gray-400" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-green-600 ml-2">
            ${product.price}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">ID: {product.product_id}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-xs text-gray-500">
            Admin: {product.admin_id}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit product"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete product"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({ isOpen, onClose, product, onSave, title }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: ''
      });
    }
    setErrors({});
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    } else if (parseFloat(formData.price) > 99999999.99) {
      newErrors.price = 'Price is too high';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price)
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              maxLength={200}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.description.length}/200 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="99999999.99"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Image size={16} className="text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Image upload functionality will be implemented with backend integration
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save size={16} />
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({ isOpen, onClose, product, onConfirm }) {
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
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this product?
            </p>
            <div className="text-sm text-gray-700">
              <p><span className="font-medium">Product:</span> {product?.title}</p>
              <p><span className="font-medium">ID:</span> {product?.product_id}</p>
              <p><span className="font-medium">Price:</span> ${product?.price}</p>
            </div>
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
              Delete Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;