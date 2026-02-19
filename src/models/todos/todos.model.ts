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

// Add indexes for better query performance
// Index for userId - used in every query
TodoSchema.index({ userId: 1 });

// Index for userId + status - used for status filtering
TodoSchema.index({ userId: 1, status: 1 });

// Text index for userId + title - used for search
TodoSchema.index({ userId: 1, title: 'text' });

// Compound index for sorting by isPinned, pinnedAt, and createdAt
TodoSchema.index({ userId: 1, isPinned: -1, pinnedAt: 1, createdAt: -1 });

const Todo: Model<TodoDocumentType> = model<
  TodoDocumentType,
  Model<TodoDocumentType>
>('todos', TodoSchema);

export default Todo;
