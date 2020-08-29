import express from 'express';
import passport from 'passport';

import Request from '../models/Request';
import validateRequestInput from './../validations/request';
import Profile from '../models/Profile';
import generateRcode from '../helpers/uniqueRcode';

const router = express.Router();

/**
 * @route POST api/v1/request 
 * @access Private Access 
 * @description create request
 ***/
router.post('/', passport.authenticate('jwt', { 
    session: false 
}), async (req, res) => {
    const { errors, isValid } = validateRequestInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            status: "failed",
            errors
        });
    }

    const requestFields = {};
    const createdBy = {};

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('User', ['name', 'avatar']);
        if (profile) {
            requestFields.profile = profile._id;
            requestFields.rcode = generateRcode();
            if (req.body.title) requestFields.title = req.body.title;
            if (req.body.section) requestFields.section = req.body.section;
            if (req.body.location) requestFields.location = req.body.location;
            if (req.body.branch) requestFields.branch = req.body.branch;
            if (req.body.description) requestFields.description = req.body.description;

            createdBy.handle = profile.handle;
            createdBy.position = profile.status;
            
            const newRequest = await new Request(requestFields).save();
            return res.status(201).json({
                status: 'success',
                message: 'request created successfully',
                newRequest,
                createdBy
            });
        }
        return res.status(400).json({
            status: 'failed',
            message: 'Edit profile to continue'
        });
    } catch (error) {
        return res.status(500).json(error);
    } 
});


export default router;
