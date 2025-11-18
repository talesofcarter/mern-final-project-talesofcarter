import { type JSX } from "react";
import { layoutStyles } from "../utils/globalStyles";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

function CTA(): JSX.Element {
  return (
    <div className="w-full overflow-hidden relative bg-linear-to-br from-slate-50 via-white to-emerald-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className={`${layoutStyles} py-12 md:py-16 lg:py-24 relative z-10`}>
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 border border-emerald-100 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative bg-white m-0.5 rounded-3xl p-8 md:p-12 lg:p-16">
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-emerald-100 to-transparent rounded-bl-full opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-linear-to-tr from-teal-100 to-transparent rounded-tr-full opacity-50"></div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  Ready to Transform Your{" "}
                  <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Procurement Process?
                  </span>
                </h2>

                <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                  Join hundreds of companies using ProQure to make smarter, more
                  sustainable procurement decisions. Our team is here to help
                  you get started.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    to="/signup"
                    className="group px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300  flex items-center gap-2 cursor-pointer"
                  >
                    Get Started Today
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform duration-300"
                      strokeWidth={2.5}
                    />
                  </Link>

                  <Link
                    to="#contact"
                    className="px-8 py-4 bg-slate-100 text-slate-900 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200 transition-all duration-300 cursor-pointer"
                  >
                    Schedule a Demo
                  </Link>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200">
                  <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        No credit card required
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-emerald-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">24/7 support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTA;
