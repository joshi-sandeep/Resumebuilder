import { resumes, type Resume, type InsertResume } from "@shared/schema";

export interface IStorage {
  getResume(id: number): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: InsertResume): Promise<Resume>;
}

export class MemStorage implements IStorage {
  private resumes: Map<number, Resume>;
  private currentId: number;

  constructor() {
    this.resumes = new Map();
    this.currentId = 1;
  }

  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const id = this.currentId++;
    const newResume: Resume = { ...resume, id };
    this.resumes.set(id, newResume);
    return newResume;
  }

  async updateResume(id: number, resume: InsertResume): Promise<Resume> {
    if (!this.resumes.has(id)) {
      throw new Error("Resume not found");
    }
    const updatedResume: Resume = { ...resume, id };
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }
}

export const storage = new MemStorage();
