import { useEffect } from "react";
import useStore from "../store";
import "./App.css"
import OnlineCompiler from "./pages/OnlineCompiler";
import WebDev from "./pages/WebDev";
import Hero from "./pages/Hero";
import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";

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
          <Route path="/OnlineCompiler" element={<OnlineCompiler />} />
          <Route path="/WebDevPlayground" element={<WebDev />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter >
    </>
  )
};

export default App;