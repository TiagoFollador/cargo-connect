import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Pages
import LandingPage from './pages/LandingPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },

]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;