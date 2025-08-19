import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Profile } from '@shared/schema';

const Navigation = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Simplified auth check - in production, check real session
    // For now, just simulating a logged-out state
  }, []);

  const handleSignOut = async () => {
    setUser(null);
    setUserProfile(null);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b z-50">
      <div className="max-w-6xl mx-auto px-safe">
        <div className="flex justify-between items-center h-16">
          <Link to="/">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-trust rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AR</span>
              </div>
              <span className="font-semibold text-lg">Anonymous Recovery</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/find-mentors">
                  <Button variant="ghost" size="sm">
                    Find Mentors
                  </Button>
                </Link>
                
                {userProfile?.userType === 'mentor' ? (
                  <Link to="/mentor-dashboard">
                    <Button variant="ghost" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/become-mentor">
                    <Button variant="ghost" size="sm">
                      Become a Mentor
                    </Button>
                  </Link>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {userProfile?.username || user.username}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link to="/find-mentors">
                  <Button variant="ghost" size="sm">
                    Find Mentors
                  </Button>
                </Link>
                <Link to="/become-mentor">
                  <Button variant="ghost" size="sm">
                    Become a Mentor
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;