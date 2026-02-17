import Todo from "@/models/todos/todos.model";
import {
  TodoDocumentType,
  TodoQueryType,
  TodoType,
} from "@/types/todo/todo.type";
import { Types } from "mongoose";

export const getTodosS = async (
  userId: string,
  query: TodoQueryType,
): Promise<{ todos: TodoDocumentType[]; total: number }> => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const status = query.status;

  const filter: Record<string, unknown> = {
    userId: new Types.ObjectId(userId),
  };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    Todo.find(filter)
      .sort({
        isPinned: -1,
        pinnedAt: 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .exec(),
    Todo.countDocuments(filter),
  ]);

  return { todos: todos as TodoDocumentType[], total };
};

export const getTodoByIdS = async (
  id: string,
  userId: string,
): Promise<TodoDocumentType | null> => {
  return await Todo.findOne({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(userId),
  }).exec();
};

export const createTodoS = async (data: TodoType) => {
  return await Todo.create({
    ...data,
    userId: new Types.ObjectId(data.userId),
  });
};

export const updateTodoS = async (
  id: string,
  userId: string,
  data: Partial<TodoType>,
) => {
  return await Todo.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    },
    data,
    { returnDocument: "after" },
  ).exec();
};

export const deleteTodoS = async (id: string, userId: string) => {
  return await Todo.findOneAndDelete({
    _id: new Types.ObjectId(id),
    userId: new Types.ObjectId(userId),
  }).exec();
};
