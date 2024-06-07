const Groq = require("groq-sdk");

const apiKey = "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";
const groq = new Groq({ apiKey: apiKey });

async function actLikeGirlfriend(userName, girlfriendName, girlfriendPersonality, girlfriendInterests, messages) {
    const system_message = {
        role: "system",
        content: `Generate a response in the style of ${girlfriendName}, incorporating her personality traits ${girlfriendPersonality} and interests ${girlfriendInterests}(Dont bring your interests in every message especially in start). Assume the context is a casual conversation with his boyfriend ${userName}. Please respond directly to the topic at hand, without unnecessary introductory phrases and emotions like  *gasp* or *giggles*. Keep the response natural-sounding, as if ${girlfriendName} were having a conversation with ${userName}.`
    };

    const chat_completion = await groq.chat.completions.create({
        messages: [
            system_message,
            ...messages,
        ],
        model: "llama3-8b-8192",
    });

    return chat_completion.choices[0].message.content;
}

module.exports = { actLikeGirlfriend };
