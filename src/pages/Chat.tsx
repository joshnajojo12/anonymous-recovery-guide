import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Phone, Video, MoreVertical, Shield } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mentor";
  timestamp: string;
}

const Chat = () => {
  const { mentorId } = useParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm here to help you on your recovery journey. How are you feeling today?",
      sender: "mentor",
      timestamp: "2:30 PM"
    },
    {
      id: "2", 
      text: "Hi, thank you for being here. I'm struggling a bit today but I'm committed to staying sober.",
      sender: "user",
      timestamp: "2:32 PM"
    },
    {
      id: "3",
      text: "I appreciate your honesty. It's completely normal to have difficult days. What specifically is challenging you today?",
      sender: "mentor", 
      timestamp: "2:33 PM"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate mentor response after a delay
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing that with me. Let's work through this together.",
        sender: "mentor",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, mentorResponse]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-4 max-w-4xl mx-auto px-safe">
        {/* Chat Header */}
        <Card className="mb-4">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    M{mentorId || "1"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Anonymous Mentor</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Online
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Chat Messages */}
        <Card className="flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
          <CardContent className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" 
                        ? "text-primary-foreground/70" 
                        : "text-muted-foreground"
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" variant="hero">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Back Button */}
        <div className="mt-4 text-center">
          <Link to="/find-mentors">
            <Button variant="outline">
              Back to Mentors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Chat;