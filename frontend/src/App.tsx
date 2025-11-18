import { type JSX, useState } from "react";
import { Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import BotEngine from "./pages/BotEngine";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";

function App(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => (prev === false ? true : false));
    console.log("clicked");
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <main>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ai" element={<BotEngine />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/suppliers" element={<Suppliers />} />
      </Routes>
      <Footer />
    </main>
  );
}

export default App;
