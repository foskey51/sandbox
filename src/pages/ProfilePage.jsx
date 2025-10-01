import { useState, useEffect, useRef } from 'react';
import { IconCamera, IconEdit, IconCheck, IconX, IconCode } from '@tabler/icons-react';
import api from '../utils/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({ fullName: false, email: false, bio: false });
  const [tempValues, setTempValues] = useState({ fullName: '', email: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Validate Base64 string
  const isValidBase64 = (str) => {
    if (!str || typeof str !== 'string') return false;
    try {
      // Remove data URL prefix if present
      const base64Str = str.startsWith('data:image') ? str.split(',')[1] : str;
      // Check if string is valid Base64
      return /^[A-Za-z0-9+/=]+$/.test(base64Str) && base64Str.length % 4 === 0;
    } catch {
      return false;
    }
  };

  // Format Base64 string as data URL
  const formatImageUrl = (base64Str, mimeType = 'image/jpeg') => {
    if (!base64Str) return null;
    // If already a data URL, return it
    if (base64Str.startsWith('data:image')) return base64Str;
    // Otherwise, add data URL prefix
    return isValidBase64(base64Str) ? `data:${mimeType};base64,${base64Str}` : null;
  };

  useEffect(() => {
    api
      .get(`/api/v1/profile`)
      .then((res) => {
        setProfile({
          ...res.data,
          profileImage: formatImageUrl(res.data.profileImage, 'image/jpeg'),
        });
        setTempValues({
          fullName: res.data.fullName,
          email: res.data.email,
          bio: res.data.bio,
        });
      })
      .catch((err) => {
        const status = err?.response?.status;

        if (status === 404) {
          const defaultProfile = {
            fullName: err.response.data.fullName || 'New User',
            email: err.response.data.email || 'unknown@example.com',
            bio: err.response.data.bio || '',
            username: err.response.data.username || 'newuser',
            profileImage: null,
          };

          setProfile(defaultProfile);
          setTempValues({
            fullName: defaultProfile.fullName,
            email: defaultProfile.email,
            bio: defaultProfile.bio,
          });

          showSuccess('Loaded default profile');
        } else {
          console.error('Fetch error:', err);
          setErrors((prev) => ({ ...prev, fetch: 'Failed to load profile' }));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, profilePic: 'Image size must be less than 2MB' }));
      return;
    }

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validImageTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, profilePic: 'Only JPEG, PNG, or GIF images are allowed' }));
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);
    console.log('Profile picture FormData entries:', [...formData.entries()]);
    console.log('Profile picture file:', file.name, file.type, file.size);

    try {
      const response = await api.patch(`/api/v1/profile/update`, formData);
      const imageUrl = formatImageUrl(response.data.profileImage, file.type);
      if (!imageUrl) {
        throw new Error('Invalid Base64 image data');
      }
      setProfile((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }));
      setErrors((prev) => ({ ...prev, profilePic: '' }));
      showSuccess('Profile picture updated successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to upload profile picture';
      console.error('Profile picture update error:', err.message, {
        status: err.response?.status,
        headers: err.response?.headers,
        data: err.response?.data,
      });
      setErrors((prev) => ({ ...prev, profilePic: errorMessage }));
    }
  };

  const handleInputChange = (e, field) => {
    setTempValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleEditMode = (field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
    if (!editMode[field] && profile) {
      setTempValues((prev) => ({ ...prev, [field]: profile[field] }));
    }
  };

  const handleUpdate = async (field) => {
    const value = tempValues[field];

    if (field === 'fullName' && value.length > 50) {
      setErrors((prev) => ({ ...prev, fullName: 'Must be 50 characters or less' }));
      return;
    }
    if (field === 'bio' && value.length > 160) {
      setErrors((prev) => ({ ...prev, bio: 'Must be 160 characters or less' }));
      return;
    }
    if (field === 'email' && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
      return;
    }

    try {
      const response = await api.patch(
        `/api/v1/profile/update`,
        { [field]: value },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setProfile((prev) => ({
        ...prev,
        [field]: response.data[field],
        profileImage: formatImageUrl(response.data.profileImage, 'image/jpeg'),
      }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      showSuccess(
        `${field === 'fullName' ? 'Full name' : field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
      );
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to update ${field}`;
      console.error(`Update ${field} error:`, err.message, {
        status: err.response?.status,
        headers: err.response?.headers,
        data: err.response?.data,
      });
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (errors.fetch) return <div className="p-8 text-center text-red-600">{errors.fetch}</div>;

  return (
    <div className="w-full h-full bg-white dark:bg-black text-black dark:text-white transition-colors duration-200 overflow-auto">
      <div className="max-w-4xl mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {successMessage && (
          <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={profile?.profileImage || 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png'}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800"
                    onError={(e) => {
                      console.error('Failed to load profile image:', profile?.profileImage, e);
                      e.target.src = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png';
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
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
                <h1 className="text-2xl font-bold text-center">{profile?.fullName}</h1>
                <p className="text-gray-600 dark:text-gray-400">@{profile?.username || 'Not set'}</p>
                <div className="w-full mt-4 text-center">
                  {editMode.bio ? (
                    <div>
                      <textarea
                        value={tempValues.bio}
                        onChange={(e) => handleInputChange(e, 'bio')}
                        style={{
                          resize: "none",
                          overflow: "auto"
                        }}
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        rows="3"
                        maxLength={160}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleUpdate('bio')}
                          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          <IconCheck size={20} />
                          <span className="ml-1">Save</span>
                        </button>
                      </div>
                      {errors.bio && <p className="text-red-500 text-sm mt-2">{errors.bio}</p>}
                    </div>
                  ) : (
                    <div className='flex justify-center items-center space-x-4'>
                      <p className="text-gray-600 dark:text-gray-400">{profile?.bio || 'No bio yet'}</p>
                      <button
                        onClick={() => toggleEditMode('bio')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <IconEdit size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Full Name */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <button
                  onClick={() => toggleEditMode('fullName')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {editMode.fullName ? <IconX size={20} /> : <IconEdit size={20} />}
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
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      <IconCheck size={20} />
                      <span className="ml-1">Save</span>
                    </button>
                  </div>
                  {errors.fullName && <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>}
                </div>
              ) : (
                <p className="mt-2 text-gray-900 dark:text-gray-100">{profile?.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <button
                  onClick={() => toggleEditMode('email')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {editMode.email ? <IconX size={20} /> : <IconEdit size={20} />}
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
                      className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      <IconCheck size={20} />
                      <span className="ml-1">Save</span>
                    </button>
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>
              ) : (
                <p className="mt-2 text-gray-900 dark:text-gray-100">{profile?.email}</p>
              )}
            </div>

            {/* Username display */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <p className="mt-2 text-gray-900 dark:text-gray-100">@{profile?.username || 'Not set'}</p>
            </div>

            {/* Placeholder */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center space-x-2">
              <IconCode size={24} className="text-gray-600 dark:text-gray-400" />
              <div>
                <h2 className="text-lg font-semibold">Your Coding Stats</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
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

export default ProfilePage;