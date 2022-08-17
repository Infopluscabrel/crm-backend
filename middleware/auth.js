const jwt = require('jsonwebtoken')
const User = require('../services/user')
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        let tokensecret= process.env.secretToken || "12345"
        const decoded = jwt.verify(token, tokensecret)
  
     
       // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.getOneIdToken( decoded.id, token )

        if (!user) {
            throw new Error()
        }

       
        req.token = token
        req.user = user.data[0]
       
        next()
    } catch (e) {
        console.log(e) ;
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth