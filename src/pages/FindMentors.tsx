import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FindMentors = () => {
  const addictionTypes = [
    {
      type: "Alcohol",
      icon: "🍷",
      description: "Professional support for alcohol dependency recovery",
      mentors: "127 mentors",
      available: 23
    },
    {
      type: "Substance",
      icon: "💊", 
      description: "Guidance from those who've overcome drug addiction",
      mentors: "94 mentors",
      available: 18
    },
    {
      type: "Gaming",
      icon: "🎮",
      description: "Break free from gaming addiction with expert help", 
      mentors: "56 mentors",
      available: 12
    },
    {
      type: "Smoking",
      icon: "🚭",
      description: "Quit smoking with personalized mentorship support",
      mentors: "89 mentors", 
      available: 15
    },
    {
      type: "Gambling",
      icon: "🎰",
      description: "Overcome gambling addiction with experienced guides",
      mentors: "43 mentors",
      available: 8
    },
    {
      type: "Social Media",
      icon: "📱",
      description: "Regain control over social media and digital habits",
      mentors: "71 mentors",
      available: 19
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-safe py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Recovery Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced mentors who understand your journey. 
            Choose your area of recovery to get matched with the right support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addictionTypes.map((addiction, index) => (
            <Card key={index} className="shadow-gentle hover:shadow-warm transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{addiction.icon}</div>
                <CardTitle className="text-xl text-foreground">{addiction.type}</CardTitle>
                <CardDescription className="text-trust font-medium text-sm">
                  {addiction.available} available now
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-center mb-4 leading-relaxed">
                  {addiction.description}
                </p>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {addiction.mentors}
                </p>
                <Link to={`/mentors/${addiction.type.toLowerCase()}`}>
                  <Button variant="supportive" className="w-full">
                    Connect Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-card shadow-warm rounded-soft p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-muted-foreground mb-6">
              Not sure which category fits your needs? Our intake process will help 
              match you with the most suitable mentor for your specific situation.
            </p>
            <Button variant="hero" size="lg">
              Take Matching Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindMentors;