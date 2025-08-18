import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Shield, Users, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

const addictionTypes = [
  { id: "alcohol", name: "Alcohol", description: "Help with alcohol dependency and sobriety" },
  { id: "substance", name: "Substance Abuse", description: "Support for drug addiction recovery" },
  { id: "gaming", name: "Gaming", description: "Assistance with gaming addiction" },
  { id: "gambling", name: "Gambling", description: "Help with gambling addiction" },
  { id: "smoking", name: "Smoking/Nicotine", description: "Support for quitting smoking" },
  { id: "social-media", name: "Social Media", description: "Help with social media addiction" },
  { id: "shopping", name: "Shopping", description: "Support for shopping addiction" },
  { id: "food", name: "Food/Eating", description: "Help with food and eating disorders" }
];

const BecomeMentor = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    experience: "",
    bio: "",
    availability: "",
    sessionType: ""
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    
    checkUser();
  }, [navigate]);

  const handleAreaToggle = (areaId: string) => {
    setSelectedAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (selectedAreas.length === 0) {
      toast({
        title: "Please select at least one area",
        description: "Choose the addiction areas you can help with",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Parse experience years from string
      const experienceYears = formData.experience === "1-2" ? 2 : 
                             formData.experience === "3-5" ? 5 :
                             formData.experience === "6-10" ? 10 : 15;
      
      // Create mentor profile and update user type
      const { error: mentorError } = await supabase
        .from('mentors')
        .insert({
          user_id: user.id,
          specialization: selectedAreas.join(', '),
          bio: formData.bio,
          experience_years: experienceYears,
          is_available: true
        });

      if (mentorError) throw mentorError;

      // Update user profile to set user_type to mentor
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: 'mentor' })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Application submitted!",
        description: "Your mentor profile has been created successfully.",
      });
      
      navigate("/mentor-dashboard");
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your application",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-safe">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Become a <span className="text-primary">Mentor</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your recovery experience to help others on their journey. 
              Your identity remains completely anonymous while making a real difference.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Make a Difference</h3>
                <p className="text-muted-foreground">Help others overcome addiction with your experience</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 text-trust mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Stay Anonymous</h3>
                <p className="text-muted-foreground">Your real identity is always protected</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Flexible Schedule</h3>
                <p className="text-muted-foreground">Mentor on your own time and availability</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle>Mentor Application</CardTitle>
              <CardDescription>
                Tell us about yourself and the areas you can help with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground font-medium">
                      Complete your mentor profile setup
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Choose your specialization areas and share your experience to help others.
                    </p>
                  </div>
                </div>

                {/* Areas of Expertise */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Areas You Can Help With</h3>
                  <p className="text-muted-foreground">Select all addiction types you have experience with and can mentor others in:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {addictionTypes.map((type) => (
                      <div key={type.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={type.id}
                          checked={selectedAreas.includes(type.id)}
                          onCheckedChange={() => handleAreaToggle(type.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={type.id} className="font-medium cursor-pointer">
                            {type.name}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience & Availability */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Experience & Availability</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Years of Recovery Experience</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, experience: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, availability: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekdays">Weekdays</SelectItem>
                          <SelectItem value="weekends">Weekends</SelectItem>
                          <SelectItem value="evenings">Evenings</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">About You (Anonymous)</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    placeholder="Share your recovery story and how you can help others (no personal details)"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Session Type */}
                <div>
                  <Label htmlFor="sessionType">Preferred Session Type</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({...prev, sessionType: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How would you like to mentor?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat">Text Chat Only</SelectItem>
                      <SelectItem value="voice">Voice Calls</SelectItem>
                      <SelectItem value="video">Video Calls</SelectItem>
                      <SelectItem value="all">All Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Link to="/">
                    <Button variant="outline" size="lg">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BecomeMentor;