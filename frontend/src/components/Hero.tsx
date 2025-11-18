import { type JSX, useState, useEffect, useCallback } from "react";
import SplitText from "../animations/SplitText";
import AOS from "aos";
import { Link } from "react-router";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
}

function Hero(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides: HeroSlide[] = [
    {
      image: "/hero-image-1.webp",
      title: "Smart Procurement Analytics",
      subtitle: "Sustainable Solutions",
      description:
        "ProQure provides real-time insights across your entire supply chain, revealing risks and sustainability gaps, thereby evaluating supplier performance and environmental impact.",
    },
    {
      image: "/hero-image-2.webp",
      title: "Green Procurement Intelligence",
      subtitle: "AI-Driven Green Intelligence",
      description:
        "ProQure analyzes suppliers, emissions, and purchasing patterns to highlight the most sustainable sourcing options. Our AI identifies opportunities to reduce cost, and generate insights that drive future-focused purchasing decisions.",
    },
  ];

  const handleNext = useCallback(() => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [isTransitioning, slides.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 30000);

    return () => clearInterval(timer);
  }, [handleNext]);

  useEffect(() => {
    if (!isTransitioning) {
      AOS.refresh();
    }
  }, [isTransitioning]);

  const goToSlide = (index: number) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-linear-to-r from-pine-green/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-l from-pine-green/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-pine-green/20" />
        </div>
      ))}

      <div className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-screen mx-auto px-4 sm:px-6 md:px-12 lg:px-20 w-full">
          <div className="max-w-2xl">
            <div
              className={`transition-all duration-900 ${
                isTransitioning
                  ? "opacity-0 translate-y-8"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <p
                data-aos="fade-up"
                data-aos-delay="200"
                className="text-accent font-semibold text-sm md:text-base lg:text-lg mb-3 md:mb-4 uppercase"
              >
                {slides[currentSlide].subtitle}
              </p>
              <div data-aos="fade-up" data-aos-delay="300">
                <SplitText
                  text={slides[currentSlide].title}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-surface mb-4 md:mb-6 leading-tight uppercase"
                  splitType="chars"
                  duration={0.6}
                  delay={30}
                  ease="power3.out"
                  tag="h1"
                />
              </div>

              <p
                data-aos="fade-up"
                data-aos-delay="300"
                className="text-lg text-surface/80 mb-8 md:mb-10 leading-relaxed max-w-lg"
              >
                {slides[currentSlide].description}
              </p>
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-accent hover:bg-transparent border-2 border-transparent hover:border-accent text-white hover:text-accent text-center rounded-full"
                >
                  Get Started
                </Link>

                <Link
                  to="#about"
                  className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white rounded-full"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === currentSlide
                ? "w-5 md:w-5 h-2 md:h-2.5 bg-accent"
                : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Hero;
