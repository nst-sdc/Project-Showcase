import mongoose from 'mongoose';

// Define the Project schema
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a project description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    screenshot: {
      type: String,
      required: [true, 'Please provide a screenshot URL'],
    },
    hostedLink: {
      type: String,
      required: false,
    },
    githubLink: {
      type: String,
      required: false,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    githubUsername: {
      type: String,
      required: false,
    },
    techStack: [{
      type: String,
      trim: true,
    }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better performance
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text', techStack: 'text' });

// Prevent model compilation error in development due to hot reloading
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
