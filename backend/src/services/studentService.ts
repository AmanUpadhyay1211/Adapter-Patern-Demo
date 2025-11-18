import { Op } from "sequelize";
import { Student } from "../models/student";
import type { StudentAttributes } from "../types/student";
import { seedStudents } from "../seed/students";

export async function ensureSeedData() {
  const count = await Student.count();
  if (count === 0) {
    await Student.bulkCreate(seedStudents);
    console.log(`🌱 Seeded ${seedStudents.length} students`);
  }
}

export async function listStudents() {
  return Student.findAll({ order: [["rollNumber", "ASC"]] });
}

export async function updateStudent(id: string, changes: Partial<StudentAttributes>) {
  const student = await Student.findByPk(id);
  if (!student) {
    return null;
  }

  const nextValues = {
    ...student.toJSON(),
    ...changes,
    lastUpdated: new Date().toISOString(),
  };

  await student.update(nextValues);
  return student;
}

export async function searchStudents(term: string) {
  return Student.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${term}%` } },
        { rollNumber: { [Op.like]: `%${term}%` } },
        { email: { [Op.like]: `%${term}%` } },
      ],
    },
  });
}

