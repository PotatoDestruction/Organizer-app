const jwt = require("jsonwebtoken");
const { jwtSecret } = require('../config')

const authCheck = (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth) {
        return res.status(400).send( { error: "Token is required" } );
    }
    const token = auth.split(' ')[1];

    try {
     const tokenInfo = jwt.verify(token, jwtSecret);

    req.user = {
       user_id: tokenInfo.user_id,
    }

    next();
    }catch(err){
        res.status(401).send( {error: "Unauthorized"} )
    }

};

module.exports = { authCheck };

