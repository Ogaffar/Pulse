import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";

import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo === "how-it-works") {
      setTimeout(() => {
        const el = document.getElementById("how-it-works");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          window.scrollBy(0, -72);
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background" style={{ position: "relative", zIndex: 1 }}>
      <HeroSection />
      <SocialProofSection />
      <ProblemSection />
      <FeaturesSection />
      
      <HowItWorksSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
