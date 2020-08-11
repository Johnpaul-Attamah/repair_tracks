import express from 'express';
import passport from 'passport';

import Profile from '../models/Profile';
import User from '../models/User';

const router = express.Router();

/**
 * @route POST api/v1/profile 
 * @access Private Access 
 * @description create profile route
 ***/

router.post('/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.section) profileFields.section = req.body.section;
    if (req.body.branch) profileFields.branch = req.body.branch;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        if (profile) {
            const userProfile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            });

            return res.status(200).json({
                status: 'Success',
                msg: 'Profile Updated successfully',
                userProfile
            });
        } else {
            //create profile
            const profile = 
            await Profile.findOne({ handle: profileFields.handle });

            if (profile) {
                return res.status(400).json({ 
                    status: 'failed',
                    message: 'handle already exists.'
                })
            }
            //save new profile
           const newProfile = await new Profile(profileFields).save();
           return res.status(201).json({
               status: 'success',
               message: 'Profile created successfully.',
               newProfile
           })
        }
    } catch (err) {
        res.status(500).json(err);
    }
});


export default router;