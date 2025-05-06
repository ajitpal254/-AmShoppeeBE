const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('./../models/user')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

router.post('/signup',async (req, res) => {
   const saltPassword = await bcrypt.genSalt(10)
    const securePassword = await bcrypt.hash(req.body.password,saltPassword)

    const signedUpUser = new User ({
        name:req.body.name,
        email:req.body.email,
        password:securePassword
    })
    signedUpUser.save()
        .then(data =>{
            res.json(data)
        })
        .catch(err =>{
            res.json(err)
        })
    }
)

router.get("/test", (req, res) => {
    res.send("Test Route")
})

router.post('/login',asyncHandler(async (req,res)=>{
    const { email, password } = req.body

    console.log(`Searching for ${email}`)

    User.findOne({email: email}, (err, user) => {
        // if ( err ) throw err

        if ( user ) {
            bcrypt.compare(password, user.password, (err, match) => {
                // if (err) throw err

                if ( match ) {
                    res.json({
                        status: 200,
                        message: "ok"
                    })
                } else {
                    res.json({
                        status: 400,
                        message: "fail"
                    })
                }
            })
        } else {
            res.json({
                status: 400,
                message: "no_user"
            })
        }
    })
}))





module.exports = router;
