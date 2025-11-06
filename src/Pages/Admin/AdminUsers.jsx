import React, { useEffect, useState } from 'react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDeactivatedAdmins, setShowDeactivatedAdmins] = useState(false);
  const [showDeactivatedUsers, setShowDeactivatedUsers] = useState(false);
  // Confirmation dialog state
  const [confirmAction, setConfirmAction] = useState(null); // { type, user, payload }
  
  // Pagination state
  const [adminPage, setAdminPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const usersPerPage = 5;

  const token = localStorage.getItem('access_token');

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/auth/admin/all/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data || []);
    } catch (err) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch current user');
      const data = await response.json();
      setCurrentUser(data);
    } catch {
      setCurrentUser(null);
    }
  };

  // Helper to fetch a single user by ID
  const fetchUserById = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/get_user/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      return data;
    } catch {
      return null;
    }
  };

  // Logout helper (clear token and redirect)
  const logout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/login'; // Change if your login route is different
  };


  // Confirmed handler for toggling active status
  const handleToggleActiveUser = async (userId, isActive) => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/admin/${userId}/toggle-active/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !isActive }),
      });
      if (!response.ok) throw new Error('Failed to update user active status');

      const updatedUser = await fetchUserById(userId);
      if (updatedUser) {
        setSelectedUser(updatedUser);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === userId ? updatedUser : user))
        );
      } else {
        // fallback optimistic update
        setSelectedUser((prev) => (prev && prev.user_id === userId ? { ...prev, is_active: !isActive } : prev));
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === userId ? { ...user, is_active: !isActive } : user))
        );
      }
    } catch (err) {
      alert(`Error updating user active status: ${err.message}`);
      setError('Error updating user active status');
    } finally {
      setShowUserModal(false);
      setConfirmAction(null);
    }
  };


  // Confirmed handler for toggling admin status
  const handleToggleAdmin = async (userId, isStaff) => {
    try {
      const response = await fetch(`http://localhost:8000/api/auth/admin/${userId}/update/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_staff: !isStaff }),
      });
      if (!response.ok) throw new Error('Failed to update admin status');

      const updatedUser = await fetchUserById(userId);
      if (updatedUser) {
        setSelectedUser(updatedUser);
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === userId ? updatedUser : user))
        );

        // If current user removed their own admin rights, log out immediately
        if (currentUser?.user_id === userId && isStaff) {
          alert('You removed your own admin privileges and will be logged out.');
          logout();
        }
      } else {
        // fallback optimistic update
        setSelectedUser((prev) => (prev && prev.user_id === userId ? { ...prev, is_staff: !isStaff } : prev));
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.user_id === userId ? { ...user, is_staff: !isStaff } : user))
        );

        if (currentUser?.user_id === userId && isStaff) {
          alert('You removed your own admin privileges and will be logged out.');
          logout();
        }
      }
    } catch (err) {
      alert(`Error updating admin status: ${err.message}`);
      setError('Error updating admin status');
    } finally {
      setShowUserModal(false);
      setConfirmAction(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeAdmins = filteredUsers.filter((u) => u.is_staff && u.is_active);
  const deactivatedAdmins = filteredUsers.filter((u) => u.is_staff && !u.is_active);
  const adminsToShow = showDeactivatedAdmins ? deactivatedAdmins : activeAdmins;

  const activeUsers = filteredUsers.filter((u) => !u.is_staff && u.is_active);
  const deactivatedUsers = filteredUsers.filter((u) => !u.is_staff && !u.is_active);
  const usersToShow = showDeactivatedUsers ? deactivatedUsers : activeUsers;

  // Pagination logic for admins
  const adminTotalPages = Math.ceil(adminsToShow.length / usersPerPage);
  const adminsToDisplay = adminsToShow.slice((adminPage - 1) * usersPerPage, adminPage * usersPerPage);

  // Pagination logic for users
  const userTotalPages = Math.ceil(usersToShow.length / usersPerPage);
  const usersToDisplay = usersToShow.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">Admin User Management</h1>

      <div className="flex justify-center mb-8 gap-2">
        <input
          type="text"
          placeholder="Search users by name or email..."
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
            setSearchInput('');
            setSearchTerm('');
            setAdminPage(1);
            setUserPage(1);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>

      {/* Admins Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Admins</h2>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              (showDeactivatedAdmins ? activeAdmins.length === 0 : deactivatedAdmins.length === 0)
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={() => {
              setShowDeactivatedAdmins((prev) => !prev);
              setAdminPage(1);
            }}
            disabled={showDeactivatedAdmins ? activeAdmins.length === 0 : deactivatedAdmins.length === 0}
          >
            {showDeactivatedAdmins ? 'Show Active Admins' : 'Show Deactivated Admins'}
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : adminsToShow.length === 0 ? (
          <p className="text-gray-500">{showDeactivatedAdmins ? 'No deactivated admins found.' : 'No active admins found.'}</p>
        ) : (
          <>
            <div className="space-y-4">
              {adminsToDisplay.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-4 border-b py-4 cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                >
                  <img
                    src={user.image}
                    alt={user.full_name}
                    className="w-16 h-16 object-cover rounded-full"
                    
                  />
                  <div>
                    <h3 className="font-semibold">{user.full_name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    {user.is_superuser && <p className="text-purple-700 text-xs font-bold">Website Owner</p>}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Admin Pagination */}
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

      {/* Users Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              (showDeactivatedUsers ? activeUsers.length === 0 : deactivatedUsers.length === 0)
                ? 'bg-orange-300 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            onClick={() => {
              setShowDeactivatedUsers((prev) => !prev);
              setUserPage(1);
            }}
            disabled={showDeactivatedUsers ? activeUsers.length === 0 : deactivatedUsers.length === 0}
          >
            {showDeactivatedUsers ? 'Show Active Users' : 'Show Deactivated Users'}
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : usersToShow.length === 0 ? (
          <p className="text-gray-500">{showDeactivatedUsers ? 'No deactivated users found.' : 'No active users found.'}</p>
        ) : (
          <>
            <div className="space-y-4">
              {usersToDisplay.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center gap-4 border-b py-4 cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowUserModal(true);
                  }}
                >
                  <img
                    src={user.image}
                    alt={user.full_name}
                    className="w-16 h-16 object-cover rounded-full"
                    
                  />
                  <div>
                    <h3 className="font-semibold">{user.full_name}</h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* User Pagination */}
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
      </div>

      {/* User Modal */}
      {showUserModal && selectedUser && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backdropFilter: 'blur(6px)' }}
        >
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowUserModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedUser.image}
                alt={selectedUser.full_name}
                className="w-24 h-24 object-cover rounded-full mb-2 border"
                
              />
              <h2 className="text-2xl font-bold mb-2 text-center break-words">{selectedUser.full_name}</h2>
              <p className="text-gray-600 text-sm">{selectedUser.email}</p>
              {selectedUser.is_superuser ? (
                <span className="text-purple-700 text-xs font-bold">Website Owner</span>
              ) : selectedUser.is_staff ? (
                <span className="text-green-700 text-xs font-bold">Admin</span>
              ) : null}
            </div>
            <div className="text-gray-700 text-sm space-y-2">
              <p>
                <strong>User ID:</strong> {selectedUser.user_id}
              </p>
              <p>
                <strong>Date Joined:</strong> {new Date(selectedUser.date_joined).toLocaleString()}
              </p>
              <p>
                <strong>Last Login:</strong>{' '}
                {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never logged in'}
              </p>
              <div className="flex gap-2 mt-4 flex-wrap">

                {!selectedUser.is_superuser &&
                  !(
                    // Prevent is_staff but not superuser from seeing "Deactivate Admin"
                    selectedUser.is_staff &&
                    currentUser?.is_staff &&
                    !currentUser?.is_superuser
                  ) && (
                    <button
                      onClick={() => setConfirmAction({
                        type: 'toggle-active',
                        user: selectedUser,
                        payload: { userId: selectedUser.user_id, isActive: selectedUser.is_active }
                      })}
                      className={`px-4 py-2 rounded-md ${
                        selectedUser.is_active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                      disabled={currentUser?.user_id === selectedUser.user_id}
                      title={currentUser?.user_id === selectedUser.user_id ? "You can't deactivate yourself from here" : ''}
                    >
                      {selectedUser.is_active ?
                        selectedUser.is_staff
                          ? 'Deactivate Admin'
                          : 'Deactivate User'
                        : selectedUser.is_staff
                          ? 'Activate Admin'
                          : 'Activate User'}
                    </button>
                  )}

                {currentUser?.is_superuser && !selectedUser.is_superuser && (
                  <button
                    onClick={() => setConfirmAction({
                      type: 'toggle-admin',
                      user: selectedUser,
                      payload: { userId: selectedUser.user_id, isStaff: selectedUser.is_staff }
                    })}
                    className={`bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-md ${
                      selectedUser.is_active ? '' : 'opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!selectedUser.is_active || currentUser?.user_id === selectedUser.user_id}
                    title={currentUser?.user_id === selectedUser.user_id ? "You can't remove your own admin privileges here" : ''}
                  >
                    {selectedUser.is_staff ? 'Remove Admin' : 'Make Admin'}
                  </button>
                )}
      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(6px)' }}>
          <div className="bg-white rounded-lg p-8 max-w-sm w-full relative shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center">Confirm Action</h2>
            <p className="mb-6 text-center">
              {confirmAction.type === 'toggle-active' && (
                confirmAction.payload.isActive
                  ? confirmAction.user.is_staff
                    ? 'Are you sure you want to deactivate this admin?'
                    : 'Are you sure you want to deactivate this user?'
                  : confirmAction.user.is_staff
                    ? 'Are you sure you want to activate this admin?'
                    : 'Are you sure you want to activate this user?'
              )}
              {confirmAction.type === 'toggle-admin' && (
                confirmAction.payload.isStaff
                  ? 'Are you sure you want to remove admin privileges from this user?'
                  : 'Are you sure you want to make this user an admin?'
              )}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                onClick={async () => {
                  if (confirmAction.type === 'toggle-active') {
                    await handleToggleActiveUser(confirmAction.payload.userId, confirmAction.payload.isActive);
                  } else if (confirmAction.type === 'toggle-admin') {
                    await handleToggleAdmin(confirmAction.payload.userId, confirmAction.payload.isStaff);
                  }
                  setConfirmAction(null);
                  setShowUserModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                onClick={() => setConfirmAction(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;