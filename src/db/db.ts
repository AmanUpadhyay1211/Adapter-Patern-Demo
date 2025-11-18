import Dexie, { type Table } from "dexie";
import type { Student } from "../types";

export class AppDB extends Dexie {
  students!: Table<Student, string>; // primary key is id

  constructor() {
    super("StudentDB");
    this.version(1).stores({
      students: "id, rollNumber, name, bloodGroup, class, section, phone, email, attendance, lastUpdated"  // student table fields
    });
  }
}

export const db = new AppDB();
