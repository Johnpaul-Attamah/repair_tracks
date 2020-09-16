import express from 'express';
import passport from 'passport';

import Cancel from '../models/Cancel';
import Profile from '../models/Profile';
import Request from '../models/Request';
import validateCancelInput from './../validations/cancel';

const router = express.Router();


/**
 * @route POST api/v1/cancel/request_id
 * @access Private Access 
 * @description create request
 ***/
router.post('/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validateCancelInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            status: "Failed",
            errors
        });
    }

    const cancelFields = {};
    const createdBy = {};

    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('User', ['name', 'avatar']);
        if (profile) {
            const myRequest = await Request.findOne({
                user: req.user.id,
                _id: req.params.request_id
            });
            if (myRequest){
                cancelFields.user = req.user.id;
                cancelFields.profile = profile._id;
                cancelFields.request = req.params.request_id;
                cancelFields.title = myRequest.title;
                if (req.body.reason) cancelFields.reason = req.body.reason;
    
                createdBy.handle = profile.handle;
                createdBy.section = profile.section;
    
                const cancelledRequest = await Cancel.findOne({
                    title: cancelFields.title
                });
                if (cancelledRequest) {
                    errors.requestExists = 'Request for cancellation has already been made.';
                    return res.status(400).json({
                        status: 'failed',
                        errors
                    })
                }
                const cancelRequest = await new Cancel(cancelFields).save();
                return res.status(201).json({
                    status: 'success',
                    message: 'cancel request submitted successfully',
                    rcode: myRequest.rcode,
                    cancelRequest,
                    createdBy
                });
            }
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noProfile = 'Edit profile to continue';
        return res.status(400).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;