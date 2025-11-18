import { type JSX } from "react";
import {
  X,
  Home,
  Bot,
  LayoutGrid,
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router";

function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Bot, label: "AI Advisor", href: "/ai" },
    { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
    { icon: FileText, label: "Reports", href: "/reports" },
    { icon: Users, label: "Suppliers", href: "/suppliers" },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-pine-green/60 backdrop-blur-sm z-50 transition-opacity duration-300"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        ></div>
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-2/3 md:w-1/2 lg:w-1/3 z-50 bg-linear-to-br from-pine-green  to-emerald-900 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="relative h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">ProQure</h2>
              <p className="text-sm text-emerald-100/60 mt-1">
                Procurement Dashboard
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-emerald-400 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          <nav className="flex-1  p-6 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                  style={{
                    animation: `slideInRight 0.3s ease-out ${
                      index * 0.05
                    }s backwards`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors duration-300">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <span className="text-white font-medium group-hover:text-emerald-300 transition-colors duration-300">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className="text-emerald-400/60 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300"
                    strokeWidth={2.5}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/10 space-y-3">
            <div className="p-4 rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 shrink-0">
                  <FaStar className="w-4 h-4 text-surface" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Upgrade to Pro
                  </h4>
                  <p className="text-xs text-emerald-100/60 mb-3">
                    Unlock advanced analytics and AI insights
                  </p>
                  <button className="w-full px-4 py-2 bg-linear-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer">
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
