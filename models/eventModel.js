const mongoose = require('mongoose');
const User = require('./userModel');

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
    minlength: [3, 'Event name must be at least 3 characters long'],
  },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organizers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User', // Assuming 'User' is the model name of the user collection
    required: [true, 'Organizers are required'],
    validate: {
      validator: function(value) {
        return Array.isArray(value) && value.length > 0;
      },
      message: 'At least one organizer is required',
    },
  },
  dateFrom: {
    type: Date,
    required: [true, 'Event start date is required'],
  },
  dateTo: {
    type: Date,
    required: [true, 'Event end date is required'],
    validate: {
      validator: function(value) {
        return value > this.dateFrom; // End date must be after the start date
      },
      message: 'Event end date must be after the start date',
    },
  },
  place: {
    type: String,
    required: [true, 'Place of the event is required'],
    trim: true,
    minlength: [3, 'Place name must be at least 3 characters long'],
  },
  description: {
    type: String,
    required: [false, 'Event description is optional'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
  },
  maxParticipants: {
    type: Number,
    min: [1, 'Max participants must be at least 1'],
    default: 100,
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Live', 'Completed', 'Canceled'],
    default: 'Upcoming',
  }
}, {
  timestamps: true, // Automatically creates createdAt and updatedAt fields
});

// Custom transformation to filter fields
eventSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    // Remove unwanted fields from the result
    delete ret._id;
    delete ret.__v;
    // You can include other fields as per your requirements
    return ret;  // Return the filtered object
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
