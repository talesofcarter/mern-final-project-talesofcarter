import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import AnimateScroll from "./animations/AnimateScroll";
import ScrollToSection from "./components/ScrollToSection";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnimateScroll />
    <BrowserRouter>
      <ScrollToSection />
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
