import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RequestSchema = new Schema({
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    rcode: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'new'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    }
});

export default mongoose.model('Request', RequestSchema);