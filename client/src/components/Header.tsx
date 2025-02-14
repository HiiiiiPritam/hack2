// src/components/Header.tsx
import React, { useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Call your backend endpoint to sync the user
      fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent if required
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('User synced:', data.user);
        })
        .catch((err) => console.error('Error syncing user:', err));
    }
  }, [isLoaded, user]);

  return (
    <header className="flex items-center justify-between p-4 bg-blue-600 text-white">
      <div className="text-xl font-bold">
        Header
      </div>
      <div>
        {/* UserButton renders a profile avatar and dropdown */}
        <UserButton />
      </div>
    </header>
  );
};

export default Header;
