import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
      
      <div className="pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-safe text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/find-mentors">
              <Button variant="hero" size="lg">
                Find a Mentor
              </Button>
            </Link>
            <Link to="/become-mentor">
              <Button variant="outline" size="lg">
                Become a Mentor
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="supportive" size="lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;