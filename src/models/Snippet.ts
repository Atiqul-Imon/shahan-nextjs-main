import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
snippetSchema.index({ createdAt: -1 }); // For sorting by creation date

const Snippet = mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

export default Snippet; 