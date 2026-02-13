import Todo from "@/models/todos/todo.model";
import { TodoDocumentType, TodoType } from "@/types/todo/todo.type";

export const findTodoS = async (): Promise<TodoDocumentType | null> => {
  const todo = await Todo.findOne().exec();
  return todo as TodoDocumentType | null;
};

export const findAllTodos = async (): Promise<TodoDocumentType | []> => {
  const todos = await Todo.find().exec();
  return todos as TodoDocumentType | [];
};

export const createTodoS = async (data: TodoType) => {
  const newTodo = await Todo.create(data);
  return newTodo;
};
