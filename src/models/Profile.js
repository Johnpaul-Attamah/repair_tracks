import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    handle: {
        type: String,
        required: true,
        max: 40
    },
    section: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    personal_details: [{
        phone: {
            type: String,
            required: true,
        },
        jobDescription: {
            type: String,
            required: true
        },
        location: {
            type: String
        },
        hobbies: [{
            type: String
        }],
        gender: {
            type: String,
            required: true
        },
        maritalStatus: {
            type: String,
            required: true
        }
    }],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
    });

    export default mongoose.model('Profile', profileSchema);