import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ChatPreview = () => {
  return (
    <section className="py-20 px-safe bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Safe, Anonymous Conversations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience secure, encrypted messaging with your recovery mentor. 
            No personal information, just meaningful support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Chat Interface Preview */}
          <div className="bg-card shadow-warm rounded-soft overflow-hidden border border-border">
            <div className="bg-primary/10 p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  🎭
                </div>
                <div>
                  <h4 className="font-medium text-foreground">MentorSage47</h4>
                  <p className="text-sm text-trust">● Online - Alcohol Recovery Specialist</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4 h-80 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm">🎭</div>
                <div className="bg-secondary rounded-soft p-3 max-w-xs">
                  <p className="text-sm text-secondary-foreground">
                    Welcome! I'm here to support you on your recovery journey. How are you feeling today?
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2:34 PM</p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <div className="bg-primary rounded-soft p-3 max-w-xs">
                  <p className="text-sm text-primary-foreground">
                    Thanks for being here. I've been struggling lately and could really use some guidance.
                  </p>
                  <p className="text-xs text-primary-foreground/70 mt-2">2:36 PM</p>
                </div>
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-sm">🌟</div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm">🎭</div>
                <div className="bg-secondary rounded-soft p-3 max-w-xs">
                  <p className="text-sm text-secondary-foreground">
                    I understand, and you're brave for reaching out. Let's talk about what specific challenges you're facing right now.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2:38 PM</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <div className="flex-1 bg-input rounded-soft px-4 py-2 text-sm text-muted-foreground">
                  Type your message...
                </div>
                <Button size="sm" variant="supportive">Send</Button>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-trust/20 rounded-soft flex items-center justify-center">
                  <span className="text-trust text-xl">🔐</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">End-to-End Encryption</h3>
                  <p className="text-muted-foreground">All messages are encrypted and can only be read by you and your mentor.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-soft flex items-center justify-center">
                  <span className="text-primary text-xl">🎭</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Anonymous Identities</h3>
                  <p className="text-muted-foreground">Both you and your mentor use anonymous usernames and avatars.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-soft flex items-center justify-center">
                  <span className="text-accent text-xl">📞</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Voice & Video Calls</h3>
                  <p className="text-muted-foreground">Optional anonymous voice and video calls when both parties agree.</p>
                </div>
              </div>
            </div>
            
            <Link to="/find-mentors">
              <Button variant="hero" size="lg" className="w-full">
                Start Your Recovery Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatPreview;