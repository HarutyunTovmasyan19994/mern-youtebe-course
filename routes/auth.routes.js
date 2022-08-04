import express from "express";
import User from "../modules/User.js";
import jwt from 'jsonwebtoken'
import {check, validationResult} from "express-validator"
import bcrypt from "bcryptjs"
import config from "config"

const {Router} = express
const router = Router()


router.post(
    "/register",
    [
        check("email", "Email invalid").isEmail(),
        check("password", "Min length 6 symbol")
            .isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Write Wrong"
                })
            }
            const {email, password} = req.body
            const candidate = await User.findOne({email})
            if (candidate) {
                return res.status(400).json({message: "This user already exists..."})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                email,
                password: hashedPassword
            })
            await user.save()
            res.status(201).json({message: "User create"})

        } catch (e) {
            res.status(500).json({message: "incorrect password, again too"})
        }
    })
router.post(
    "/login",
    [
        check("email", "enter true email").normalizeEmail().isEmail(),
        check("password", "Enter password").exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "sxal e login anuluc "
                })
            }
            const {email, password} = req.body
            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: "User no find"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: "password false "})
            }
            const token = jwt.sign(
                {userId: user.id},
                config.get("jwtSecret"),
                {expiresIn: "1h"}
            )
            res.json({token,userId:user.id})

        } catch (e) {
            res.status(500).json({message: "incorrect password, again too"})
        }
    })

export default router
