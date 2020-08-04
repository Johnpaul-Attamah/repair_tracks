import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const router = express.Router();

/**
 * Register a user
 * @function
 * @param {Object} req Request object to create user requests
 * @param {Object} res Response object to get user details or error
 * @param {Object} error Object to display error messages.
 */
router.post('/register', async (req, res) => {
    try {
        const userInDB = await User.findOne({ email: req.body.email });
        if (userInDB) {
            return res.status(422).json({ message: 'email exists.' })
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


export default router;