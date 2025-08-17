import { useEffect } from "react";
import useStore from "../store";
import "./App.css"
import OnlineCompiler from "./pages/OnlineCompiler";
import WebDev from "./pages/WebDev";
import Hero from "./pages/Hero";
import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./pages/Profile";
import SideBarWrapper from "./components/SideBarWrapper";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<SideBarWrapper><Dashboard /></SideBarWrapper>} />
            <Route path="/online-compiler" element={<SideBarWrapper><OnlineCompiler /></SideBarWrapper>} />
            <Route path="/webdev-playground" element={<SideBarWrapper><WebDev /></SideBarWrapper>} />
            <Route path="/profile" element={<SideBarWrapper><Profile /></SideBarWrapper>} />
            <Route path="/settings" element={<SideBarWrapper><Settings /></SideBarWrapper>} />
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
};

export default App;