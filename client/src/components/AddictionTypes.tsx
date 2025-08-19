import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const addictionTypes = [
  {
    type: "Alcohol",
    icon: "🍷",
    description: "Professional support for alcohol dependency recovery",
    mentors: "127 mentors"
  },
  {
    type: "Substance",
    icon: "💊",
    description: "Guidance from those who've overcome drug addiction",
    mentors: "94 mentors"
  },
  {
    type: "Gaming",
    icon: "🎮",
    description: "Break free from gaming addiction with expert help",
    mentors: "56 mentors"
  },
  {
    type: "Smoking",
    icon: "🚭",
    description: "Quit smoking with personalized mentorship support",
    mentors: "89 mentors"
  },
  {
    type: "Gambling",
    icon: "🎰",
    description: "Overcome gambling addiction with experienced guides",
    mentors: "43 mentors"
  },
  {
    type: "Social Media",
    icon: "📱",
    description: "Regain control over social media and digital habits",
    mentors: "71 mentors"
  }
];

const AddictionTypes = () => {
  return (
    <section className="py-20 px-safe bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Recovery Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with mentors who specialize in your specific area of recovery.
            All interactions remain completely anonymous.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addictionTypes.map((addiction, index) => (
            <Card key={index} className="shadow-gentle hover:shadow-warm transition-all duration-300 border-border">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-3">{addiction.icon}</div>
                <CardTitle className="text-xl text-foreground">{addiction.type}</CardTitle>
                <CardDescription className="text-primary font-medium text-sm">
                  {addiction.mentors}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                  {addiction.description}
                </p>
                <Link to="/find-mentors">
                  <Button variant="outline" className="w-full">
                    Find Mentors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Don't see your specific area? We support all types of addiction recovery.
          </p>
          <Link to="/find-mentors">
            <Button variant="supportive" size="lg">
              Browse All Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AddictionTypes;