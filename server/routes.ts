import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertMentorSchema, insertChatRoomSchema, insertMessageSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const profile = await storage.getProfileByUsername(email);
        if (!profile) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        // For now, we'll simulate password checking
        // In a real app, you'd hash and compare passwords properly
        return done(null, profile);
      } catch (error) {
        return done(error);
      }
    }
  ));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const profile = await storage.getProfile(id);
      done(null, profile);
    } catch (error) {
      done(error);
    }
  });

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  };

  // Profile routes
  app.get('/api/profiles/:userId', async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.post('/api/profiles', async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: 'Invalid profile data' });
    }
  });

  app.put('/api/profiles/:userId', async (req, res) => {
    try {
      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(req.params.userId, validatedData);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: 'Invalid profile data' });
    }
  });

  // Mentor routes
  app.get('/api/mentors', async (req, res) => {
    try {
      const { specialization } = req.query;
      let mentors;
      
      if (specialization && typeof specialization === 'string') {
        mentors = await storage.getMentorsBySpecialization(specialization);
      } else {
        mentors = await storage.getAllAvailableMentors();
      }

      // Get profiles for each mentor
      const mentorsWithProfiles = await Promise.all(
        mentors.map(async (mentor) => {
          const profile = await storage.getProfile(mentor.userId);
          return { ...mentor, profile };
        })
      );

      res.json(mentorsWithProfiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mentors' });
    }
  });

  app.get('/api/mentors/:userId', async (req, res) => {
    try {
      const mentor = await storage.getMentor(req.params.userId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }
      
      const profile = await storage.getProfile(mentor.userId);
      res.json({ ...mentor, profile });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mentor' });
    }
  });

  app.post('/api/mentors', async (req, res) => {
    try {
      const validatedData = insertMentorSchema.parse(req.body);
      const mentor = await storage.createMentor(validatedData);
      res.status(201).json(mentor);
    } catch (error) {
      res.status(400).json({ error: 'Invalid mentor data' });
    }
  });

  app.put('/api/mentors/:userId', async (req, res) => {
    try {
      const validatedData = insertMentorSchema.partial().parse(req.body);
      const mentor = await storage.updateMentor(req.params.userId, validatedData);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }
      res.json(mentor);
    } catch (error) {
      res.status(400).json({ error: 'Invalid mentor data' });
    }
  });

  // Chat room routes
  app.get('/api/chat-rooms', async (req, res) => {
    try {
      const { mentorId, patientId } = req.query;
      let chatRooms;

      if (mentorId && typeof mentorId === 'string') {
        chatRooms = await storage.getChatRoomsByMentor(mentorId);
      } else if (patientId && typeof patientId === 'string') {
        chatRooms = await storage.getChatRoomsByPatient(patientId);
      } else {
        return res.status(400).json({ error: 'mentorId or patientId required' });
      }

      // Get profiles for each chat room
      const chatRoomsWithProfiles = await Promise.all(
        chatRooms.map(async (room) => {
          const mentorProfile = await storage.getProfile(room.mentorId);
          const patientProfile = await storage.getProfile(room.patientId);
          const latestMessages = await storage.getMessages(room.id);
          const latestMessage = latestMessages[latestMessages.length - 1];
          
          return {
            ...room,
            mentorProfile,
            patientProfile,
            latestMessage,
            unreadCount: 0 // Simplified for now
          };
        })
      );

      res.json(chatRoomsWithProfiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
  });

  app.get('/api/chat-rooms/:id', async (req, res) => {
    try {
      const chatRoom = await storage.getChatRoom(req.params.id);
      if (!chatRoom) {
        return res.status(404).json({ error: 'Chat room not found' });
      }

      const mentorProfile = await storage.getProfile(chatRoom.mentorId);
      const patientProfile = await storage.getProfile(chatRoom.patientId);

      res.json({
        ...chatRoom,
        mentorProfile,
        patientProfile
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat room' });
    }
  });

  app.post('/api/chat-rooms', async (req, res) => {
    try {
      const validatedData = insertChatRoomSchema.parse(req.body);
      
      // Check if chat room already exists
      const existingRoom = await storage.findChatRoom(validatedData.mentorId, validatedData.patientId);
      if (existingRoom) {
        return res.json(existingRoom);
      }

      const chatRoom = await storage.createChatRoom(validatedData);
      res.status(201).json(chatRoom);
    } catch (error) {
      res.status(400).json({ error: 'Invalid chat room data' });
    }
  });

  // Message routes
  app.get('/api/messages', async (req, res) => {
    try {
      const { chatRoomId } = req.query;
      if (!chatRoomId || typeof chatRoomId !== 'string') {
        return res.status(400).json({ error: 'chatRoomId required' });
      }

      const messages = await storage.getMessages(chatRoomId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: 'Invalid message data' });
    }
  });

  // Auth routes (simplified for demo)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, username, fullName, userType } = req.body;
      
      // Check if profile already exists
      const existingProfile = await storage.getProfileByUsername(email);
      if (existingProfile) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create profile (simplified - in real app you'd hash passwords and use proper user management)
      const profile = await storage.createProfile({
        userId: `user_${Date.now()}`, // Generate unique ID
        username: username || email,
        fullName: fullName || username,
        userType: userType || 'patient'
      });

      res.status(201).json({ 
        user: profile,
        session: { user: profile } // Simplified session
      });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create account' });
    }
  });

  app.post('/api/auth/signin', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const profile = await storage.getProfileByUsername(email);
      if (!profile) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Simplified auth - in real app you'd verify password hash
      res.json({ 
        user: profile,
        session: { user: profile }
      });
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    // Simplified - in a real app you'd check session or JWT
    // For now, return no user since we don't have persistent sessions
    res.status(401).json({ error: 'Not authenticated' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
