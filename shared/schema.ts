import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Resume schema
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  personalInfo: text("personal_info").notNull(),
  education: text("education").notNull(),
  experience: text("experience").notNull(),
  skills: text("skills").notNull(),
  projects: text("projects").notNull(),
  certificates: text("certificates").notNull(),
  profileImage: text("profile_image"),
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  location: z.string(),
  summary: z.string(),
});

export const educationSchema = z.array(z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
}));

export const experienceSchema = z.array(z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
}));

export const projectSchema = z.array(z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  technologies: z.string(),
  link: z.string().optional(),
}));

export const certificateSchema = z.array(z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string(),
  date: z.string(),
  fileUrl: z.string().optional(),
}));

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  education: educationSchema,
  experience: experienceSchema,
  skills: z.array(z.string()),
  projects: projectSchema,
  certificates: certificateSchema,
  profileImage: z.string().optional(),
});

export const insertResumeSchema = createInsertSchema(resumes);
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeData = z.infer<typeof resumeSchema>;
