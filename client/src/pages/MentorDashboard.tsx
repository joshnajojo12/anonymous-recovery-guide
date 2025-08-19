import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Users, Clock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (!user) return;

    const fetchMentorData = async () => {
      try {
        // Check if user is a mentor
        const { data: mentor, error: mentorError } = await supabase
          .from('mentors')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (mentorError || !mentor) {
          toast({
            title: "Access Denied",
            description: "You need to register as a mentor first",
            variant: "destructive"
          });
          navigate("/become-mentor");
          return;
        }

        setMentorProfile(mentor);

        // Fetch chat rooms for this mentor
        const { data: rooms, error: roomsError } = await supabase
          .from('chat_rooms')
          .select('*')
          .eq('mentor_id', user.id)
          .order('created_at', { ascending: false });

        if (roomsError) throw roomsError;

        // For each room, get the latest message, patient profile, and unread count
        const roomsWithMessages = await Promise.all(
          (rooms || []).map(async (room) => {
            // Get patient profile
            const { data: patientProfile } = await supabase
              .from('profiles')
              .select('username, full_name')
              .eq('user_id', room.patient_id)
              .single();

            // Get latest message
            const { data: latestMessage } = await supabase
              .from('messages')
              .select('content, created_at, sender_id')
              .eq('chat_room_id', room.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // Get unread count (messages from patient that mentor hasn't seen)
            const { count: unreadCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('chat_room_id', room.id)
              .eq('sender_id', room.patient_id);

            return {
              ...room,
              patient_profile: patientProfile,
              latest_message: latestMessage,
              unread_count: unreadCount || 0
            };
          })
        );

        setChatRooms(roomsWithMessages);
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load your mentor dashboard",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMentorData();

    // Set up real-time subscription for new chat rooms and messages
    const chatRoomsChannel = supabase
      .channel('mentor-chat-rooms')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_rooms',
          filter: `mentor_id=eq.${user.id}`
        },
        () => {
          fetchMentorData(); // Refresh data when new chat room is created
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel('mentor-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchMentorData(); // Refresh data when new message is received
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatRoomsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [user, toast, navigate]);

  if (loading) {
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
                  <p className="text-2xl font-bold">{chatRooms.filter(room => room.unread_count > 0).length}</p>
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
                {chatRooms.map((room) => (
                  <Link key={room.id} to={`/chat/${room.id}`}>
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {room.patient_profile?.username?.[0]?.toUpperCase() || "P"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold truncate">
                            {room.patient_profile?.full_name || room.patient_profile?.username || "Anonymous Patient"}
                          </h4>
                          <div className="flex items-center gap-2">
                            {room.latest_message && (
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(room.latest_message.created_at)}
                              </span>
                            )}
                            {room.unread_count > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {room.unread_count}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {room.latest_message && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {room.latest_message.sender_id === user?.id ? "You: " : ""}
                            {room.latest_message.content}
                          </p>
                        )}
                        
                        {!room.latest_message && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Chat started {formatTimeAgo(room.created_at)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Encrypted
                        </Badge>
                      </div>
                    </div>
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