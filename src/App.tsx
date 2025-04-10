import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import GroceryList from './components/GroceryList';
import { useState } from 'react';
import './App.css';

// Import the PhotoCapture component (we'll create this next)
import PhotoCapture from './components/PhotoCapture';

const AuthenticatedApp = () => {
  const { user, loading, signOut } = useAuth();
  // State to control whether to show PhotoCapture or GroceryList
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      {/* Hamburger menu in the header */}
      <header className="app-header">
        <h1>Grocery List</h1>
        
        {/* This is the hamburger menu */}
        <div className="hamburger-menu">
          <button 
            className="hamburger-button" 
            onClick={() => setShowPhotoCapture(!showPhotoCapture)}
          >
            <span className="hamburger-icon"></span>
            <span className="hamburger-icon"></span>
            <span className="hamburger-icon"></span>
          </button>
        </div>
      </header>

      {/* Main content area - toggle between GroceryList and PhotoCapture */}
      <main className="app-content">
        {showPhotoCapture ? (
          <PhotoCapture onClose={() => setShowPhotoCapture(false)} />
        ) : (
          <GroceryList />
        )}
      </main>

      {/* Footer with logout */}
      <footer className="app-footer">
        <span>Signed in as: {user.email}</span>
        <button onClick={signOut} className="logout-button">
          Sign Out
        </button>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default App;