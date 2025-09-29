import React, { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../../components/Login_Register/AuthContext';

const AdminSettings = () => {
  const [admin, setAdmin] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch admin profile');
      const data = await res.json();
      setAdmin(data);
      setFirstName(data.fname || '');
      setLastName(data.lname || '');
      setImageUrl(data.image || '');
      setImageFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch {
      setError('Failed to load profile.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('fname', firstName);
      formData.append('lname', lastName);
      if (imageFile) formData.append('image', imageFile);

      const res = await fetch(`http://localhost:8000/api/auth/profile/update/${admin.user_id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update profile');

      window.location.reload();
      alert('Profile updated successfully!');
    } catch {
      setError('Update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) return;

    try {
      const res = await fetch('http://localhost:8000/api/auth/profile/image/delete/', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete image');

      setImageUrl('');
      setImageFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = null;
      alert('Profile image deleted successfully!');
    } catch {
      alert('Error deleting profile image.');
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account?')) return;

    try {
      const res = await fetch(`http://localhost:8000/api/auth/admin/${admin.user_id}/toggle-active/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: false }),
      });
      if (!res.ok) throw new Error();
      alert('Account deactivated. Logging out...');
      logout();
    } catch {
      alert('Error deactivating account.');
    }
  };

  if (!admin) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-center text-green-700 mb-6">Admin Settings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-semibold">First Name</label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border px-4 py-2 rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold">Last Name</label>
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border px-4 py-2 rounded mt-1"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold">Profile Picture</label>
        {(previewUrl || imageUrl) ? (
          <img
            src={previewUrl || imageUrl}
            alt="Profile"
            className="mt-2 w-24 h-24 object-cover rounded-full border"
            onError={(e) => (e.target.src = '/no-image.png')}
          />
        ) : (
          <p className="text-gray-500 mt-2">No profile picture uploaded</p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
          >
            Choose File
          </button>
          {imageFile && <span className="text-sm text-gray-700">{imageFile.name}</span>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {imageUrl && (
          <button
            onClick={handleDeleteImage}
            className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Image
          </button>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mt-2"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {!admin.is_superuser && (
        <>
          <hr className="my-6"/>
          <button
            onClick={handleDeactivate}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          >
            Deactivate Account
          </button>
        </>
      )}
    </div>
  );
};

export default AdminSettings;
