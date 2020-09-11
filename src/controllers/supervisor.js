import express from 'express';
import passport from 'passport';

import User from '../models/User';
import Request from '../models/Request';
import Profile from '../models/Profile';

const router = express.Router();


/**
 * @route GET api/v1/supervisor/request 
 * @access Private Access 
 * @description get request by user
 ***/
router.get('/request', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};
    try {
        if(req.user.role === 'supervisor') {
            const requests = await Request.find()
                .populate('User', ['name', 'avatar']);
    
            if (requests.length) {
                 let createdBy, section;
                 let allRequests = [];
                for (let request of requests) {
                    let user = await User.findById(request.user);
                    let profile = await Profile.findById(request.profile);
                    createdBy = user.name;
                    section = profile.section;
                    allRequests.push({
                        createdBy,
                        section,
                        request
                    });    
                }
                return res.status(200).json({
                    status: 'success',
                    message: 'requests fetched successfully',
                    allRequests
                });
            }
            errors.noRequests = 'No requests found'
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only supervisors can view all requests';
        return res.status(401).json({
            status: 'failed',
            errors
        })
    } catch (error) {
        return res.status(500).json(error);
    }

});


export default router;