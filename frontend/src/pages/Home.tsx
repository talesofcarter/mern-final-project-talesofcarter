import { type JSX } from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Pricing from "../components/Pricing";
import FAQs from "../components/FAQs";
import CTA from "../components/CTA";

function Home(): JSX.Element {
  return (
    <section>
      <Hero />
      <About />
      <Features />
      <Pricing />
      <FAQs />
      <CTA />
    </section>
  );
}

export default Home;
