import { Router } from "express";
import { listStudents, updateStudent } from "../services/studentService";
import type { StudentAttributes } from "../types/student";

const router = Router();

router.get("/", async (_req, res) => {
  console.log("Fetching students... For route /api/students");
  try {
    const students = await listStudents();
    res.json(students);
  } catch (error) {
    console.error("Failed to fetch students", error);
    res.status(500).json({ message: "Unable to fetch students" });
  }
});

router.put("/:id", async (req, res) => {
  console.log("Updating student... For route /api/students/:id");
  const { id } = req.params;
  const payload = req.body as Partial<StudentAttributes>;

  if (!id) {
    return res.status(400).json({ message: "Student id is required" });
  }

  if (payload.attendance !== undefined) {
    const attendance = Number(payload.attendance);
    if (Number.isNaN(attendance) || attendance < 0 || attendance > 100) {
      return res.status(400).json({ message: "Attendance must be between 0 and 100" });
    }
    payload.attendance = attendance;
  }

  try {
    const student = await updateStudent(id, payload);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    console.error(`Failed to update student ${id}`, error);
    res.status(500).json({ message: "Unable to update student" });
  }
});

export default router;

