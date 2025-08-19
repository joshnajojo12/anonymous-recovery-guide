import { 
  users, profiles, mentors, chatRooms, messages,
  type User, type InsertUser, type Profile, type InsertProfile,
  type Mentor, type InsertMentor, type ChatRoom, type InsertChatRoom,
  type Message, type InsertMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count, ilike } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  
  // Mentor methods
  getMentor(userId: string): Promise<Mentor | undefined>;
  getMentorsBySpecialization(specialization: string): Promise<Mentor[]>;
  getAllAvailableMentors(): Promise<Mentor[]>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  updateMentor(userId: string, mentor: Partial<InsertMentor>): Promise<Mentor | undefined>;
  
  // Chat room methods
  getChatRoom(id: string): Promise<ChatRoom | undefined>;
  getChatRoomsByMentor(mentorId: string): Promise<ChatRoom[]>;
  getChatRoomsByPatient(patientId: string): Promise<ChatRoom[]>;
  findChatRoom(mentorId: string, patientId: string): Promise<ChatRoom | undefined>;
  createChatRoom(chatRoom: InsertChatRoom): Promise<ChatRoom>;
  
  // Message methods
  getMessages(chatRoomId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  getUnreadCount(chatRoomId: string, userId: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Profile methods
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile || undefined;
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.username, username));
    return profile || undefined;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        ...insertProfile,
        userType: insertProfile.userType as 'mentor' | 'patient'
      })
      .returning();
    return profile;
  }

  async updateProfile(userId: string, profileUpdate: Partial<InsertProfile>): Promise<Profile | undefined> {
    const updateData: any = { ...profileUpdate, updatedAt: new Date() };
    if (profileUpdate.userType) {
      updateData.userType = profileUpdate.userType as 'mentor' | 'patient';
    }
    const [profile] = await db
      .update(profiles)
      .set(updateData)
      .where(eq(profiles.userId, userId))
      .returning();
    return profile || undefined;
  }

  // Mentor methods
  async getMentor(userId: string): Promise<Mentor | undefined> {
    const [mentor] = await db.select().from(mentors).where(eq(mentors.userId, userId));
    return mentor || undefined;
  }

  async getMentorsBySpecialization(specialization: string): Promise<Mentor[]> {
    return await db
      .select()
      .from(mentors)
      .where(and(
        eq(mentors.isAvailable, true),
        ilike(mentors.specialization, `%${specialization}%`)
      ));
  }

  async getAllAvailableMentors(): Promise<Mentor[]> {
    return await db
      .select()
      .from(mentors)
      .where(eq(mentors.isAvailable, true));
  }

  async createMentor(insertMentor: InsertMentor): Promise<Mentor> {
    const [mentor] = await db
      .insert(mentors)
      .values(insertMentor)
      .returning();
    return mentor;
  }

  async updateMentor(userId: string, mentorUpdate: Partial<InsertMentor>): Promise<Mentor | undefined> {
    const [mentor] = await db
      .update(mentors)
      .set({ ...mentorUpdate, updatedAt: new Date() })
      .where(eq(mentors.userId, userId))
      .returning();
    return mentor || undefined;
  }

  // Chat room methods
  async getChatRoom(id: string): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db.select().from(chatRooms).where(eq(chatRooms.id, id));
    return chatRoom || undefined;
  }

  async getChatRoomsByMentor(mentorId: string): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.mentorId, mentorId))
      .orderBy(desc(chatRooms.createdAt));
  }

  async getChatRoomsByPatient(patientId: string): Promise<ChatRoom[]> {
    return await db
      .select()
      .from(chatRooms)
      .where(eq(chatRooms.patientId, patientId))
      .orderBy(desc(chatRooms.createdAt));
  }

  async findChatRoom(mentorId: string, patientId: string): Promise<ChatRoom | undefined> {
    const [chatRoom] = await db
      .select()
      .from(chatRooms)
      .where(and(
        eq(chatRooms.mentorId, mentorId),
        eq(chatRooms.patientId, patientId)
      ));
    return chatRoom || undefined;
  }

  async createChatRoom(insertChatRoom: InsertChatRoom): Promise<ChatRoom> {
    const [chatRoom] = await db
      .insert(chatRooms)
      .values(insertChatRoom)
      .returning();
    return chatRoom;
  }

  // Message methods
  async getMessages(chatRoomId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatRoomId, chatRoomId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getUnreadCount(chatRoomId: string, excludeSenderId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(messages)
      .where(and(
        eq(messages.chatRoomId, chatRoomId),
        eq(messages.senderId, excludeSenderId)
      ));
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();
