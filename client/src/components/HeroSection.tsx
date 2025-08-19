import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@/assets/hero-recovery.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-calm overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Supportive hands reaching toward each other representing anonymous connection and recovery support"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-calm opacity-80"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-safe text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Anonymous Recovery
            <span className="block text-primary mt-2">Support</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with experienced mentors for addiction recovery guidance. 
            <span className="text-primary font-medium"> Completely anonymous.</span> 
            <span className="text-trust font-medium"> Completely secure.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link to="/find-mentors">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Find Your Mentor
              </Button>
            </Link>
            <Link to="/become-mentor">
              <Button variant="anonymous" size="lg" className="text-lg px-8 py-6">
                Become a Mentor
              </Button>
            </Link>
          </div>
          
          <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trust rounded-full"></div>
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>Encrypted Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;