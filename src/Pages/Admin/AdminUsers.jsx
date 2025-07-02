import React, { useEffect, useState } from 'react';
import { Edit, Trash2, UserPlus, UserCircle, Mail } from 'lucide-react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetch users (replace with API call)
  useEffect(() => {
    const mockUsers = [
      {
        user_id: 'USR001',
        fname: 'Alice',
        lname: 'Fernando',
        email: 'alice@example.com',
        image: '',
        date_joined: '2024-05-01',
        is_active: true,
      },
      {
        user_id: 'USR002',
        fname: 'Bob',
        lname: 'Perera',
        email: 'bob@example.com',
        image: '',
        date_joined: '2024-08-15',
        is_active: false,
      },
    ];
    setUsers(mockUsers);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <UserPlus size={18} /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-4 py-3">Profile</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-4" colSpan="6">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td className="px-4 py-4" colSpan="6">No users found.</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.user_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {user.image ? (
                          <img src={user.image} alt="User" className="w-10 h-10 rounded-full" />
                        ) : (
                          <UserCircle size={32} className="text-gray-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold">{user.fname} {user.lname}</td>
                      <td className="px-4 py-3 flex items-center gap-2"><Mail size={16} /> {user.email}</td>
                      <td className="px-4 py-3">{user.date_joined}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm px-2 py-1 rounded ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Edit">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
