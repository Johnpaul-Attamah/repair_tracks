import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cancelSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'profile'
    },
    request: {
        type: Schema.Types.ObjectId,
        ref: 'request'
    },
    title: {
        type: String,
        required: true
    },
    reason: {
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

export default mongoose.model('Cancel', cancelSchema);