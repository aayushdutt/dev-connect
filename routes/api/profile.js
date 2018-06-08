const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')


// LOAD INPUT VALIDATIONS
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// LOAD USER MODEL
const User = require('../../models/User')
// LOAD PROFILE MODEL
const Profile = require('../../models/Profile')



// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/test', (req, res)=> {
  res.json({msg: "Profile Works"})
})


// @route  GET api/profile
// @desc   Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res)=> {
  const errors = {}
  Profile.findOne({user: req.user.id}) //we are finding user property in Profile schema. user object is mapped with user id.
  .then(profile => {
    
    if(!profile) {
      errors.profile = "There is no profile for this user."
      return res.status(404).json();
    }

    res.json(profile)

  })
  .catch(err => res.status(404).json(err))
})



// @route  POST api/profile
// @desc   Create or Update user profile
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=> {
  // Get fields
  const profileFields = {}
  profileFields.user = req.user.id
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.company;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
// skills
  if(typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',')
  }

  // social
  profileFields.social = {}
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.linkedin) profileFields.social.linkedin= req.body.linkedin;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  // CHECK IF ALREADY EXISTS
  Profile.findOne({user = req.user.id})
  .then(profile => {

    if(profile){
      // update
      Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
      then(profile => res.json(profile))
    }

    else {
      // create
      // check is handle exists
      Profile.findOne({handle: profileFields.handle})
      .then(profile => {

        if(profile) {
          errors.handle = "That handle already exists."
          res.status(400).json(errors)
        }

        // save profile
        new Profile(profileFields).save()
        .then(profile => {
          res.json(profile)
        })
      })
    }
  })
})








module.exports = router