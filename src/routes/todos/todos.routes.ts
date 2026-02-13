import { getAllTodos } from "@/controllers/todos/todo.controller";
import { Router } from "express";

export const todoRouter = Router();

todoRouter.get("/", getAllTodos);
