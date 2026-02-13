import { Document, Types } from "mongoose";

export type TodoType = {
  userEmail: string;
  title: string;
  description: string;
  status: string;
};

export type TodoFilterType = Partial<TodoType>;

export type TodoDocumentType = TodoType &
  Document & {
    _id: Types.ObjectId;
  };
