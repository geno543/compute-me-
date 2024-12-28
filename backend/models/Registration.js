const mongoose = require('mongoose');
const validator = require('validator');

const registrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        validate: {
            validator: function(v) {
                return /^\+?[\d\s-]+$/.test(v);
            },
            message: 'Please provide a valid phone number'
        }
    },
    university: {
        type: String,
        required: [true, 'University name is required'],
        trim: true
    },
    track: {
        type: String,
        required: [true, 'Track selection is required'],
        enum: ['web', 'mobile', 'ai', 'game']
    },
    experience: {
        type: String,
        required: [true, 'Experience level is required'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    skills: {
        type: String,
        required: [true, 'Technical skills are required']
    },
    teamPreference: {
        type: String,
        required: [true, 'Team preference is required'],
        enum: ['solo', 'team', 'matching']
    },
    tshirtSize: {
        type: String,
        required: [true, 'T-shirt size is required'],
        enum: ['S', 'M', 'L', 'XL']
    },
    motivation: {
        type: String,
        required: [true, 'Motivation statement is required'],
        minlength: [50, 'Motivation statement should be at least 50 characters']
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

// Add indexes for frequently queried fields
registrationSchema.index({ email: 1 }, { unique: true });
registrationSchema.index({ status: 1 });
registrationSchema.index({ track: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
