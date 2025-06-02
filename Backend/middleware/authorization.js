const jwt = require('jsonwebtoken')
const User = require('../model/User')

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token
    const refreshToken = req.cookies.refreshToken;
    if (!token && !refreshToken) {
        return res.status(401).json({ error: 'Access Denied. No token provided.' })
    }
    try {
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        const decoded = jwt.verify(tokenWithoutBearer, process.env.TOKENKEY);
        req.user = decoded;
        next();
    } catch (error) {
        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }
        try {
            const {userId} = jwt.verify(refreshToken, process.env.REFRESHKEY);
            const user = await User.findById(userId);            
            if (user?.refreshToken !== refreshToken) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }
            const newAccessToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.TOKENKEY, { expiresIn: '1h' });
            const newrefreshToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.REFRESHKEY, { expiresIn: '7d' });
            user.refreshToken = newrefreshToken;
            await user.save();
            res.cookie('token', newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() + 3600000),
            });
            res.cookie('refreshToken', newrefreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
            const newDecoded = jwt.verify(newAccessToken, process.env.TOKENKEY);
            req.user = newDecoded;
            return next();
        } catch (error) {
            return res.status(400).send('Invalid Token Provided.');
        }
    }

}

module.exports = verifyToken;