import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Complete Anonymity",
    description: "Random usernames, preset avatars, no personal information shared ever",
    icon: "🎭",
    highlight: "Zero identity exposure"
  },
  {
    title: "Secure Matching",
    description: "AI-powered mentor matching based on addiction type and experience",
    icon: "🤝",
    highlight: "Perfect mentor fit"
  },
  {
    title: "Encrypted Chat",
    description: "End-to-end encrypted messaging with optional voice and video calls",
    icon: "🔐",
    highlight: "Military-grade security"
  },
  {
    title: "Session Notes",
    description: "Private progress tracking and session notes between you and your mentor",
    icon: "📝",
    highlight: "Track your journey"
  },
  {
    title: "Anonymous Payments",
    description: "Secure payment processing that maintains complete anonymity",
    icon: "💳",
    highlight: "No financial exposure"
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock platform support for any technical or safety issues",
    icon: "🛟",
    highlight: "Always here for you"
  }
];

const AnonymousFeatures = () => {
  return (
    <section className="py-20 px-safe bg-gradient-support">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Built for Complete Privacy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every aspect of our platform is designed to protect your identity while 
            providing the most effective recovery support possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card/50 backdrop-blur-sm border-border shadow-gentle hover:shadow-warm transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl text-foreground mb-2">{feature.title}</CardTitle>
                <CardDescription className="text-trust font-medium text-sm">
                  {feature.highlight}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-card/70 backdrop-blur-sm rounded-soft p-8 shadow-warm max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Your Recovery, Your Rules
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Take control of your recovery journey with the confidence that your privacy 
              is completely protected. No judgment, no exposure, just support when you need it most.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnonymousFeatures;