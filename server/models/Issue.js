import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    location: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
    date: { type: String, required: true },
    image: { type: String },
    category: { type: String, enum: ['pothole', 'garbage', 'streetlight', 'utility', 'other'], required: true },
    assignedTo: {
      type: [String],
      validate: [
        {
          validator: (arr) => Array.isArray(arr) && arr.length === 2,
          message: 'Exactly two technicians must be assigned',
        },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Issue', IssueSchema);
