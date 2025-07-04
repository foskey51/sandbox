import { Navigate, Outlet } from "react-router";
import useStore from "../../store";
import { Sidebar, SidebarBody } from "../components/Sidebar";

const ProtectedRoute = () => {

  const isAuthenticated = useStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Sidebar>
      <SidebarBody>
        <Outlet />
      </SidebarBody>
    </Sidebar>
  );
};

export default ProtectedRoute;
