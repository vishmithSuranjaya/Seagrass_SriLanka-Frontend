import React, { useState } from "react";
import { useAuth } from "../Login_Register/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UserSettings = () => {
  const { user, updateUser } = useAuth(); // ✅ now works
  const [fname, setFname] = useState(user?.fname || "");
  const [lname, setLname] = useState(user?.lname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.image || null);
  const [loading, setLoading] = useState(false);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

 
// Update after successful save
const handleProfileUpdate = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);

    // Only append image if the user selected a new one
    if (profileImage) {
      formData.append("image", profileImage);
    }

    const response = await axios.put(
      `http://localhost:8000/api/auth/profile/update/${user.user_id}/`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Profile updated successfully!");
    updateUser(response.data.user);

    if (response.data.user.image) {
      setPreviewImage(response.data.user.image);
    }

  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile.");
  } finally {
    setLoading(false);
  }
};



  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://localhost:8000/api/auth/profile/change_password/${user.user_id}/`,
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        {user?.fname} {user?.lname} 
      </h1>

      {/* Profile Image */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative">
          <img
            src={previewImage || "https://via.placeholder.com/150?text=Profile"}
            alt=""
            className="w-32 h-32 rounded-full object-cover mb-4 border"
          />
          <div
            className="absolute bottom-0 right-0 bg-[#1B7B19] hover:bg-green-800 text-white rounded-full p-2 cursor-pointer shadow-lg transition"
            onClick={() => document.getElementById("profileImageInput").click()}
            title="Change Profile Picture"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <input
          id="profileImageInput"
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="hidden"
        />
        <p className="text-gray-500 mt-2 text-sm">Click to change your profile picture</p>
      </div>

      {/* Profile Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            placeholder="First Name"
            className="border px-4 py-2 rounded-md w-full"
          />
          <input
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            placeholder="Last Name"
            className="border px-4 py-2 rounded-md w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border px-4 py-2 rounded-md w-full"
          />
          <button
            onClick={handleProfileUpdate}
            disabled={loading}
            className="bg-[#1B7B19] hover:bg-green-800 text-white px-6 py-2 rounded-md mt-2"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="flex flex-col gap-4">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="border px-4 py-2 rounded-md w-full"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="border px-4 py-2 rounded-md w-full"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="border px-4 py-2 rounded-md w-full"
          />
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mt-2"
          >
            {loading ? "Saving..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
