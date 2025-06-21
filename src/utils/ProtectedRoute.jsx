import { Navigate, Outlet } from "react-router";
import useStore from "../../store";

const ProtectedRoute = () => {

  const isAuthenticated = useStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
