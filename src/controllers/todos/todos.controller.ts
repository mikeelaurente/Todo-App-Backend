import {
  createTodoS,
  deleteTodoS,
  getTodoByIdS,
  getTodosS,
  updateTodoS,
} from "@/services/todos/todos.service";
import { AppError } from "@/utils/error/app-error.utils";
import { Request, Response } from "express";

// Get all todos with search, pagination, and status filter
export const getTodos = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { search, page, limit, status } = req.query;
  console.log("QUERY:", req.query);

  const validStatus = status ? String(status) : undefined;
  if (validStatus && !["pending", "completed"].includes(validStatus)) {
    throw new AppError(
      'Invalid status value. Must be "pending" or "completed".',
      400,
    );
  }

  const query = {
    search: search ? String(search) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    status: validStatus as "pending" | "completed" | undefined,
  };

  const { todos, total } = await getTodosS(userId, query);

  res.status(200).json({
    message:
      "Todos retrieved successfully." + (search ? ` Search: ${search}.` : ""),
    todos,
    total,
    page: query.page,
    limit: query.limit,
  });
};

// Get a single todo by ID
export const getTodoById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  if (!id) {
    throw new AppError("Todo ID is required.", 400);
  }

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError("Todo not found.", 404);
  }

  res.status(200).json({
    message: "Todo retrieved successfully.",
    todo,
  });
};

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = (req as any).user.id;

  const trimmedTitle = title?.trim();

  if (!trimmedTitle) {
    throw new AppError("Title is required.", 400);
  }

  const todo = await createTodoS({
    title: trimmedTitle,
    description: description?.trim() || "",
    status: "pending",
    userId,
  });

  res.status(201).json({
    message: "Todo created successfully.",
    todo,
  });
};

// Update a todo
export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = (req as any).user.id;

  if (!id) {
    throw new AppError("Todo ID is required.", 400);
  }

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError("Todo not found.", 404);
  }

  const updateData: any = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (status) {
    if (!["pending", "completed"].includes(status)) {
      throw new AppError(
        'Invalid status value. Must be "pending" or "completed".',
        400,
      );
    }
    updateData.status = status;
  }

  const updatedTodo = await updateTodoS(id as string, userId, updateData);

  res.status(200).json({
    message: "Todo updated successfully.",
    todo: updatedTodo,
  });
};

// Delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  if (!id) {
    throw new AppError("Todo ID is required.", 400);
  }

  const todo = await getTodoByIdS(id as string, userId);

  if (!todo) {
    throw new AppError("Failed to delete todo.", 400);
  }

  await deleteTodoS(id as string, userId);

  res.status(200).json({
    message: "Todo deleted successfully.",
  });
};
