const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          // Basic email regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    roles: {
      type: [String],
      enum: ['registrant', 'organizer'],  // Roles allowed in the system
      default: ['registrant'],  // Default role for newly registered users
    },
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // Registered events
  }
);

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

// Pre-save hook to ensure that a registrant cannot have the 'admin' role
userSchema.pre('save', function(next) {
  if (this.isModified('roles')) {
    // Check if an admin role is being assigned to a registrant
    if (this.roles.includes('registrant') && this.roles.includes('organizer')) {
      return next(new Error('A registrant cannot be assigned the admin role'));
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;