import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';

const RoleSelection = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Check if user already has a profile with user_type set
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('user_id', session.user.id)
        .single();

      if (profile?.user_type) {
        // User already selected a role, redirect accordingly
        if (profile.user_type === 'mentor') {
          navigate("/mentor-dashboard");
        } else {
          navigate("/find-mentors");
        }
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleRoleSelection = async (userType: 'mentor' | 'patient') => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update user profile with selected role
      const { error } = await supabase
        .from('profiles')
        .update({ user_type: userType })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Role selected!",
        description: `Welcome as a ${userType}!`
      });

      // Navigate based on role
      if (userType === 'mentor') {
        navigate("/become-mentor");
      } else {
        navigate("/find-mentors");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-mused flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Welcome to <span className="text-primary">RecoveryConnect</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            How would you like to participate in our community?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Become a Patient */}
          <Card className="shadow-warm hover:shadow-lift transition-shadow cursor-pointer" 
                onClick={() => handleRoleSelection('patient')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-trust to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Get Support</CardTitle>
              <CardDescription className="text-lg">
                Connect with experienced mentors who understand your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-trust rounded-full"></div>
                  Browse mentors by addiction type
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-trust rounded-full"></div>
                  Anonymous real-time chat support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-trust rounded-full"></div>
                  24/7 availability with various mentors
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-trust rounded-full"></div>
                  Complete privacy protection
                </li>
              </ul>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full mt-6"
                onClick={() => handleRoleSelection('patient')}
                disabled={loading}
              >
                {loading ? "Setting up..." : "Find Mentors"}
              </Button>
            </CardContent>
          </Card>

          {/* Become a Mentor */}
          <Card className="shadow-warm hover:shadow-lift transition-shadow cursor-pointer"
                onClick={() => handleRoleSelection('mentor')}>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Help Others</CardTitle>
              <CardDescription className="text-lg">
                Share your recovery experience to guide others on their path
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Share your recovery story anonymously
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Choose your areas of expertise
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Set your own availability schedule
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  Make a real difference in lives
                </li>
              </ul>
              <Button 
                variant="supportive" 
                size="lg" 
                className="w-full mt-6"
                onClick={() => handleRoleSelection('mentor')}
                disabled={loading}
              >
                {loading ? "Setting up..." : "Become a Mentor"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Don't worry - you can change your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;