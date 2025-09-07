
'use client';

import { useState, useEffect } from 'react';
import { getMe } from '@/lib/api';

const ProfileButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMe(token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-white">{user.full_name}</span>
      <span className="text-gray-400">({user.role})</span>
    </div>
  );
};

export default ProfileButton;
