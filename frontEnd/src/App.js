import { useSelector } from 'react-redux';
import LandingPage from './features/landingPage/LandingPage';
import Login from './features/auth/Login';

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div>
      {isAuthenticated ? <LandingPage /> : <Login />}
    </div>
  );
}

export default App;
