import React, { useState, useRef } from 'react';
import { IconCamera, IconPencil, IconCheck, IconX, IconCode, IconUser } from '@tabler/icons-react';
import axios from 'axios';

const Profile = () => {
  // Dummy data for existing profile
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    username: '',
    email: 'john.doe@example.com',
    profilePic: null,
    bio: 'Passionate coder and problem solver',
  });

  const [editMode, setEditMode] = useState({
    fullName: false,
    email: false,
    bio: false,
  });

  const [tempValues, setTempValues] = useState({
    fullName: profile.fullName,
    email: profile.email,
    bio: profile.bio,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  // Handle profile picture upload
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profilePic: 'Image size must be less than 2MB' });
        return;
      }
      try {
        const formData = new FormData();
        formData.append('profilePic', file);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/profile/picture`,
          formData,
          { withCredentials: true }
        );
        setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
        setErrors({ ...errors, profilePic: '' });
        setSuccessMessage('Profile picture updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrors({ ...errors, profilePic: 'Failed to upload profile picture' });
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e, field) => {
    setTempValues({ ...tempValues, [field]: e.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  // Handle edit mode toggle
  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
    setTempValues({ ...tempValues, [field]: profile[field] });
  };

  // Handle profile update
  const handleUpdate = async (field) => {
    if (field === 'fullName' && tempValues.fullName.length > 50) {
      setErrors({ ...errors, fullName: 'Full name must be 50 characters or less' });
      return;
    }
    if (field === 'bio' && tempValues.bio.length > 160) {
      setErrors({ ...errors, bio: 'Bio must be 160 characters or less' });
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/profile`,
        { [field]: tempValues[field] },
        { withCredentials: true }
      );
      setProfile({ ...profile, [field]: tempValues[field] });
      setEditMode({ ...editMode, [field]: false });
      setSuccessMessage(`${field === 'fullName' ? 'Full name' : field === 'email' ? 'Email' : 'Bio'} updated successfully`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ ...errors, [field]: `Failed to update ${field === 'fullName' ? 'full name' : field === 'email' ? 'email' : 'bio'}` });
    }
  };

  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-8 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg max-w-3xl mx-auto">
            {successMessage}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Sidebar (Profile Pic, Name, Username, Bio) */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <img
                    src={profile.profilePic || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                  >
                    <IconCamera size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePicChange}
                    accept="image/*"
                    className="hidden"
                  />
                  {errors.profilePic && (
                    <p className="text-red-500 text-sm mt-2 text-center">{errors.profilePic}</p>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-center">{profile.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-center mt-1">
                  @{profile.username || 'Set a username'}
                </p>
                <div className="mt-4 text-center">
                  {editMode.bio ? (
                    <div>
                      <textarea
                        value={tempValues.bio}
                        onChange={(e) => handleInputChange(e, 'bio')}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        rows="3"
                        maxLength={160}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleUpdate('bio')}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          <IconCheck size={20} />
                          <span>Save</span>
                        </button>
                      </div>
                      {errors.bio && (
                        <p className="text-red-500 text-sm mt-2">{errors.bio}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {profile.bio || 'Add a bio'}
                      </p>
                      <button
                        onClick={() => toggleEditMode('bio')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2"
                      >
                        <IconPencil size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content (Editable Fields) */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Full Name */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                  <button
                    onClick={() => toggleEditMode('fullName')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {editMode.fullName ? <IconX size={20} /> : <IconPencil size={20} />}
                  </button>
                </div>
                {editMode.fullName ? (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={tempValues.fullName}
                      onChange={(e) => handleInputChange(e, 'fullName')}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      maxLength={50}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleUpdate('fullName')}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        <IconCheck size={20} />
                        <span>Save</span>
                      </button>
                    </div>
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-900 dark:text-gray-100">{profile.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <button
                    onClick={() => toggleEditMode('email')}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {editMode.email ? <IconX size={20} /> : <IconPencil size={20} />}
                  </button>
                </div>
                {editMode.email ? (
                  <div className="mt-2">
                    <input
                      type="email"
                      value={tempValues.email}
                      onChange={(e) => handleInputChange(e, 'email')}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleUpdate('email')}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        <IconCheck size={20} />
                        <span>Save</span>
                      </button>
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                    )}
                  </div>
                ) : (
                  <p className="mt-2 text-gray-900 dark:text-gray-100">{profile.email}</p>
                )}
              </div>

              {/* Username (non-editable) */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <p className="mt-2 text-gray-900 dark:text-gray-100">
                  {profile.username || 'Not set'}
                </p>
              </div>

              {/* Placeholder for Additional Content */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div className="flex items-center space-x-2">
                  <IconCode size={24} className="text-gray-600 dark:text-gray-400" />
                  <h2 className="text-lg font-semibold">Your Coding Stats</h2>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Coming soon: Showcase your coding achievements, solved problems, and contributions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;