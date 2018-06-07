const express = require('express')
const mongoose = require('mongoose')

const app = express()

// DB CONFIG
const db=require('./config/keys').mongoURI

// connect to mongodb
mongoose
  .connect(db)
  .then(()=>console.log("MongoDB Connected"))
  .catch(err => console.log(err))
  




app.get('/', (req, res) => res.send('Hello'))

const port = process.emitWarning.PORT || 5000

app.listen(port, () => console.log(`Server running on port: ${port}\nURL: http://localhost:5000`))

