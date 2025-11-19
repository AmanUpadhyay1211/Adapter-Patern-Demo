import { io, Socket } from "socket.io-client";
import type { Student } from "../types";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:4000";

export interface StudentUpdatedEvent {
  student: Student & { globalVersion?: number };
  globalVersion: number;
}

export class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("🔌 Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      this.isConnected = false;
      console.log("❌ Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    return this.socket;
  }

  onStudentUpdated(callback: (event: StudentUpdatedEvent) => void): void {
    if (!this.socket) {
      this.connect();
    }
    
    this.socket?.on("studentUpdated", callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 Socket disconnected");
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }
}

export const socketService = new SocketService();

