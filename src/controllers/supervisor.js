import express from 'express';
import passport from 'passport';

import User from '../models/User';
import Request from '../models/Request';
import Profile from '../models/Profile';
import Cancel from '../models/Cancel';

const router = express.Router();


/**
 * @route GET api/v1/supervisor/request 
 * @access Private Access 
 * @description get all request by supervisor
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


/**
 * @description GET request by id
 * @access private access
 * GET api/v1/supervisor/request/:id
 ***/
router.get('/request/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};
    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id,
            }).populate('User', ['name', 'avatar']);
            if (request) {
                let user = await User.findById(request.user);
                let profile = await Profile.findById(request.profile);
                return res.status(200).json({
                    status: 'success',
                    message: 'request fetched successfully',
                    createdBy: user.name,
                    section: profile.section,
                    request
                });
            }
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only supervisors can view a request';
        return res.status(401).json({
            status: 'failed',
            errors
        })
    } catch (error) {
        return res.status(500).json(error);
    }
});

/**
 * @description update request set status to started
 * @access private access
 * PATCH api/v1/supervisor/request/start/:request_id
 * */
router.put('/request/start/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};

    const requestFields = {};

    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id
            }).populate('User', ['name', 'avatar']);
            if (request) {
                    requestFields.status = 'started';
                    requestFields.updated_at = Date.now();
    
                    const upDatedRequest = await Request.findOneAndUpdate({
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
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only Supervisors can Update request Status';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/**
 * @description update request set status to started
 * @access private access
 * PATCH api/v1/supervisor/request/inprogress/:request_id
 * */
router.put('/request/inprogress/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};

    const requestFields = {};

    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id
            }).populate('User', ['name', 'avatar']);
            if (request) {
                    requestFields.status = 'in-progress';
                    requestFields.updated_at = Date.now();
    
                    const upDatedRequest = await Request.findOneAndUpdate({
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
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only Supervisors can Update request Status';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/**
 * @description update request set status to started
 * @access private access
 * PATCH api/v1/supervisor/request/processing/:request_id
 * */
router.put('/request/processing/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};

    const requestFields = {};

    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id
            }).populate('User', ['name', 'avatar']);
            if (request) {
                    requestFields.status = 'processing...';
                    requestFields.updated_at = Date.now();
    
                    const upDatedRequest = await Request.findOneAndUpdate({
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
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only Supervisors can Update request Status';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/**
 * @description update request set status to started
 * @access private access
 * PATCH api/v1/supervisor/request/completed/:request_id
 * */
router.put('/request/completed/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};

    const requestFields = {};

    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id
            }).populate('User', ['name', 'avatar']);
            if (request) {
                    requestFields.status = 'completed';
                    requestFields.updated_at = Date.now();
    
                    const upDatedRequest = await Request.findOneAndUpdate({
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
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only Supervisors can Update request Status';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});

/**
 * @description update request set status to started
 * @access private access
 * PATCH api/v1/supervisor/request/cancel/:request_id
 * */
router.put('/request/cancel/:request_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};

    const requestFields = {};

    try {
        if (req.user.role === 'supervisor') {
            const request = await Request.findOne({
                _id: req.params.request_id
            }).populate('User', ['name', 'avatar']);
            if (request) {
                    requestFields.status = 'rejected';
                    requestFields.updated_at = Date.now();
    
                    const upDatedRequest = await Request.findOneAndUpdate({
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
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only Supervisors can Update request Status';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        return res.status(500).json(error);
    }
});


/**
 * @route GET api/v1/supervisor/request 
 * @access Private Access 
 * @description get all cancel request by supervisor
 ***/
router.get('/request/cancel/all', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};
    try {
        if (req.user.role === 'supervisor') {
            const cancelRequests = await Cancel.find()
                .populate('User', ['name', 'avatar']);

            if (cancelRequests.length) {
                let createdBy, section, rcode;
                let allCancelRequests = [];
                for (let cancelled of cancelRequests) {
                    let user = await User.findById(cancelled.user);
                    let profile = await Profile.findById(cancelled.profile);
                    let request = await Request.findById(cancelled.request);
                    createdBy = user.name;
                    section = profile.section;
                    rcode = request.rcode;
                    allCancelRequests.push({
                        createdBy,
                        section,
                        rcode,
                        cancelled
                    });
                }
                return res.status(200).json({
                    status: 'success',
                    message: 'requests fetched successfully',
                    allCancelRequests
                });
            }
            errors.noRequests = 'No requests found'
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only supervisors can view all cancel requests';
        return res.status(401).json({
            status: 'failed',
            errors
        })
    } catch (error) {
        return res.status(500).json(error);
    }

});


/**
 * @description GET cancel request by id
 * @access private access
 * GET api/v1/supervisor/request/cancel/:id
 ***/
router.get('/request/cancel/:cancel_id', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const errors = {};
    try {
        if (req.user.role === 'supervisor') {
            const cancelledRequest = await Cancel.findOne({
                _id: req.params.cancel_id,
            }).populate('User', ['name', 'avatar']);
            if (cancelledRequest) {
                let user = await User.findById(cancelledRequest.user);
                let profile = await Profile.findById(cancelledRequest.profile);
                let request = await Request.findById(cancelledRequest.request);
                return res.status(200).json({
                    status: 'success',
                    message: 'cancelledRequest fetched successfully',
                    createdBy: user.name,
                    section: profile.section,
                    rcode: request.rcode,
                    cancelledRequest
                });
            }
            errors.noRequest = 'The request is not found';
            return res.status(404).json({
                status: 'success',
                errors
            });
        }
        errors.noPermission = 'Only supervisors can view a cancel request';
        return res.status(401).json({
            status: 'failed',
            errors
        })
    } catch (error) {
        return res.status(500).json(error);
    }
});



export default router;