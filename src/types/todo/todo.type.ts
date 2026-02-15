import { Document } from 'mongoose';

export type TodoType = {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  userId: string;
};

export type TodoFilterType = Partial<TodoType>;

export type TodoDocumentType = TodoType & Document;

export type TodoQueryType = {
  search?: string;
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed';
};
