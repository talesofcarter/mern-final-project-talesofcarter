import { type JSX } from "react";
import { layoutStyles } from "../utils/globalStyles";
import { resourcesData, socialIcons } from "../assets/data/footer";
import { quickLinks, contactIcons } from "../assets/data/footer";
import { Link } from "react-router";

function Footer(): JSX.Element {
  return (
    <footer id="contact" className="w-full bg-pine-green overflow-hidden">
      <div className={`${layoutStyles} py-12 md:py-16 lg:py-20 relative z-10`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img
                  className="w-10 h-10 lg:w-12 lg:h-12"
                  src="/logo.svg"
                  alt="A-Tron's Logo"
                />
                <h1 className="text-3xl lg:text-4xl font-extrabold text-surface tracking-tight">
                  ProQure
                </h1>
              </div>
              <p className="text-surface/90 leading-relaxed mb-8 text-base">
                Your AI partner for smarter, sustainable procurement; empowering
                teams to track impact, optimize suppliers, and make greener
                purchasing decisions.
              </p>

              <div className="flex space-x-5">
                {socialIcons.map((item) => {
                  return (
                    <Link
                      key={item.label}
                      to=""
                      className="text-accent transition-all duration-300 hover:text-(--brand-color)"
                      style={
                        {
                          "--brand-color": item.brandColor,
                        } as React.CSSProperties
                      }
                      aria-label={item.label}
                    >
                      <item.icon className="w-6 h-6" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-white mb-6 text-base lg:text-lg tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((entry) => {
                  return (
                    <li key={entry.label}>
                      <Link
                        to={entry.url}
                        className="text-accent/90 hover:text-accent hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-base"
                        aria-label={`Go to ${entry.label} page`}
                      >
                        {entry.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Helpful Resources */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-white mb-6 text-base lg:text-lg tracking-wide">
                Helpful Resources
              </h3>
              <ul className="space-y-3">
                {resourcesData.map((resource) => {
                  return (
                    <li key={resource.label}>
                      <Link
                        to={resource.url}
                        className="text-accent/90 hover:text-accent hover:translate-x-1 transition-all duration-200 cursor-pointer inline-block text-base"
                      >
                        {resource.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-white mb-6 text-base lg:text-lg tracking-wide">
                Contact Us
              </h3>
              <div className="space-y-4">
                {contactIcons.map((entry) => {
                  return (
                    <div key={entry.label} className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-[#3b5b5c] shrink-0 transition-transform duration-200">
                        <entry.icon size={24} className="text-accent" />
                      </div>
                      <div className="text-surface/90 text-base flex-1">
                        <div className="font-semibold text-white mb-1">
                          {entry.label}
                        </div>
                        <div className="wrap-break-word">
                          {entry.contactInfo}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-surface/20 mt-12 pt-8 text-surface/90 text-sm relative">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <p className="text-sm lg:text-base">
                &copy; {new Date().getFullYear()} ProQure. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link
                  to="/privacy-policy"
                  className="text-accent/90 hover:text-accent transition-colors duration-200 cursor-pointer text-sm lg:text-base"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-and-conditions"
                  className="text-accent/90 hover:text-accent transition-colors duration-200 cursor-pointer text-sm lg:text-base"
                >
                  Terms & Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
