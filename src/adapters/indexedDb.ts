import { db } from "../db/db";
import type { Student } from "../types";

export class IndexedDBAdapter {
  
  async getAll(): Promise<Student[]> {
    return await db.students.toArray();
  }

  async getById(id: string): Promise<Student | undefined> {
    return await db.students.get(id);
  }

  async addMany(students: Student[]): Promise<void> {
    await db.students.bulkPut(students);
  }

  async add(student: Student): Promise<void> {
    await db.students.put(student);
  }

  async update(id: string, data: Partial<Student>): Promise<void> {
    await db.students.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await db.students.delete(id);
  }

  async clear(): Promise<void> {
    await db.students.clear();
  }
}
