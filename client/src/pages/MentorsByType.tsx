import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Star } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import type { User } from '@supabase/supabase-js';

interface Mentor {
  id: string;
  user_id: string;
  specialization: string;
  bio: string;
  experience_years: number;
  is_available: boolean;
  profiles?: {
    username: string;
    full_name: string;
  } | null;
}

const MentorsByType = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const addictionType = type?.charAt(0).toUpperCase() + type?.slice(1) || "Support";

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };
    
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!type) return;
    
    const fetchMentors = async () => {
      try {
        const { data: mentors, error } = await supabase
          .from('mentors')
          .select(`
            id,
            user_id,
            specialization,
            bio,
            experience_years,
            is_available
          `)
          .eq('is_available', true)
          .ilike('specialization', `%${type}%`);

        if (error) throw error;

        // Fetch profiles separately to avoid relation issues
        const mentorsWithProfiles = await Promise.all(
          (mentors || []).map(async (mentor) => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('user_id', mentor.user_id)
              .single();
            
            return {
              ...mentor,
              profiles: profile
            };
          })
        );

        setMentors(mentorsWithProfiles);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [type]);

  const handleStartChat = async (mentorId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      // Check if chat room already exists
      const { data: existingRoom } = await supabase
        .from('chat_rooms')
        .select('id')
        .eq('mentor_id', mentorId)
        .eq('patient_id', user.id)
        .single();

      if (existingRoom) {
        navigate(`/chat/${existingRoom.id}`);
        return;
      }

      // Create new chat room
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert({
          mentor_id: mentorId,
          patient_id: user.id
        })
        .select('id')
        .single();

      if (error) throw error;

      navigate(`/chat/${newRoom.id}`);
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      alcohol: "🍷",
      substance: "💊",
      gaming: "🎮",
      smoking: "🚭", 
      gambling: "🎰",
      "social media": "📱"
    };
    return icons[type.toLowerCase()] || "💪";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-safe text-center">
            <p>Loading mentors...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-safe">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/find-mentors">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12">
            <div className="text-6xl mb-4">{getTypeIcon(type || "")}</div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {addictionType} Recovery Mentors
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced mentors who understand {addictionType?.toLowerCase()} addiction recovery. 
              All mentors have personal experience and specialized training.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {mentors.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No mentors available for {addictionType} right now.
                </p>
                <Link to="/become-mentor">
                  <Button variant="hero">
                    Become a Mentor
                  </Button>
                </Link>
              </div>
            ) : (
              mentors.map((mentor) => (
                <Card key={mentor.id} className="shadow-gentle hover:shadow-warm transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                            {mentor.profiles?.username?.substring(0, 2).toUpperCase() || "AN"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-foreground">
                            {mentor.profiles?.full_name || mentor.profiles?.username || "Anonymous Mentor"}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={mentor.is_available ? "default" : "secondary"} className="text-xs">
                              <div className={`w-2 h-2 rounded-full mr-1 ${mentor.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                              {mentor.is_available ? "Online" : "Offline"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">Experience:</span>
                        <span>{mentor.experience_years} years</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm">
                        <span className="font-medium text-muted-foreground">Specialization:</span>
                        <Badge variant="outline" className="text-xs">
                          {mentor.specialization}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {mentor.bio || "Experienced mentor here to support your recovery journey."}
                      </p>

                      <Button 
                        variant="hero" 
                        className="w-full mt-4"
                        onClick={() => handleStartChat(mentor.user_id)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <div className="bg-card shadow-warm rounded-soft p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Ready to Begin Your Recovery?
              </h3>
              <p className="text-muted-foreground mb-6">
                Choose a mentor that feels right for you. All conversations are completely anonymous 
                and encrypted. You can switch mentors anytime if needed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Take Compatibility Quiz
                </Button>
                <Link to="/find-mentors">
                  <Button variant="outline" size="lg">
                    Browse Other Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorsByType;