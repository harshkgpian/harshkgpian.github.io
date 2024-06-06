const express = require('express');
const app = express();
const { summarize, googleSearch } = require('./index'); // Importing the summarize and googleSearch functions from index.js

app.use(express.json());

// Route handler for the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Sending the HTML file
});

// Route handler for summarization
app.post('/api/summarize', async (req, res) => {
    const { topic } = req.body;
    try {
        const summary = await summarize(topic);
        res.json({ summary });
    } catch (error) {
        console.error("Error fetching summary:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route handler for searching
app.post('/api/search', async (req, res) => {
    const { topic } = req.body;
    try {
        const searchResults = await googleSearch(topic);
        res.json({ searchResults });
    } catch (error) {
        console.error("Error fetching search results:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
