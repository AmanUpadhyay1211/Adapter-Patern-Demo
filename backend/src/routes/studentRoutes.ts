import { Router } from "express";
import { listStudents, updateStudent } from "../services/studentService";
import { getGlobalVersion } from "../services/versionService";
import type { StudentAttributes } from "../types/student";

const router = Router();

router.get("/", async (_req, res) => {
  console.log("Fetching students... For route /api/students");
  try {
    const students = await listStudents();
    const globalVersion = await getGlobalVersion();
    res.json({ students, globalVersion });
  } catch (error) {
    console.error("Failed to fetch students", error);
    res.status(500).json({ message: "Unable to fetch students" });
  }
});

router.put("/:id", async (req, res) => {
  console.log("Updating student... For route /api/students/:id");
  const { id } = req.params;
  const body = req.body as Partial<StudentAttributes> & { clientVersion?: number };
  const { clientVersion, ...payload } = body;
  const io = req.app.locals.io as import("socket.io").Server;

  if (!id) {
    return res.status(400).json({ message: "Student id is required" });
  }

  // Version check: clientVersion is required
  if (clientVersion === undefined) {
    return res.status(400).json({ message: "clientVersion is required" });
  }

  // Get current server version
  const serverVersion = await getGlobalVersion();

  // Check if client version is stale
  if (clientVersion < serverVersion) {
    return res.status(409).json({
      message: "Stale version",
      serverVersion,
    });
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
    
    // Get the new version after increment
    const newVersion = await getGlobalVersion();
    
    const studentData = { ...student.toJSON(), globalVersion: newVersion };
    
    // Emit socket event to all connected clients
    io.emit("studentUpdated", {
      student: studentData,
      globalVersion: newVersion,
    });
    
    // Return student with new version
    res.json(studentData);
  } catch (error) {
    console.error(`Failed to update student ${id}`, error);
    res.status(500).json({ message: "Unable to update student" });
  }
});

export default router;

