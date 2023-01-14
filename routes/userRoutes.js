const User = require('../models/userModel');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body

        if (!email || !password || !passwordVerify) {
            return res.status(400).json({ errorMessage: 'Plaease eneter requied filed' })
        }

        if (password.length < 6) {
            return res.status(400).json({ errorMessage: 'Plaease enter 6 ' })
        }
        if (password !== passwordVerify) {
            return res.status(400).json({
                errorMessage: 'please enter the same password'
            })
        }

        const existUser = await User.findOne({ email })
        if (existUser) {
            return res.status(400).json({
                errorMessage: 'An account already exists'
            })
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email, password: passwordHash
        })

        const savedUser = await newUser.save()

        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET)

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({ message: "SuccessFully Created" });


    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ errorMessage: 'Plaease eneter requied filed' })
        }

        const existUser = await User.findOne({ email })

        if (!existUser) {
            return res.status(401).json({ errorMessage: 'Wrong Email Or Password' })
        }

        const passwordCorrect = await bcrypt.compare(
            password,
            existUser.password
        )

        if (!passwordCorrect) {
            return res.status(401).json({ errorMessage: 'Wrong Email Or Password' })
        }

        const token = jwt.sign({
            user: existUser._id
        }, process.env.JWT_SECRET)

        res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            .json({ message: "Login Succesfully" });


    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get("/logout", (req, res) => {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
      })
      .send();
  });

 
  router.get("/loggedIn",(req,res)=>{
    try {
        const token = req.cookies.token;
        if (!token) return res.json(false);
    
        jwt.verify(token, process.env.JWT_SECRET);
    
        res.send(true);
      } catch (err) {
        res.json(false);
      }
    
  })

module.exports = router