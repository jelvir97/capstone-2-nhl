const express = require('express')

const app = express()

app.get('/',(req, res)=>{
    res.json({msg:"hello world"})
})

module.exports = app;