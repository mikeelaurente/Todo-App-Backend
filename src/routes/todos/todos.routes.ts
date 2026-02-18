import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from '@/controllers/todos/todos.controller';
import { requireAccessToken } from '@/middlewares/token.middleware';
import { Router } from 'express';

export const todosRouter = Router();

todosRouter.get('/', requireAccessToken, getTodos);
todosRouter.get('/:id', requireAccessToken, getTodoById);
todosRouter.post('/', requireAccessToken, createTodo);
todosRouter.put('/:id', requireAccessToken, updateTodo);
todosRouter.delete('/:id', requireAccessToken, deleteTodo);
