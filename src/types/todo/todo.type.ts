import { Types } from "mongoose";

export type TodoQueryType = {
  search?: string;
  page?: number;
  limit?: number;
  status?: "pending" | "completed";
};

export interface TodoType {
  title: string;
  description?: string;
  status: "pending" | "completed";
  userId: Types.ObjectId;
  isPinned: boolean;
  pinnedAt: Date | null;
}

export type TodoFilterType = Partial<TodoType>;

export interface TodoDocumentType extends TodoType {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
