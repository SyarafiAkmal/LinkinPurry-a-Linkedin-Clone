import { Navigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import LoadingPage from '@/pages/LoadingPage';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return LoadingPage();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};