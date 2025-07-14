'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import './navbar.css';

const navItems = [
  { name: 'Home', href: '/', icon: 'bi-house' },
  { name: 'Movies', href: '/movies', icon: 'bi-film' },
  { name: 'Search', href: '/search', icon: 'bi bi-search' },
  { name: 'Profile', href: '/profile', icon: 'bi-person-circle' },  // ✅ Default Bootstrap person icon
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileImg, setProfileImg] = useState('');

  useEffect(() => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const parsed = JSON.parse(profileData);
      if (parsed.image) {
        setProfileImg(parsed.image);
      }
    }
  }, []);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="mobile-toggle d-md-none" onClick={() => setOpen(!open)}>
        <i className="bi bi-list"></i>
      </div>

      <div className={`custom-navbar d-flex flex-column justify-content-center align-items-center ${open ? 'navbar-open' : ''}`}>
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={index} className="nav-link-custom" onClick={() => setOpen(false)}>
              <div className={`nav-item-custom text-center my-2 ${isActive ? 'active-tab' : ''}`}>
                <div className="active-indicator"></div>

                {item.name === 'Profile' ? (
                  profileImg ? (
                    // ✅ If user has profile image -> Show circular profile image
                    <Image
                      src={profileImg}
                      alt="Profile"
                      width={30}
                      height={30}
                      style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '5px' }}
                    />
                  ) : (
                    // ✅ If no profile image -> Show default icon
                    <i className={`bi ${item.icon} me-2`}></i>
                  )
                ) : (
                  // ✅ Other nav items
                  <i className={`bi ${item.icon} me-2`}></i>
                )}

                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
