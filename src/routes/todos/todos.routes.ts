import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from '@/controllers/todos/todos.controller';
import { Router } from 'express';

export const todosRouter = Router();

todosRouter.get('/', getTodos);
todosRouter.get('/:id', getTodoById);
todosRouter.post('/', createTodo);
todosRouter.put('/:id', updateTodo);
todosRouter.delete('/:id', deleteTodo);
