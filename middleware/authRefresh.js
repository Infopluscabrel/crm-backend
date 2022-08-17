const jwt = require('jsonwebtoken')
const User = require('../services/user')
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        let tokensecret= process.env.RefreshsecretToken || "12345"
        const decoded = jwt.verify(token, tokensecret)
  
        console.log(token)
       // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        let user = await User.getOneIdRefreshToken( decoded.id, token )
        console.log("user ref" + user )
        if (!user) {
            throw new Error()
        }

        console.log("auth user "+ user)
        req.token = token
        req.user = user
        next()
    } catch (e) {
        console.log(e) ;
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth