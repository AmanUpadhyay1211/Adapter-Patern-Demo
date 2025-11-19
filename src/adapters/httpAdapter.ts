import type { Student } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function buildUrl(path: string) {
  console.log("API_BASE_URL", API_BASE_URL);
  const normalizedBase = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${normalizedBase}${path}`;
}

export class StaleVersionError extends Error {
  public serverVersion: number;
  
  constructor(serverVersion: number, message: string = "Stale version") {
    super(message);
    this.name = "StaleVersionError";
    this.serverVersion = serverVersion;
  }
}

export class HttpAdapter {
  async fetchStudents(): Promise<{ students: Student[]; globalVersion: number }> {
    const response = await fetch(buildUrl("/api/students"));
    if (!response.ok) {
      throw new Error("Failed to fetch students");
    }
    return response.json();
  }

  async updateStudent(
    id: string,
    payload: Partial<Student>,
    clientVersion: number
  ): Promise<Student & { globalVersion?: number }> {
    console.log("Updating student", id, payload, buildUrl(`/api/students/${id}`));
    const response = await fetch(buildUrl(`/api/students/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        clientVersion,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      
      // Handle 409 Conflict (stale version)
      if (response.status === 409) {
        const serverVersion = errorBody?.serverVersion ?? clientVersion;
        throw new StaleVersionError(serverVersion, errorBody?.message ?? "Stale version");
      }
      
      const message = errorBody?.message ?? "Failed to update student";
      throw new Error(message);
    }

    return response.json();
  }
}