import type { Student } from "../types";
import { getStudents } from "../api/student";

export class HttpAdapter {

  async fetchStudents(): Promise<Student[]> {
    // Simulate network delay (300-1300ms)
    await new Promise(r => setTimeout(r, Math.random() * 1000 + 300));
    
    // Simulate network failure 10% of the time (for testing offline behavior)
    if (Math.random() < 0.1) {
      throw new Error("Network error: Failed to fetch students");
    }

    //Using mock api in real world this would  be like something like const res = await fetch("/api/students");
    return getStudents();
  }
}