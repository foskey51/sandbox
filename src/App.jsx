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
          <Route path="*" element={<NotFound />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/online-compiler" element={<OnlineCompiler />} />
            <Route path="/webdev-playground" element={<SideBarWrapper><WebDev /></SideBarWrapper>} />
            <Route path="/profile" element={<SideBarWrapper><Profile /></SideBarWrapper>} />
          </Route>

        </Routes>
      </BrowserRouter>

    </>
  )
};

export default App;