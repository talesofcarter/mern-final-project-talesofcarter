import { useEffect, type JSX } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function AnimateScroll(): JSX.Element | null {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    AOS.refresh();

    const handleRouteChange = () => {
      AOS.refresh();
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  return null;
}
export default AnimateScroll;
