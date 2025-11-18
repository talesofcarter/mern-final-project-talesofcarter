import { type JSX } from "react";
import { layoutStyles } from "../utils/globalStyles";
import { plansData } from "../assets/data/data";
import { Check } from "lucide-react";

function Pricing(): JSX.Element {
  return (
    <div className="w-full min-h-screen overflow-hidden relative bg-linear-to-br from-slate-50 via-surface to-emerald-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className={`${layoutStyles} py-12 md:py-16 lg:py-24 relative z-10`}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="inline-flex items-center gap-2 px-4 py-2 bg-pine-green backdrop-blur-sm border border-emerald-500/30 rounded-full mb-6"
          >
            <h3 className="text-sm md:text-base font-semibold text-surface tracking-wide">
              Our Plans
            </h3>
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold text-black/90 mb-4"
          >
            Choose the Right Package for your Business
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plansData.map((entry, index) => {
            const isPopular = entry.planCategory === "Growth";
            const isEnterprise = entry.planCategory === "Enterprise";

            return (
              <div
                data-aos="fade-left"
                data-aos-delay={`${index * 200}`}
                key={entry.planCategory}
                className={`relative group rounded-2xl transition-all duration-300 ${
                  isPopular
                    ? "bg-linear-to-br from-emerald-500 to-teal-500 p-0.5 shadow-xl shadow-emerald-500/20 scale-105 lg:scale-110"
                    : "bg-surface border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-strawberry-red rounded-full shadow-lg">
                    <span className="text-xs font-bold text-surface">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`${
                    isPopular ? "bg-surface" : ""
                  } rounded-2xl p-6 h-full flex flex-col`}
                >
                  <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
                      {entry.planCategory}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {entry.idealFor}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        ${entry.planPrice}
                      </span>
                      <span className="text-slate-600 font-medium">/month</span>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <ul className="space-y-3">
                      {entry.featuresPack.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <div
                            className={`shrink-0 mt-0.5 ${
                              isPopular
                                ? "bg-linear-to-br from-emerald-500 to-teal-500"
                                : "bg-emerald-100"
                            } rounded-full p-0.5`}
                          >
                            <Check
                              size={14}
                              className={
                                isPopular ? "text-surface" : "text-emerald-600"
                              }
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-sm text-slate-700 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                      isPopular
                        ? "bg-strawberry-red text-surface hover:bg-strawberry-red/70"
                        : isEnterprise
                        ? "bg-emerald-600 text-surface hover:bg-slate-800"
                        : "bg-emerald-600 text-surface hover:bg-emerald-50 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200"
                    }`}
                  >
                    {isEnterprise ? "Request Quote" : "Get This Plan"}
                  </button>
                </div>

                {!isPopular && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-emerald-100/50 to-transparent rounded-tr-2xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600">
            All plans include 24/7 customer support and regular updates
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
