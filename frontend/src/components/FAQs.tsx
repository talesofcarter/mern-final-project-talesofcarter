import { type JSX, useState } from "react";
import { layoutStyles } from "../utils/globalStyles";
import { queriesData } from "../assets/data/data";
import { Plus, Minus } from "lucide-react";

function FAQs(): JSX.Element {
  const [revealAnswer, setRevealAnswer] = useState<number | null>(null);

  const toggleFAQs = (index: number) => {
    if (revealAnswer === index) {
      setRevealAnswer(null);
    } else {
      setRevealAnswer(index);
    }
  };

  return (
    <div className="w-full min-h-screen bg-pine-green overflow-hidden relative">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div
        className={`${layoutStyles} flex-column lg:flex justify-between gap-12 lg:gap-16 py-12 md:py-16 lg:py-24 relative z-10`}
      >
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <h3 className="text-sm md:text-base font-semibold text-emerald-300 tracking-wide">
              FAQ
            </h3>
          </div>

          <h4 className="text-surface font-bold text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            Everything You Should Know About Our Services
          </h4>

          <p className="text-emerald-100/80 text-lg leading-relaxed">
            Find answers to common questions about ProQure's features,
            integrations, and capabilities.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="w-full lg:w-1/2">
          <div className="space-y-4">
            {queriesData.map((entry, index) => {
              const isOpen = revealAnswer === index;

              return (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${
                      index * 0.1
                    }s backwards`,
                  }}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleFAQs(index)}
                    className="w-full flex items-center justify-between gap-4 p-6 text-left transition-all duration-300 cursor-pointer"
                  >
                    <h5 className="text-lg md:text-xl font-semibold text-surface group-hover:text-emerald-300 transition-colors duration-300">
                      {entry.query}
                    </h5>

                    <div
                      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-all duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      {isOpen ? (
                        <Minus
                          size={18}
                          className="text-emerald-400"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Plus
                          size={18}
                          className="text-emerald-400"
                          strokeWidth={2.5}
                        />
                      )}
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="w-full h-px bg-linear-to-r from-emerald-500/50 to-transparent mb-4"></div>
                      <p className="text-emerald-100/80 text-base md:text-lg leading-relaxed">
                        {entry.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQs;
