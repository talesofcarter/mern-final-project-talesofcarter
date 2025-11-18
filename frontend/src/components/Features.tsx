import { type JSX } from "react";
import { layoutStyles } from "../utils/globalStyles";
import { featuresData } from "../assets/data/data";

function Features(): JSX.Element {
  return (
    <div className="w-full min-h-screen overflow-hidden bg-pine-green relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pine-green/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className={`${layoutStyles} py-12 md:py-16 lg:py-24 relative z-10`}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full mb-6"
          >
            <h3 className="text-sm md:text-base font-semibold text-surface tracking-wide">
              Why Choose Us
            </h3>
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold text-surface mb-4"
          >
            Trusted Partner for Reliable Procurement Insights
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((entry, index) => {
            return (
              <div
                data-aos="fade-up"
                data-aos-delay={`${index * 200}`}
                key={entry.title}
                className="group relative bg-transparent shadow-2xl backdrop-blur-sm rounded-2xl p-6  hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10"
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

                <div className="relative z-10 flex gap-4 items-start">
                  <div className="bg-accent p-3 rounded-xl shrink-0  transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                    <entry.icon size={28} color="white" strokeWidth={2} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                      {entry.title}
                    </h3>
                    <p className="text-sm md:text-base text-surface/90 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-emerald-500/10 to-transparent rounded-bl-full opacity-0 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Features;
