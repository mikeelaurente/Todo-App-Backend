import { Types } from 'mongoose';

export type TodoQueryType = {
  search?: string;
  cursor?: string;
  limit?: number;
  status?: 'pending' | 'completed';
};

export interface TodoType {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: Types.ObjectId;
  isPinned: boolean;
  pinnedAt: Date | null;
}

export type TodoStatusType = 'pending' | 'completed';

export type CreateTodoType = {
  title: string;
  description?: string;
  isPinned?: boolean;
};

export type UpdateTodoType = {
  _id: string;
  title?: string;
  description?: string;
  status?: TodoStatusType;
  isPinned?: boolean;
};

export type TodoFilterType = Partial<TodoType>;

export interface TodoDocumentType extends TodoType {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
