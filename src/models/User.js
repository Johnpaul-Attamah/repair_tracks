import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'basic'
    },
    avatar: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model('User', UserSchema);