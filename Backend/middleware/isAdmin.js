const User = require('../model/User')

const isAdmin =  async (req, res, next) => {  
    if (!req.user.isAdmin) {
        return res.status(403).send('Forbidden: User is not admin');
      }
    next(); 
}

module.exports = isAdmin;