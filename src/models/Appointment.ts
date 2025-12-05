import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  topic: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  details: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  timezone: {
    type: String,
    required: true,
    default: 'America/New_York'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  confirmedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
appointmentSchema.index({ startTime: 1, endTime: 1 });
appointmentSchema.index({ status: 1, createdAt: -1 });
appointmentSchema.index({ email: 1 });
appointmentSchema.index({ startTime: 1, status: 1 }); // For checking availability

const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export default Appointment;

