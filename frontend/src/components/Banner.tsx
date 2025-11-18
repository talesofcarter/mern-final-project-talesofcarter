import { type JSX } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BannerProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
  height?: string;
}

function Banner({
  title,
  breadcrumbs,
  backgroundImage = "",
  height = "h-64 md:h-80 lg:h-96",
}: BannerProps): JSX.Element {
  return (
    <div className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        }}
      >
        <div className="absolute rounded-b-2xl inset-0 bg-linear-to-r from-pine-green/80 via-black/40 to-transparent" />
        <div className="absolute rounded-b-2xl inset-0 bg-linear-to-l from-pine-green/60 via-transparent to-transparent" />
        <div className="absolute rounded-b-2xl inset-0 bg-pine-green/20" />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4"
          style={{
            animation: "fadeInUp 0.6s ease-out",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h1>

        <nav
          className="flex items-center gap-2 text-sm md:text-base"
          style={{
            animation: "fadeInUp 0.6s ease-out 0.2s backwards",
          }}
          aria-label="Breadcrumb"
        >
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="text-white/90 hover:text-white transition-colors duration-200 font-medium"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-emerald-300 font-semibold">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRight
                  size={16}
                  className="text-white/60"
                  strokeWidth={2.5}
                />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Banner;
