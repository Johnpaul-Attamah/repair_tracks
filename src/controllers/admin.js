import express from 'express';
import passport from 'passport';

import User from '../models/User';

const router = express.Router();

/**
 * @route PUT api/v1/user/supervisor 
 * @access Private Access 
 * @description create supervisor
 ***/

 router.put('/supervisor/:user_id', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        const newSupervisor = { role: 'supervisor' };
        try {
            if (req.user.role === 'admin') {
              const user = await User.findById(req.params.user_id);
              if (user) {
                const supervisor = await User.findByIdAndUpdate(req.params.user_id, newSupervisor, {
                   new: true
                  });
                  return res.status(200).json({
                    status: 'success',
                    message: 'user updated successfully',
                    supervisor
                  })
              }
              errors.userNotFound = 'user not found';
              return res.status(404).json({
                status: 'success',
                errors
              })
            }
            errors.noPermission = 'Only administrators can create a supervisor';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
      });

/**
 * @route GET api/v1/user/supervisor/all
 * @access Private Access 
 * @description get all supervisors
 ***/

 router.get('/supervisor/all', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        try {
            if (req.user.role === 'admin') {
              const supervisors = await User.find({ role: 'supervisor'})
                if (!supervisors) {
                  errors.noSupervisors = 'There are no supervisors present';
                  return res.status(404).json({
                    status: 'success',
                    errors
                  });
                }
                const outputValue = supervisors.map(value =>( {
                  id: value._id,
                  username: value.username,
                  name: value.name,
                  email: value.email,
                  avatar:value.avatar,
                  role: value.role
                }))
              return res.status(200).json({
                status: 'success',
                message: 'supervisors fetched successfully',
                outputValue
              })
          }
            errors.noPermission = 'Only administrators can view supervisors';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
      });


/**
 * @route GET api/v1/user/supervisor/userId
 * @access Private Access 
 * @description get supervisor by userId
 ***/

 router.get('/supervisor/:user_id', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        try {
            if (req.user.role === 'admin') {
              const supervisor = await User.findOne({ 
                role: 'supervisor',
                _id: req.params.user_id
              });
                if (!supervisor) {
                  errors.notSupervisor = 'User is not a supervisor';
                  return res.status(404).json({
                    status: 'success',
                    errors
                  });
                }
                const outputValue = {
                  id: supervisor._id,
                  username: supervisor.username,
                  name: supervisor.name,
                  email: supervisor.email,
                  avatar:supervisor.avatar,
                  role: supervisor.role
                }
              return res.status(200).json({
                status: 'success',
                message: 'supervisor fetched successfully',
                outputValue
              });
          }
            errors.noPermission = 'Only administrators can view supervisor';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    });

/**
 * @route PUT api/v1/user/supervisor/demote/user_id
 * @access Private Access 
 * @description demote supervisor
 ***/

 router.put('/supervisor/demote/:user_id', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        const demotedSupervisor = { role: 'basic' };
        try {
            if (req.user.role === 'admin') {
              const user = await User.findById(req.params.user_id);
              if (user) {
                if (user.role == 'supervisor') {
                  const newUser = await User.findByIdAndUpdate(req.params.user_id, demotedSupervisor, {
                     new: true
                    });
                    return res.status(200).json({
                      status: 'success',
                      message: 'supervisor demoted successfully',
                      newUser
                    })
                }
                errors.notSupervsor = 'User is not a supervisor';
                return res.status(400).json({
                  status: 'failed',
                  errors
                })
              }
              errors.userNotFound = 'user not found';
              return res.status(404).json({
                status: 'success',
                errors
              })
            }
            errors.noPermission = 'Only administrators can demote a supervisor';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
      });



/**
 * @route PUT api/v1/user/engineer
 * @access Private Access 
 * @description create engineer
 ***/

 router.put('/engineer/:user_id', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        const newEngineer = { role: 'engineer' };
        try {
            if (req.user.role === 'admin') {
              const user = await User.findById(req.params.user_id);
              if (user) {
                const engineer = await User.findByIdAndUpdate(req.params.user_id, newEngineer, {
                   new: true
                  });
                  return res.status(200).json({
                    status: 'success',
                    message: 'user updated successfully',
                    engineer
                  })
              }
              errors.userNotFound = 'user not found';
              return res.status(404).json({
                status: 'success',
                errors
              })
            }
            errors.noPermission = 'Only administrators can add an engineer';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
  });


/**
 * @route GET api/v1/user/engineer/all
 * @access Private Access 
 * @description get all engineers
 ***/

 router.get('/engineer/all', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        try {
            if (req.user.role === 'admin') {
              const engineers = await User.find({ role: 'engineer'})
                if (!engineers) {
                  errors.noEngineers = 'There are no engineers present';
                  return res.status(404).json({
                    status: 'success',
                    errors
                  });
                }
                const outputValue = engineers.map(value =>( {
                  id: value._id,
                  username: value.username,
                  name: value.name,
                  email: value.email,
                  avatar:value.avatar,
                  role: value.role
                }))
              return res.status(200).json({
                status: 'success',
                message: 'engineers fetched successfully',
                outputValue
              })
          }
            errors.noPermission = 'Only administrators can view engineers';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
  });


/**
 * @route GET api/v1/user/supervisor/userId
 * @access Private Access 
 * @description get supervisor by userId
 ***/

 router.get('/engineer/:user_id', passport.authenticate('jwt', {
      session: false }), async (req, res) => {
        const errors = {};

        try {
            if (req.user.role === 'admin') {
              const engineer = await User.findOne({ 
                role: 'engineer',
                _id: req.params.user_id
              });
                if (!engineer) {
                  errors.notEngineer = 'User is not an engineer';
                  return res.status(404).json({
                    status: 'success',
                    errors
                  });
                }
                const outputValue = {
                  id: engineer._id,
                  username: engineer.username,
                  name: engineer.name,
                  email: engineer.email,
                  avatar:engineer.avatar,
                  role: engineer.role
                }
              return res.status(200).json({
                status: 'success',
                message: 'engineer fetched successfully',
                outputValue
              });
          }
            errors.noPermission = 'Only administrators can view engineer';
            return res.status(401).json({
              status: 'failed',
              errors
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    });



export default router;