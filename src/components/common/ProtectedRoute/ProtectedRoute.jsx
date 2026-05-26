import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context';

export const ProtectedRoute = ({ children }) => {
   const { userId } = useAuth();
   if (!userId) return <Navigate to="/login" replace />;
   return children;
};

export const AdminRoute = ({ children }) => {
   const { isAdmin } = useAuth();
   if (!isAdmin) return <Navigate to="/" replace />;
   return children;
};
