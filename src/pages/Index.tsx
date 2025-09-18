import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import GamificationSection from "@/components/GamificationSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeatureCards />
        <GamificationSection />
      </main>
    </div>
  );
};

export default Index;
