import { Navigate, Outlet } from "react-router";
import useStore from "../../store";

const ProtectedRoute = () => {

  const isAuthenticated = useStore(state => state.isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace={true} />;
};

export default ProtectedRoute;
