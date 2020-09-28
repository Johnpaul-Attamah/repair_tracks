import express from 'express';
import passport from 'passport';
import fs from 'fs';

import Profile from '../models/Profile';
import Repairs from '../models/Repairs';
import Request from '../models/Request';
import validateRepairsInput from './../validations/repairs';
import upload from './../utils/multer';
import { uploads as cloudinary } from './../utils/cloudinary';


const router = express.Router();


/**
 * @route POST api/v1/repairs/request_id
 * @access Private Access 
 * @description create request
 ***/
router.post('/:request_id', upload.array('attachment'), passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const {
        errors,
        isValid
    } = validateRepairsInput(req.body);

    if (!isValid) {
        return res.status(400).json({
            status: "Failed",
            errors
        });
    }

    const repairFields = {};
    const createdBy = {};

    try {
        if (req.user.role === 'engineer') {
            const profile = await Profile.findOne({
                user: req.user.id
            }).populate('User', ['name', 'avatar']);
            if (profile) {
                const request = await Request.findOne({
                    _id: req.params.request_id
                });
                if (request) {
                    repairFields.user = req.user.id;
                    repairFields.profile = profile._id;
                    repairFields.request = req.params.request_id;
                    if (req.body.title) repairFields.title = req.body.title;
                    if (req.body.description) repairFields.description = req.body.description;

                    const uploader = async(path) => await cloudinary(path, 'repairs');
                    const urls = [];
                    const files = req.files;
                    for (const file of files) {
                        const { path } = file;
                        const newPath = await uploader(path);
                        urls.push(newPath);
                        fs.unlinkSync(path)
                    }
                    
                    repairFields.attachments = urls;

                    createdBy.handle = profile.handle;
                    createdBy.jobDescription = profile.status;
                    createdBy.section = profile.section;
    
                    const repairRequest = await Repairs.findOne({
                        title: repairFields.title
                    });
                    if (repairRequest) {
                        errors.requestExists = 'Repair Request has already been made.';
                        return res.status(400).json({
                            status: 'failed',
                            errors
                        })
                    }
                    const repairsRequest = await new Repairs(repairFields).save();
                    return res.status(201).json({
                        status: 'success',
                        message: 'Repair request submitted successfully',
                        rcode: request.rcode,
                        requestTitle: request.title,
                        repairsRequest,
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
        }
        errors.noPermission = 'Only Engineers can make a repair request';
        return res.status(401).json({
            status: 'failed',
            errors
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});


export default router;