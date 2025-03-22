import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import GroceryList from './components/GroceryList';
import './App.css';

const AuthenticatedApp = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <GroceryList />
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