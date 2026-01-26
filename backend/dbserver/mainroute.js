import express from 'express'
import loginrouter from './controllers/logincontrol.js/login.js'
import memberRouter from './controllers/membercontrol.js/member.js'
import commonRouter from './controllers/commonvalue/commonvalue.js'
const mainrouter = express.Router()


mainrouter.use('/logincontrol', loginrouter)
mainrouter.use('/membercontrol', memberRouter)
mainrouter.use('/commonvalue', commonRouter)


export default mainrouter