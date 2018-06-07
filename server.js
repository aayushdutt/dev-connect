const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// BODY PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


// DB CONFIG
const db=require('./config/keys').mongoURI

// connect to mongodb
mongoose
  .connect(db)
  .then(()=>console.log("MongoDB Connected"))
  .catch(err => console.log(err))
  

// PASSPORT MIDDLEWARE
app.use(passport.initialize())

// passport config
require('./config/passport')(passport)



// USE ROUTES
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)









const port = process.emitWarning.PORT || 5000

app.listen(port, () => console.log(`Server running on port: ${port}\nURL: http://localhost:5000`))

