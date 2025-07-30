import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (preserved from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  grade: integer("grade").notNull(),
  school: text("school").notNull(),
  studentId: text("student_id").notNull().unique(),
  gpa: text("gpa").notNull(),
  userId: integer("user_id").notNull(),
  imageUrl: text("image_url"),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  grade: true,
  school: true,
  studentId: true,
  gpa: true,
  userId: true,
  imageUrl: true,
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;

// Career Interests table
export const careerInterests = pgTable("career_interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
});

export const insertCareerInterestSchema = createInsertSchema(careerInterests).pick({
  name: true,
  icon: true,
});

export type InsertCareerInterest = z.infer<typeof insertCareerInterestSchema>;
export type CareerInterest = typeof careerInterests.$inferSelect;

// Career Pathways table (courses, certifications, majors, careers)
export const careerPathways = pgTable("career_pathways", {
  id: serial("id").primaryKey(),
  interestId: integer("interest_id").notNull(),
  pathwayType: text("pathway_type").notNull(), // 'course', 'certification', 'major', 'career'
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // 'completed', 'in-progress', 'available', 'eligible', 'recommended', 'option'
  additionalInfo: jsonb("additional_info"), // For storing type-specific additional information
});

export const insertCareerPathwaySchema = createInsertSchema(careerPathways).pick({
  interestId: true,
  pathwayType: true,
  title: true,
  description: true,
  status: true,
  additionalInfo: true,
});

export type InsertCareerPathway = z.infer<typeof insertCareerPathwaySchema>;
export type CareerPathway = typeof careerPathways.$inferSelect;

// Student Progress table
export const studentProgress = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  interestId: integer("interest_id").notNull(),
  percentage: integer("percentage").notNull(),
  completedSteps: jsonb("completed_steps").notNull(),
});

export const insertStudentProgressSchema = createInsertSchema(studentProgress).pick({
  studentId: true,
  interestId: true,
  percentage: true,
  completedSteps: true,
});

export type InsertStudentProgress = z.infer<typeof insertStudentProgressSchema>;
export type StudentProgress = typeof studentProgress.$inferSelect;

// Similar Pathways table
export const similarPathways = pgTable("similar_pathways", {
  id: serial("id").primaryKey(),
  interestId: integer("interest_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  iconBg: text("icon_bg").notNull(),
  iconColor: text("icon_color").notNull(),
  tags: jsonb("tags").notNull(),
});

export const insertSimilarPathwaySchema = createInsertSchema(similarPathways).pick({
  interestId: true,
  title: true,
  description: true,
  icon: true,
  iconBg: true,
  iconColor: true,
  tags: true,
});

export type InsertSimilarPathway = z.infer<typeof insertSimilarPathwaySchema>;
export type SimilarPathway = typeof similarPathways.$inferSelect;
