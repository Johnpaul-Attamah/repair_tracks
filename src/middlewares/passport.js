import { Strategy as jwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const User = mongoose.model('User');

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

export const passportMiddleware = passport => {
    passport.use(new jwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) return done(null, user);
            return done(null, false);
        } catch (error) {
            throw new Error(error);
        }
    }));
};