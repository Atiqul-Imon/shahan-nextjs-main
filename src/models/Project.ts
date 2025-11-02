import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    technologies: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishDate: Date,
  },
  {
    timestamps: true,
  }
);

// Add composite index for better query performance on status and createdAt
// This optimizes the common query: find({ status: 'published' }).sort({ createdAt: -1 })
projectSchema.index({ status: 1, createdAt: -1 });

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project; 