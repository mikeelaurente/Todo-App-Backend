import Todo from "@/models/todos/todos.model";
import {
  TodoDocumentType,
  TodoQueryType,
  TodoType,
} from "@/types/models/todo.type";
import { Types } from "mongoose";

export const getTodosS = async (
  userId: string,
  query: TodoQueryType,
): Promise<{
  todos: TodoDocumentType[];
  hasMore: boolean;
  nextCursor: string | null;
}> => {
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const status = query.status;
  const cursor = query.cursor;

  const filter: Record<string, any> = {
    userId: new Types.ObjectId(userId),
  };

  if (status) {
    filter.status = status;
  }

  function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  if (search) {
    const safeSearch = escapeRegex(search);

    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { description: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (cursor) {
    filter._id = { $lt: new Types.ObjectId(cursor) };
  }

  const todos = await Todo.find(filter)
    .sort({
      isPinned: -1,
      pinnedAt: 1,
      createdAt: -1,
    })
    .limit(limit + 1)
    .exec();

  const hasMore = todos.length > limit;
  const items = todos.slice(0, limit) as TodoDocumentType[];
  const nextCursor =
    items.length > 0 ? items[items.length - 1]._id.toString() : null;

  return { todos: items, hasMore, nextCursor };
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

export const getTotalPendingTodosS = async (
  userId: string,
): Promise<number> => {
  const count = await Todo.countDocuments({
    userId: new Types.ObjectId(userId),
    status: "pending",
  }).exec();

  return count;
};
