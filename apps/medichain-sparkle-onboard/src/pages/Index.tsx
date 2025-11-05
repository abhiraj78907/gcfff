import { useEffect } from "react";
import Hero from "@welcome/components/Hero";
import Features from "@welcome/components/Features";
import HowItWorks from "@welcome/components/HowItWorks";
import Stats from "@welcome/components/Stats";
import Registration from "@welcome/components/Registration";
import Footer from "@welcome/components/Footer";

const Index = () => {
  // Force light theme
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Registration />
      <Footer />
    </main>
  );
};

export default Index;
