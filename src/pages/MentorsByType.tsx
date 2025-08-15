import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MentorsByType = () => {
  const { type } = useParams();
  const addictionType = type?.charAt(0).toUpperCase() + type?.slice(1);

  // Mock mentor data - in real app this would come from API
  const mentors = [
    {
      id: 1,
      username: "SoberGuide42",
      avatar: "🧘",
      specialization: addictionType,
      experience: "5 years recovery",
      availability: "Available now",
      rating: 4.9,
      sessions: 127,
      approach: "Cognitive Behavioral Therapy & Mindfulness",
      languages: ["English", "Spanish"],
      isOnline: true
    },
    {
      id: 2,
      username: "RecoveryMentor_88",
      avatar: "🌟",
      specialization: addictionType,
      experience: "3 years recovery",
      availability: "Available in 2 hours",
      rating: 4.8,
      sessions: 89,
      approach: "12-Step Program & Peer Support",
      languages: ["English"],
      isOnline: false
    },
    {
      id: 3,
      username: "LifeCoach_Phoenix",
      avatar: "🦋",
      specialization: addictionType,
      experience: "7 years recovery",
      availability: "Available now",
      rating: 5.0,
      sessions: 203,
      approach: "Holistic Recovery & Life Coaching",
      languages: ["English", "French"],
      isOnline: true
    },
    {
      id: 4,
      username: "WisdomSeeker_21",
      avatar: "🌿",
      specialization: addictionType,
      experience: "4 years recovery",
      availability: "Available tomorrow",
      rating: 4.7,
      sessions: 156,
      approach: "Motivational Interviewing",
      languages: ["English"],
      isOnline: false
    }
  ];

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      alcohol: "🍷",
      substance: "💊",
      gaming: "🎮",
      smoking: "🚭",
      gambling: "🎰",
      "social media": "📱"
    };
    return icons[type?.toLowerCase() || ""] || "🤝";
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-safe py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/find-mentors">
            <Button variant="ghost" size="sm">
              ← Back to Categories
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.map((mentor) => (
            <Card key={mentor.id} className="shadow-gentle hover:shadow-warm transition-all duration-300 border-border">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-2xl">
                      {mentor.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{mentor.username}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {mentor.specialization} Specialist
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mentor.isOnline ? (
                      <Badge variant="default" className="bg-trust text-trust-foreground">
                        ● Online
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        ● Offline
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Experience:</span>
                    <p className="font-medium text-foreground">{mentor.experience}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sessions:</span>
                    <p className="font-medium text-foreground">{mentor.sessions} completed</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span>
                    <p className="font-medium text-foreground">⭐ {mentor.rating}/5.0</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <p className="font-medium text-foreground">{mentor.availability}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Approach:</span>
                  <p className="text-foreground">{mentor.approach}</p>
                </div>
                
                <div>
                  <span className="text-muted-foreground text-sm">Languages:</span>
                  <div className="flex gap-1 mt-1">
                    {mentor.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Link to={`/chat/${mentor.id}`}>
                    <Button variant="supportive" className="flex-1">
                      Start Chat
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
  );
};

export default MentorsByType;