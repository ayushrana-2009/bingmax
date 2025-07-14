'use client';
import { useState } from 'react';
import Image from 'next/image';
import './page.css';
import { useRouter } from 'next/navigation';

const profileImages = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];

export default function CreateProfile() {
  const [username, setUsername] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  

  const router = useRouter();

  const handleSaveProfile = () => {
    if (!username || !selectedImage) {
      alert('Please enter a name and select a profile image');
      return;
    }

    const profileData = {
      name: username,
      image: selectedImage,
    };

    localStorage.setItem('userProfile', JSON.stringify(profileData));
 

    // ✅ Navigate to home or anywhere after saving
    router.push('/');
  };

  


  return (
    <>
    <div className="create-profile-container">
      <h1>Create Your Profile</h1>

      {/* ✅ Username Input */}
      <input
        type="text"
        placeholder="Enter your name..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="profile-input"
      />

      {/* ✅ Profile Image Selection Grid */}
      <h3>Select Profile Image</h3>
      <div className="profile-image-grid">
        {profileImages.map((img, index) => (
          <div
            key={index}
            className={`profile-image-card ${selectedImage === img ? 'selected' : ''}`}
            onClick={() => setSelectedImage(img)}
          >
            <Image src={img} alt="Profile" fill style={{ objectFit: 'cover' }} />
            <div className="profile-gradient-overlay"></div>
          </div>
        ))}
      </div>

      {/* ✅ Save Button */}
      <button className="save-profile-button" onClick={handleSaveProfile}>
        Save Profile
      </button>
    </div>
    
    </>
  );
}
