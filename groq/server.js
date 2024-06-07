const express = require('express');
const { actLikeGirlfriend } = require('./index');
const path = require('path');

const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Website link: http://localhost:${PORT}`);
});

