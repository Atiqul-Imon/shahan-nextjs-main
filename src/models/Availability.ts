import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  start: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  },
  end: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/ // HH:MM format
  }
}, { _id: false });

const dayAvailabilitySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 0,
    max: 6 // 0 = Sunday, 6 = Saturday
  },
  available: {
    type: Boolean,
    default: false
  },
  slots: {
    type: [timeSlotSchema],
    default: []
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  weeklySchedule: {
    type: [dayAvailabilitySchema],
    required: true,
    validate: {
      validator: function(v: Array<{ day: number; available: boolean; slots: Array<{ start: string; end: string }> }>) {
        // Ensure all 7 days are present
        return v.length === 7 && 
               v.every((day, index) => day.day === index) &&
               v.every((day, index) => v.findIndex(d => d.day === index) === index);
      },
      message: 'Weekly schedule must contain exactly 7 days (0-6) in order'
    }
  },
  blackoutDates: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        // Validate date format YYYY-MM-DD
        return v.every(date => /^\d{4}-\d{2}-\d{2}$/.test(date));
      },
      message: 'Blackout dates must be in YYYY-MM-DD format'
    }
  },
  slotDuration: {
    type: Number,
    required: true,
    min: 15,
    max: 120,
    default: 30 // minutes
  },
  minLeadTime: {
    type: Number,
    required: true,
    min: 0,
    max: 168, // 7 days
    default: 24 // hours
  },
  maxAdvanceBooking: {
    type: Number,
    required: true,
    min: 1,
    max: 365,
    default: 60 // days
  },
  bufferBetweenSlots: {
    type: Number,
    required: true,
    min: 0,
    max: 60,
    default: 15 // minutes
  },
  maxAppointmentsPerDay: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
    default: 4
  },
  timezone: {
    type: String,
    required: true,
    default: 'America/New_York'
  }
}, {
  timestamps: true
});

// Type definition for the document
interface IAvailabilityDocument extends mongoose.Document {
  weeklySchedule: Array<{
    day: number;
    available: boolean;
    slots: Array<{
      start: string;
      end: string;
    }>;
  }>;
  blackoutDates: string[];
  slotDuration: number;
  minLeadTime: number;
  maxAdvanceBooking: number;
  bufferBetweenSlots: number;
  maxAppointmentsPerDay: number;
  timezone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type definition for the model with static method
interface IAvailabilityModel extends mongoose.Model<IAvailabilityDocument> {
  getCurrent(): Promise<IAvailabilityDocument>;
}

// Ensure only one availability configuration exists
availabilitySchema.statics.getCurrent = async function() {
  let config = await this.findOne();
  if (!config) {
    // Create default configuration
    config = new this({
      weeklySchedule: [
        { day: 0, available: false, slots: [] }, // Sunday
        { day: 1, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Monday
        { day: 2, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Tuesday
        { day: 3, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Wednesday
        { day: 4, available: true, slots: [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }] }, // Thursday
        { day: 5, available: true, slots: [{ start: '09:00', end: '12:00' }] }, // Friday
        { day: 6, available: false, slots: [] } // Saturday
      ],
      blackoutDates: [],
      slotDuration: 30,
      minLeadTime: 24,
      maxAdvanceBooking: 60,
      bufferBetweenSlots: 15,
      maxAppointmentsPerDay: 4,
      timezone: 'America/New_York'
    });
    await config.save();
  }
  return config;
};

const Availability = (mongoose.models.Availability as IAvailabilityModel) || mongoose.model<IAvailabilityDocument, IAvailabilityModel>('Availability', availabilitySchema);

export default Availability;

