import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-safe py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-soft"></div>
            <span className="text-xl font-bold text-foreground">RecoveryConnect</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </a>
            <a href="#mentors" className="text-muted-foreground hover:text-primary transition-colors">
              Find Mentors
            </a>
            <a href="#safety" className="text-muted-foreground hover:text-primary transition-colors">
              Safety & Privacy
            </a>
            <a href="#support" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;