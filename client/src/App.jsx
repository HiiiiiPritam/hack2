import React from 'react';
import { SignedIn, SignedOut, SignIn, SignUp, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <div>
      {/* When the user is signed in, show your Dashboard */}
      <SignedIn>
          <h1 style={{ textAlign: "center" }}>React Leaflet Map</h1>
          <MapComponent />
      </SignedIn>

      {/* When the user is not signed in, show Clerk's prebuilt pages */}
      <SignedOut>
        <div>
          <h1>Welcome to Our Security System</h1>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
      </SignedOut>

    </div>
  );
}

export default App;
