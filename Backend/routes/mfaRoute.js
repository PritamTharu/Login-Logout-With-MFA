const express = require('express')
const router = express.Router()
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const Mfamodel = require('../model/mfamodel');
const verifyToken = require('../middleware/authorization')
const User = require('../model/User')

router.post('/generateTOTP', verifyToken, async(req,res)=>{
    const { email } = req.body;   
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const secret = speakeasy.generateSecret({
        length: 20,
        name: `MyApp:${email}`,
        issuer: 'MyApp',
    });
    try {
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        res.status(200).json({
            message: "Scan the QR code with Authenticator",
            qrCodeUrl,
            secret: secret.base32,
        });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/verifyTOTP', verifyToken, async(req,res)=>{
    const { email, token, secret } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 1,
    });
    if (verified) {
        const newSecret = new Mfamodel({ email, totpSecret: secret });
        await newSecret.save();
        user.isMfaConfigured = true;
        await user.save();
        res.status(200).json({ message: 'Token is valid! 2FA successful.' });
    } else {
        res.status(500).json({ error: 'Invalid token' });
    }
})

router.delete('/removeTOTP',verifyToken, async(req,res)=>{
    const { email } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
    try {
        const result = await Mfamodel.findOneAndDelete({email});
        if (!result) {
            return res.status(404).json({ error: 'TOTP record not found' });
        }
        user.isMfaConfigured = false;
        await user.save();
        res.status(200).json({ message: 'mfa implementation discarded',result });
    } 
    catch (error) {
        res.status(500).json({ error: error });
    }
})


module.exports = router;