import { type JSX, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

type NavLinksType = { label: string; path: string };

function Navbar({ toggleSidebar }: { toggleSidebar: () => void }): JSX.Element {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const authButtonStyles =
    "hidden sm:block px-6 md:px-5 lg:px-6 py-4 md:py-2.5 border-2 border-accent rounded-3xl";

  const navLinks: NavLinksType[] = [
    { label: "Home", path: "/" },
    { label: "AI Advisor", path: "/ai" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/reports" },
    { label: "Suppliers", path: "/suppliers" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${scrolled ? "bg-pine-green shadow-lg" : "bg-transparent"}`}
    >
      <nav className="text-surface">
        <div className="max-w-screen mx-auto flex items-center justify-between px-4 sm:px-6 md:px-12 lg:px-20 py-4 md:py-5 lg:py-6">
          <NavLink to="/" className="flex items-center gap-2 md:gap-3">
            <img
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              src="/logo.svg"
              alt="ProQure's Logo"
            />
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              ProQure
            </h1>
          </NavLink>

          <div className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className="text-base font-bold hover:text-accent uppercase transition-colors relative group cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className={`${authButtonStyles}`}
              >
                Logout
              </Button>
            ) : (
              <NavLink to="/login">
                <Button className={`${authButtonStyles}`}>Try Demo</Button>
              </NavLink>
            )}

            <button
              className="flex flex-col justify-center gap-1.5 w-7 h-7 cursor-pointer group"
              aria-label="Menu"
              onClick={toggleSidebar}
            >
              <span className="block h-0.5 w-full bg-surface rounded transition-all group-hover:w-5"></span>
              <span className="block h-0.5 w-full bg-surface rounded"></span>
              <span className="block h-0.5 w-full bg-surface rounded transition-all group-hover:w-5"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
