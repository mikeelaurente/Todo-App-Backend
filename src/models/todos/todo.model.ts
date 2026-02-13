import { TodoDocumentType } from "@/types/todo/todo.type";
import { Model, model, Schema } from "mongoose";

const TodoSchema = new Schema<TodoDocumentType>(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Todo: Model<TodoDocumentType> = model<
  TodoDocumentType,
  Model<TodoDocumentType>
>("todos", TodoSchema);

export default Todo;
