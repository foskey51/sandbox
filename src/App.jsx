import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useStore from "../store";
import "./App.css"
import OnlineCompilerPage from "./pages/OnlineCompilerPage";
import WebDevPage from "./pages/WebDevPage";
import LandingPage from "./pages/LandingPage";
import { HashRouter, Route, Routes } from "react-router";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import SideBarWrapper from "./components/SideBarWrapper";
import LogoutPage from "./pages/LogoutPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import VmPage from "./pages/VmPage";

const App = () => {
  const darkMode = useStore(state => state.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      <HashRouter>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="*" element={<NotFoundPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<SideBarWrapper><DashboardPage /></SideBarWrapper>} />
            <Route path="/online-compiler" element={<SideBarWrapper><OnlineCompilerPage /></SideBarWrapper>} />
            <Route path="/webdev-playground" element={<SideBarWrapper><WebDevPage /></SideBarWrapper>} />
            <Route path="/vm" element={<SideBarWrapper><VmPage /></SideBarWrapper>} />
            <Route path="/profile" element={<SideBarWrapper><ProfilePage /></SideBarWrapper>} />
            <Route path="/settings" element={<SideBarWrapper><SettingsPage /></SideBarWrapper>} />
          </Route>

        </Routes>
      </HashRouter>
    </>
  )
};

export default App;