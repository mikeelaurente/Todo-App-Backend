import Todo from '@/models/todos/todos.model';
import {
  TodoDocumentType,
  TodoFilterType,
  TodoQueryType,
  TodoType,
} from '@/types/todo/todo.type';

export const getTodosS = async (
  userId: string,
  query: TodoQueryType,
): Promise<{ todos: TodoDocumentType[]; total: number }> => {
  const { search = '', page = 1, limit = 10, status } = query;

  const filter: any = { userId };

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const todos = await Todo.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  const total = await Todo.countDocuments(filter);

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
    new: true,
  }).exec();
  return updatedTodo;
};

export const completeTodoS = async (id: string, userId: string) => {
  const completedTodo = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { status: 'completed' },
    { new: true },
  ).exec();
  return completedTodo;
};

export const pendingTodoS = async (id: string, userId: string) => {
  const pendingTodo = await Todo.findOneAndUpdate(
    { _id: id, userId },
    { status: 'pending' },
    { new: true },
  ).exec();
  return pendingTodo;
};

export const deleteTodoS = async (id: string, userId: string) => {
  const deletedTodo = await Todo.findOneAndDelete({
    _id: id,
    userId,
  }).exec();
  return deletedTodo;
};
