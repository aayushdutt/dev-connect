const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// LOAD USER MODEL
const User = require('../../models/User')
const keys = require('../../config/keys')


// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res)=> {
  res.json({msg: "Users Works"})
})


// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res)=> {
  User.findOne({email: req.body.email})
  .then(user => {
    if(user){
      return res.status(400).json({email: 'Email already exists.'})
    }
    else{
      const avatar = gravatar.url(
        req.body.email,
        {
          s: '200', //Size
          r: 'pg', //Rating
          d: 'mm' //Default
        }        
      )

      const newUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        avatar: avatar
      })

      bcrypt.genSalt(10, (err, salt)=> { //10 is the number of characters for salt
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
          if (err) throw err;
          newUser.password = hash; //replace password with hash

          newUser.save() //SAVE THE USER
          .then(user=> res.json(user))
          .catch(err=> console.log(err))
        })
      })


    }
  })
})



// @route  GET api/users/login
// @desc   Login user /Returning JWT token
// @access Public

router.post('/login', (req, res)=> {
  const email = req.body.email
  const password = req.body.password

  //Find user by email
  User.findOne({email})
  .then(user => {
    //check for user
    if(!user) return res.status(404).json({email: 'User not found'})

    //check password
    bcrypt.compare(password, user.password)
    .then(isMatch =>{
        if(isMatch){
          // user matched
        
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }
            // SIGN TOKEN
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
        
        } 
        
        else {
          return res.status(400).json({password: 'Password Incorrect'})
        }

    })
  })

})


// @route  GET api/users/current
// @desc   Return current user
// @access Private

router.get('/current', passport.authenticate('jwt', {session: false}),  (req, res)=> {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})





module.exports = router