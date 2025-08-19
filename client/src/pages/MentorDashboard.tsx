import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Clock, Shield } from "lucide-react";
import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile } from '@shared/schema';

interface ChatRoom {
  id: string;
  mentor_id: string;
  patient_id: string;
  created_at: string;
  patient_profile?: {
    username: string;
    full_name: string;
  };
  latest_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

const MentorDashboard = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: chatRooms = [], isLoading } = useQuery({
    queryKey: ['/api/chat-rooms/mentor'],
  });

  useEffect(() => {
    // Simplified auth check - in production you'd verify session
    const userId = `user_${Date.now()}`;
    setUser({ id: userId, userId, username: 'mentor', userType: 'mentor' } as Profile);
    setMentorProfile({ specialization: 'Recovery Support' });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 flex items-center justify-center">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-safe">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Manage your conversations and help people on their recovery journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatRooms.length}</p>
                  <p className="text-sm text-muted-foreground">Active Chats</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-trust/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-trust" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatRooms.filter((room: any) => room.unread_count > 0).length}</p>
                  <p className="text-sm text-muted-foreground">New Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warmth/10 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-warmth" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mentorProfile?.specialization || "Recovery"}</p>
                  <p className="text-sm text-muted-foreground">Your Specialty</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            {chatRooms.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground">
                  Patients will reach out to you through the Find Mentors page.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {chatRooms.map((room: any) => (
                  <Link key={room.id} to={`/chat/${room.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {room.patient_profile?.username?.substring(0, 2).toUpperCase() || "AN"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">
                                  {room.patient_profile?.full_name || room.patient_profile?.username || "Anonymous User"}
                                </p>
                                {room.unread_count > 0 && (
                                  <Badge variant="destructive" className="text-xs px-2 py-0">
                                    {room.unread_count}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {room.latest_message?.content || "No messages yet"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {room.latest_message?.created_at ? formatTimeAgo(room.latest_message.created_at) : ""}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentorDashboard;