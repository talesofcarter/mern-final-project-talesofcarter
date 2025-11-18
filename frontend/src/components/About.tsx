import { type JSX } from "react";
import CountUp from "../animations/CountUp";
import { layoutStyles } from "../utils/globalStyles";

interface StatsDataType {
  from: 0;
  value: number;
  label: string;
  unit?: string;
}

function About(): JSX.Element {
  const statsData: StatsDataType[] = [
    { from: 0, value: 50, label: "Suppliers Assessed", unit: "K+" },
    { from: 0, value: 120, label: "Carbon Impact Reduced", unit: "K+" },
    { from: 0, value: 95, label: "Data Accuracy", unit: "%" },
  ];

  return (
    <div id="about" className="w-full overflow-hidden">
      <div
        className={`${layoutStyles} flex-column lg:flex justify-between py-5 md:py-8 lg:py-12`}
      >
        <div className="w-1/4">
          <h2 className="text-lg md:text-xl font-bold text-accent">About Us</h2>
        </div>
        <div className="w-full lg:w-3/4">
          <div>
            <p
              data-aos="fade-left"
              data-aos-delay="300"
              className="text-lg md:text-xl lg:text-3xl leading-12 font-bold"
            >
              Optimize your procurement with AI-powered sustainability
              solutions. We provide real-time insights, greener supplier
              recommendations, and smarter purchasing decisions. Reduce costs,
              lower environmental impact, and make your supply chain responsible
              and efficient!
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-3">
              {statsData.map((entry) => {
                return (
                  <div
                    key={entry.label}
                    className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-emerald-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-linear-to-br from-pine-green to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      <div className="flex items-baseline gap-1 mb-3">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-br text-gray-700 bg-clip-text">
                          {
                            <CountUp
                              from={entry.from}
                              to={entry.value}
                              separator=","
                              direction="up"
                              duration={1}
                              className="count-up-text"
                            />
                          }
                        </h2>
                        <span className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700">
                          {entry.unit}
                        </span>
                      </div>
                      <h3 className="text-gray-700 text-sm md:text-base font-medium">
                        {entry.label}
                      </h3>
                    </div>

                    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-linear-to-br from-pine-green to-accent rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
