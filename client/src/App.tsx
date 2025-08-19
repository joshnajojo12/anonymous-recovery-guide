import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import Index from "./pages/Index";
import FindMentors from "./pages/FindMentors";
import MentorsByType from "./pages/MentorsByType";
import BecomeMentor from "./pages/BecomeMentor";
import MentorDashboard from "./pages/MentorDashboard"; 
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Switch>
            <Route path="/" component={Index} />
            <Route path="/find-mentors" component={FindMentors} />
            <Route path="/mentors/:type" component={MentorsByType} />
            <Route path="/become-mentor" component={BecomeMentor} />
            <Route path="/mentor-dashboard" component={MentorDashboard} />
            <Route path="/chat/:mentorId" component={Chat} />
            <Route path="/auth" component={Auth} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
