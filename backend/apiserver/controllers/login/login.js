import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const loginrouter = express.Router()
const DBSERVERURL = process.env.DBSERVERURL

loginrouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "username or password not Given" });
    }

    try {
        const response = await axios.post(`${DBSERVERURL}/db/logincontrol`, { username, password });
        if (!response.data.user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error connecting to DB Server:", err.message);
        return res.status(502).json({
            status: "error",
            message: "Something went wrong while connecting to DB Server",
            title: "Server Error"
        });
    }
});

export default loginrouter
