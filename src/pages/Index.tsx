import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AddictionTypes from "@/components/AddictionTypes";
import AnonymousFeatures from "@/components/AnonymousFeatures";
import ChatPreview from "@/components/ChatPreview";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AddictionTypes />
      <AnonymousFeatures />
      <ChatPreview />
    </div>
  );
};

export default Index;
