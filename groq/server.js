const express = require('express');
const { actLikeGirlfriend } = require('./index');
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const users = []; // Store signed up users

app.post('/signup', async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
    }
    const verificationCode = uuidv4(); // Generate verification code
    const user = {
        id: uuidv4(),
        userName,
        email,
        password,
        verified: false, // New field for email verification
        verificationCode
    };
    users.push(user);
    // Send verification email
    sendVerificationEmail(email, verificationCode);
    res.json({ message: 'User signed up, check your email for verification' });
});

app.post('/verifyEmail', (req, res) => {
    const { email, verificationCode } = req.body;
    const user = users.find(user => user.email === email && user.verificationCode === verificationCode);
    if (!user) {
        return res.status(400).json({ error: 'Invalid verification code' });
    }
    user.verified = true; // Mark email as verified
    res.json({ message: 'Email verified successfully' });
});

app.post('/createGirlfriend', async (req, res) => {
    const { userName, girlfriendName, girlfriendPersonality, girlfriendInterests, conversationHistory } = req.body;
    
    // Generate the prompt with the conversation history
    const messages = conversationHistory.map(message => {
        return { role: message.role === 'user' ? 'user' : 'assistant', content: message.content };
    });

    try {
        const response = await actLikeGirlfriend(userName, girlfriendName, girlfriendPersonality, girlfriendInterests, messages);
        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

async function sendVerificationEmail(email, verificationCode) {
    try {
        const transporter = nodemailer.createTransport({
            // Configure your email provider here
            service: 'Gmail',
            auth: {
                user: 'your.email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your.email@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Please verify your email address by clicking on the following link: http://localhost:3000/verify/${verificationCode}`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Website link: http://localhost:${PORT}`);
});
