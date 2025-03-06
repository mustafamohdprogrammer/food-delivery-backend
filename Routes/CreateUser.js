const express = require('express');
const router = express.Router();
const {body,validationResult} = require("express-validator");
const User = require("../Modals/User");
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken");
const jwtSecret = "mohdmustafa";

// router.post("/createuser",[
//     body('email').isEmail(),
//     body('password',"minimum length required").isLength({min:5}),
//     body('name').isLength({min:3})
// ],async (req,res) =>{

//     const errors = validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors: errors.array()})
//     }

//     const salt = await bcrypt.genSalt(10);
//     let secPassword = await bcrypt.hash(req.body.password,salt);

//     try{
//       await  User.create({
//             name: req.body.name,
//             password: secPassword,
//             location: req.body.location,
//             email : req.body.email,
//         })
//         res.status(201).json({message: "User created successfully"})
//     }catch(error){
//         console.log(error)
//         res.status(500).json({message: error.message})
//     }
// })


router.post("/createuser", [
    body('email').isEmail(),
    body('password', "minimum length required").isLength({ min: 5 }),
    body('name').isLength({ min: 3 }),
    body('location').custom(value => {
        const requiredFields = ['houseNumber', 'street', 'area', 'landmark', 'city', 'state'];
        for (let field of requiredFields) {
            if (!value[field]) {
                throw new Error(`Missing address field: ${field}`);
            }
        }
        return true;
    }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);

    try {
        await User.create({
            name: req.body.name,
            password: secPassword,
            location: req.body.location,
            email: req.body.email,
        });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



router.post("/loginuser",[
    body('email').isEmail(),
    body('password',"minimum length required").isLength({min:5}),
],async (req,res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    let email = req.body.email
    try{
       const userData = await User.findOne({email})
        if(!userData){
            return res.status(404).json({message: "User not found"})
        }

        const pwdCompare = await bcrypt.compare(req.body.password,userData.password);
        if(!pwdCompare){
            return res.status(401).json({message: "Incorrect password"})
        }

        const data = {
            user : {
                id : userData.id,
            }
        }

        const authToken = jwt.sign(data,jwtSecret)

        return res.json({success: true,authToken: authToken})
    }catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

module.exports = router;


