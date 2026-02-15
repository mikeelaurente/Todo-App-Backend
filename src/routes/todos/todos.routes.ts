import {
  completeTodo,
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  pendingTodo,
  updateTodo,
} from '@/controllers/todos/todos.controller';
import { Router } from 'express';

export const todosRouter = Router();

todosRouter.get('/', getTodos);
todosRouter.get('/:id', getTodoById);
todosRouter.post('/', createTodo);
todosRouter.put('/:id', updateTodo);
todosRouter.put('/:id/complete', completeTodo);
todosRouter.put('/:id/pending', pendingTodo);
todosRouter.delete('/:id', deleteTodo);
