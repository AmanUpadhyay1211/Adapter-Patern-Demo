import type { Student } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function buildUrl(path: string) {
  console.log("API_BASE_URL", API_BASE_URL);
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${normalizedBase}${path}`;
}

export class HttpAdapter {
  async fetchStudents(): Promise<Student[]> {
    const response = await fetch(buildUrl("/api/students"));
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    return response.json();
  }

  async updateStudent(id: string, payload: Partial<Student>): Promise<Student> {
    console.log("Updating student", id, payload, buildUrl(`/api/students/${id}`));
    const response = await fetch(buildUrl(`/api/students/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message = errorBody?.message ?? "Failed to update student";
      throw new Error(message);
    }

    return response.json();
  }
}