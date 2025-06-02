const express = require('express')
const router = express.Router()
const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt =  require('jsonwebtoken')
const verifyToken = require('../middleware/authorization')
const isAdmin = require('../middleware/isAdmin.js')
const sendEmail = require('../utils/sendmail.js')
const multer = require('multer')
const path = require('path');
const Mfamodel =  require('../model/mfamodel.js')
const { log } = require('console')
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register',async(req,res)=>{
    const { email, password } = req.body;   
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = new User({
        email: email,
        password: hashedPassword
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave);
        // sendEmail(email,req.url);
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/login',async(req,res)=>{   
    const { email, password, mfaCode } = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const mfaRecord = await Mfamodel.findOne({ email });
        if (mfaRecord) {         
            if (!mfaCode) {
              return res.status(200).json({ mfaRequired: true, error: 'MFA token required' });
            }
            const verified = speakeasy.totp.verify({
              secret: mfaRecord.totpSecret,
              encoding: 'base32',
              token: mfaCode,
              window: 1,
            }); 
            if (!verified) {
              return res.status(401).json({ error: 'Invalid MFA token' });
            }
        }
        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.TOKENKEY, {expiresIn: '1h'});
        const refreshToken = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.REFRESHKEY , { expiresIn: '7d' });
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('token', token, {
            httpOnly: true,                
            secure: false,  
            sameSite: 'Strict',            
            expires: new Date(Date.now() + 3600000)
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,                                      
            secure: false,           
            sameSite: 'Strict',                              
            expires: new Date(Date.now() + 30*24*60*60*1000)  
        });
        res.status(200).json({ message: "Logged in successfully"});
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
})

router.get('/verifySession', verifyToken, async (req, res) => {
    try {
        const token = req.cookies.token;
        const refreshToken = req.cookies.refreshToken;
        if (!token && !refreshToken) {
            return res.status(401).json({ isValid: false });
        }
        const decoded = jwt.verify(token, process.env.TOKENKEY); 
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ isValid: false });
        }
        res.status(200).json({ isValid: true });
    } catch (error) {
        res.status(401).json({ isValid: false });
    }
});

router.get('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESHKEY);
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }
        const newAccessToken = jwt.sign({ userId: user._id }, process.env.TOKENKEY, { expiresIn: '1h' });
        res.cookie('token', newAccessToken, {
            httpOnly: true, 
            secure: false, 
            sameSite: 'Strict',
            expires: new Date(Date.now() + 3600000)
        });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(400).json({ error: 'Invalid or expired refresh token' });
    }
});

router.get('/getProfile', verifyToken , async(req,res)=>{    
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

router.get('/getAllUsers', verifyToken, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users); // Simply send the users array
    } catch (error) {
        res.status(500).json({ error: 'Failed to get all users' });
    }
});

router.post('/logout', async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESHKEY);
            const user = await User.findById(decoded.userId);
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }
        res.clearCookie('token', {
            httpOnly: true,     
            secure: false, 
            sameSite: 'Strict', 
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,  
            secure: false,
            sameSite: 'Strict',
          });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to log out' });
    }
});

router.delete('/deleteAccount', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.ENV === 'production',
            sameSite: 'Strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.ENV === 'production',
            sameSite: 'Strict',
        });
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

router.put('/updateProfile', verifyToken, upload.single('file') ,async(req,res)=>{
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }        
        user.avatar = req.file?.buffer;
        await user.save();
        res.status(200).json({message: 'Profile picture uploaded successfully!'});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }    
})

router.get('/isAdmin',verifyToken,isAdmin,async(req,res)=>{
    res.status(200).json({ isAdmin: true });
})
  






module.exports = router;
