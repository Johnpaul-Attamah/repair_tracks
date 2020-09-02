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
            status: "Failed",
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
            requestFields.user = req.user.id;
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
        errors.noProfile = 'Edit profile to continue';
        return res.status(400).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    } 
});

/**
 * @route GET api/v1/request 
 * @access Private Access 
 * @description get request by user
 ***/
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const errors = {};
    try {
        const requests = await Request.find({
            user: req.user.id
        })
        .populate('User', ['name', 'avatar']);

        if(requests.length) {
            return res.status(200).json({
                status: 'success',
                message: 'requests fetched successfully',
                requests
            });
        }
        errors.noRequests = 'You have not made any requests'
        return res.status(404).json({
            status: 'success',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
    
});

/**
 * @description GET request by id
 * @access private access
 * GET api/v1/request/:id
 * */
router.get('/:request_id', passport.authenticate('jwt', {
     session: false }), async (req, res) => {
    const errors = {};
    try {
        const request = await Request.findOne({
            user: req.user.id,
            _id: req.params.request_id,
        }).populate('User', ['name', 'avatar']);
        if (request) {
            return res.status(200).json({
                status: 'success',
                message: 'request fetched successfully',
                request
            });
        }
        errors.noRequest = 'The request is not found';
        return res.status(404).json({
            status: 'success',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});
/**
 * @description update request
 * @access private access
 * PATCH api/v1/request/:id
 * */
router.patch('/:request_id', passport.authenticate('jwt', {
     session: false }), async (req, res) => {
        const { errors, isValid } = validateRequestInput(req.body);

        if (!isValid) {
            return res.status(400).json({
                status: "Failed",
                errors
            });
        }

        const requestFields = {};

    try {
        const request = await Request.findOne({
            user: req.user.id,
            _id: req.params.request_id
        }).populate('User', ['name', 'avatar']);
        if (request) {
            if (request.status === 'new') {
                requestFields.user = request.user;
                requestFields.profile = request.profile;
                requestFields.rcode = request.rcode;
                requestFields.updated_at = Date.now();
                if (req.body.title) requestFields.title = req.body.title;
                if (req.body.section) requestFields.section = req.body.section;
                if (req.body.location) requestFields.location = req.body.location;
                if (req.body.branch) requestFields.branch = req.body.branch;
                if (req.body.description) requestFields.description = req.body.description;

                const upDatedRequest = await Request.findOneAndUpdate({
                    user: req.user.id,
                    _id: req.params.request_id
                }, {
                    $set: requestFields
                }, {
                    new: true
                });

                return res.status(200).json({
                    status: 'Success',
                    msg: 'Request Updated successfully',
                    upDatedRequest
                });
            }
            errors.noPermission = 'You do not have permission to edit a request that is processing';
            return res.status(401).json({
                status: 'failed',
                errors
            });
        }
        errors.noRequest = 'The request is not found';
        return res.status(404).json({
            status: 'success',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

//Delete Request by id
//Private access
//DELETE api/v1/request/:request_id
router.delete('/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};
    
    try {
        const request = await Request.findOne({
            user: req.user.id,
            _id: req.params.request_id
        }).populate('User', ['name', 'avatar']);
        if (request) {
            if (request.status === 'new') {
                const deletedRequest = await Request.findOneAndRemove({
                    user: req.user.id,
                    _id: req.params.request_id
                });
                return res.status(200).json({ 
                    success: true,
                    message: 'Request Deleted Successfully'
                 });
            }
            errors.noPermission = 'You do not have permission to remove a request that is processing';
            return res.status(401).json({
                status: 'failed',
                errors
            });
        }
        errors.noRequest = 'The request is not found';
        return res.status(404).json({
            status: 'success',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

export default router;
