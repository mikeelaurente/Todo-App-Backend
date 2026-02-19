import { Response, Request } from 'express';
import {
  createTodoS,
  deleteTodoS,
  getTodoByIdS,
  getTodosS,
  updateTodoS,
  getTotalPendingTodosS,
} from '@/services/todos/todos.service';
import { AppError } from '@/utils/error/app-error.util';
import { Types } from 'mongoose';
import { TodoQueryType } from '@/types/models/todo.type';

// Get all todos
export const getTodos = async (
  req: Request & { query: TodoQueryType },
  res: Response,
) => {
  const userId = req.user._id;

  const { search, cursor, limit, status } = req.query;

  if (status && !['pending', 'completed'].includes(status)) {
    throw new AppError(
      'Invalid status value. Must be "pending" or "completed".',
      400,
    );
  }

  const query = {
    search,
    cursor,
    limit: limit ? Number(limit) : 10,
    status,
  };

  const { todos, hasMore, nextCursor } = await getTodosS(userId, query);
  const totalPendingTodo = await getTotalPendingTodosS(userId);

  res.status(200).json({
    message: 'Todos retrieved successfully.',
    todos,
    hasMore,
    nextCursor,
    limit: query.limit,
    totalPendingTodo,
  });
};

// Get one todo
export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!id) {
    throw new AppError('Todo ID is required.', 400);
  }

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError('Todo not found.', 404);
  }

  res.status(200).json({
    message: 'Todo retrieved successfully.',
    todo,
  });
};

// Create todo
export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = new Types.ObjectId(req.user._id);

  const trimmedTitle = title?.trim();

  if (!trimmedTitle) {
    throw new AppError('Title is required.', 400);
  }

  const todo = await createTodoS({
    title: trimmedTitle,
    description: description?.trim() || '',
    status: 'pending',
    userId,
    isPinned: false,
    pinnedAt: null,
  });

  res.status(201).json({
    message: 'Todo created successfully.',
    todo,
  });
};

// Update todo
export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, isPinned } = req.body;
  const userId = req.user._id;

  if (!id) {
    throw new AppError('Todo ID is required.', 400);
  }

  const existingTodo = await getTodoByIdS(id as string, userId);

  if (!existingTodo) {
    throw new AppError('Todo not found.', 404);
  }

  const updateData: Partial<{
    title: string;
    description: string;
    status: 'pending' | 'completed';
    isPinned: boolean;
    pinnedAt: Date | null;
  }> = {};

  if (title !== undefined) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      throw new AppError('Title cannot be empty.', 400);
    }
    updateData.title = trimmedTitle;
  }

  if (description !== undefined) {
    updateData.description = description.trim();
  }

  if (status !== undefined) {
    if (!['pending', 'completed'].includes(status)) {
      throw new AppError(
        'Invalid status value. Must be "pending" or "completed".',
        400,
      );
    }
    updateData.status = status;
  }

  if (isPinned !== undefined) {
    updateData.isPinned = isPinned;
    updateData.pinnedAt = isPinned ? new Date() : null;
  }

  const updatedTodo = await updateTodoS(id as string, userId, updateData);

  res.status(200).json({
    message: 'Todo updated successfully.',
    todo: updatedTodo,
  });
};

// Toggle pin
export const togglePin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError('Todo not found.', 404);
  }

  const isPinned = !todo.isPinned;

  const updatedTodo = await updateTodoS(id as string, userId, {
    isPinned,
    pinnedAt: isPinned ? new Date() : null,
  });

  res.status(200).json({
    message: isPinned
      ? 'Todo pinned successfully.'
      : 'Todo unpinned successfully.',
    todo: updatedTodo,
  });
};

// Delete todo
export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;

  if (!id) {
    throw new AppError('Todo ID is required.', 400);
  }

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError('Todo not found.', 404);
  }

  await deleteTodoS(id as string, userId);

  res.status(200).json({
    message: 'Todo deleted successfully.',
  });
};
