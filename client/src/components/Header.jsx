import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

function Header() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Call your backend endpoint to sync the user
      fetch('/api/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    <div>
      Header
    </div>
  );
}

export default Header;
