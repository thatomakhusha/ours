export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type Task = {
  taskId: number;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  isCompleted: boolean;
  isShared: boolean;
  ownerId: number | null;
  completedAt: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
};