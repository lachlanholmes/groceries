import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="login-container">
      <h2>Shared Grocery List</h2>
      <button onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login; 