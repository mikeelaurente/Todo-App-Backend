import Todo from "@/models/todos/todos.model";
import {
  TodoDocumentType,
  TodoQueryType,
  TodoType,
} from "@/types/todo/todo.type";

export const getTodosS = async (
  userId: string,
  query: TodoQueryType,
): Promise<{ todos: TodoDocumentType[]; total: number }> => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const search = query.search?.trim();
  const status = query.status;

  const filter: Record<string, any> = { userId };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [todos, total] = await Promise.all([
    Todo.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
    Todo.countDocuments(filter),
  ]);

  return { todos: todos as TodoDocumentType[], total };
};

export const getTodoByIdS = async (
  id: string,
  userId: string,
): Promise<TodoDocumentType | null> => {
  const todo = await Todo.findOne({ _id: id, userId }).exec();
  return todo as TodoDocumentType | null;
};

export const createTodoS = async (data: TodoType) => {
  const newTodo = await Todo.create(data);
  return newTodo;
};

export const updateTodoS = async (
  id: string,
  userId: string,
  data: Partial<TodoType>,
) => {
  const updatedTodo = await Todo.findOneAndUpdate({ _id: id, userId }, data, {
    returnDocument: "after",
  }).exec();
  return updatedTodo;
};

export const deleteTodoS = async (id: string, userId: string) => {
  const deletedTodo = await Todo.findOneAndDelete({
    _id: id,
    userId,
  }).exec();
  return deletedTodo;
};
