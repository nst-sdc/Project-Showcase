import mongoose from 'mongoose';

// Define the Like schema
const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only like a project once
LikeSchema.index({ user: 1, project: 1 }, { unique: true });

// Prevent model compilation error in development due to hot reloading
const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema);

export default Like;