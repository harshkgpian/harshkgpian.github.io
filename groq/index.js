const Groq = require("groq-sdk");

const apiKey = "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";
const groq = new Groq({ apiKey: apiKey });

async function summarize(topic) {
    const instruction = (
        "As a senior content writer, you are tasked with generating relevant pointers based on the given text.\n" +
        "Focus on the most relevant information and provide important links or citations for each point.\n" +
        "Ensure each pointer is concise and includes a relevant citation or link to further information.\n" +
        "Do not include introductory phrases such as 'Here are the pointers' or 'Following are the citations.'\n" +
        "Instead, directly present the pointers with the corresponding links or citations."
    );

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `${instruction}\n Here is the text: ${topic}\n Do not give any heading or ending sentence, just give the summarized text.`,
            }
        ],
        model: "llama3-8b-8192",
    });

    return chatCompletion.choices[0]?.message?.content || "";
}

async function googleSearch(query) {
    const API_KEY = 'AIzaSyBMyEe80m6WwzKFLWXnoQ7JogeQqhMmAMo';
    const CSE_ID = '4374d492fffa642c3';

    const search_url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${API_KEY}&cx=${CSE_ID}&num=10`;
    const response = await fetch(search_url);
    const data = await response.json();
    return data.items || [];
}

module.exports = {
    summarize,
    googleSearch
};
