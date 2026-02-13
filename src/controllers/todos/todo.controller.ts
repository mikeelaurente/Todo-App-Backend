import { findAllTodos } from "@/services/todos/todos.service";
import { Request, Response } from "express";

export const getAllTodos = async (req: Request, res: Response) => {
  const todos = await findAllTodos();
  res.status(200).json({
    message: "Retrieved Todos successfully.",
    todos,
  });
};
