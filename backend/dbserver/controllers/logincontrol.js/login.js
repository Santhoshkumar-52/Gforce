import express from 'express'
import LoginMaster from '../../model/loginmaster.js'

const loginrouter = express.Router()

loginrouter.post('/', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "username or password not Given" })
    }

    const result = await LoginMaster.aggregate([
        {
            $match: {
                email: username,
                password: password,
                activeStatus: true
            }
        },
        {
            $lookup: {
                from: "staffmaster",
                localField: "staffId",
                foreignField: "staffId",
                as: "staff"
            }
        },
        { $unwind: "$staff" },
        {
            $lookup: {
                from: "groupmaster",
                localField: "staff.groupId",
                foreignField: "_id",
                as: "group"
            }
        },
        { $unwind: "$group" },
        {
            $project: {
                password: 0
            }
        }
    ])

    if (!result.length) {
        console.log("Login mismatch");
        return res.status(401).json({ message: "Invalid login" })
    }

    res.status(200).json({
        message: "Login success",
        user: result[0]
    })
    console.log("Login Found");
})

export default loginrouter
