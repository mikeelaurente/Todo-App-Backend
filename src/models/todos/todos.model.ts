import { TodoDocumentType } from '@/types/models/todo.type';
import { Model, model, Schema } from 'mongoose';

const TodoSchema = new Schema<TodoDocumentType>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },

    pinnedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Todo: Model<TodoDocumentType> = model<
  TodoDocumentType,
  Model<TodoDocumentType>
>('todos', TodoSchema);

export default Todo;
