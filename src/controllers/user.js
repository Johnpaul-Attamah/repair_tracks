import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validateRegisterInput from './../validations/register';

dotenv.config();

const router = express.Router();

/**
 * Register a user
 * @function
 * @param {Object} req Request object to create user requests
 * @param {Object} res Response object to get user details or error
 * @param {Object} error Object to display error messages.
 */
router.post('/register', async (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) return res.status(400).json(errors);
    try {
        const userInDB = await User.findOne({ email: req.body.email }) || 
        await User.findOne({ username: req.body.username });
        if (userInDB) {
            if (userInDB.email === req.body.email) errors.email = 'email exists.';
            if (userInDB.username === req.body.username) errors.username = 'username exists.';
            return res.status(422).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            const newUser = new User({
                username: req.body.username,
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    (async () => {
                        const user = await newUser.save();
                        return res.status(201).json({
                            status: 'Success',
                            message: 'User Created Successfully',
                            user
                        });
                    })().catch(err => err);
                });
            })
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


/**
 * Login a user
 * @function
 * @param {Object} req Request object to make user login requests
 * @param {Object} res Response object to get user details or error
 * @param {Object} error Object to display error messages.
 */
router.post('/login', async (req, res) => {
    const { inputValue, password } = req.body;
    try {
        const user = (/\S+@\S+\.\S+/.test(inputValue)) ? 
        await User.findOne({ email: inputValue }) : 
        await User.findOne({ username: inputValue });

        if(!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const payload = {
                id: user.id,
                role: user.role,
                username: user.username,
                name: user.name,
                avatar: user.avatar
            };
            jwt.sign(payload, process.env.SECRET_OR_KEY, {
                expiresIn: 3600
            }, (err, token) => {
                return res.status(200).json({
                    msg: 'success',
                    token: 'Bearer ' + token
                });
            });
        } else {
            return res.status(400).json({ password: 'password incorrect' });
        }
        
    } catch (error) {
        res.status(500).json(error);
    }
})
export default router;