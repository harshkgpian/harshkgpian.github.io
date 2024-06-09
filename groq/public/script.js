function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}

document.getElementById('girlfriendForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userName = document.getElementById('userName').value;
    const girlfriendName = document.getElementById('girlfriendName').value;
    const girlfriendPersonality = document.getElementById('girlfriendPersonality').value;
    const girlfriendLanguage = document.getElementById('girlfriendLanguage').value;
    const girlfriendInterests = document.getElementById('girlfriendInterests').value;
    const message = document.getElementById('message').value;

    if (message.length > 300) {
        alert("Sorry, you can't have a message longer than 300 characters.");
        return;
    }

    createVirtualGirlfriend(userName, girlfriendName, girlfriendPersonality, girlfriendInterests, girlfriendLanguage, message);
});

let conversationHistory = []; // Store conversation history

async function createVirtualGirlfriend(userName, girlfriendName, girlfriendPersonality, girlfriendInterests, girlfriendLanguage, message) {
    if (message.toLowerCase().includes("bye") || message.toLowerCase().includes("exit")) {
        displayConversation([{ role: 'girlfriend', content: "Goodbye! Have a great day!" }], userName, girlfriendName);
        return;
    }

    if (conversationHistory.length >= 20) {
        displayConversation([{ role: 'girlfriend', content: "Sorry, this is it for today. It costs a little to have more conversation. Contact the creator." }], userName, girlfriendName);
        return;
    }

    // Append the latest message to the conversation history
    conversationHistory.push({ role: 'user', content: message });

    // Display the user message
    displayConversation(conversationHistory, userName, girlfriendName);

    // Clear the message input box after sending
    document.getElementById('message').value = '';

    // Focus back to the input box after a short delay
    setTimeout(() => {
        document.getElementById('message').focus();
    }, 1000); // Delay of 1 second before refocusing

    // Delay before showing typing animation
    await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay before showing typing animation
    displayTypingAnimation();

    // Delay before getting the response
    await new Promise(resolve => setTimeout(resolve, 1000 + (message.length * 20))); // Delay proportional to message length

    const response = await fetch('/createGirlfriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userName,
            girlfriendName: girlfriendName,
            girlfriendPersonality: girlfriendPersonality,
            girlfriendInterests: girlfriendInterests,
            girlfriendLanguage: girlfriendLanguage,
            conversationHistory: conversationHistory // Send entire conversation history
        })
    });

    const data = await response.json();
    conversationHistory.push({ role: 'girlfriend', content: data }); // Add girlfriend response to history

    // Hide typing animation
    hideTypingAnimation();

    // Display the girlfriend's message
    displayConversation(conversationHistory, userName, girlfriendName);
}

function displayConversation(conversation, userName, girlfriendName) {
    const girlfriendMessageContainer = document.getElementById('girlfriendMessage');
    let html = '';
    conversation.forEach(message => {
        if (message.role === 'user') {
            html += `<div class="message user"><span class="username"><strong>${userName}</strong></span>: ${message.content}</div>`;
        } else if (message.role === 'girlfriend') {
            html += `<div class="message girlfriend"><span class="username"><strong>${girlfriendName}</strong></span>: ${message.content}</div>`;
        }
    });
    girlfriendMessageContainer.innerHTML = html;
    girlfriendMessageContainer.scrollTop = girlfriendMessageContainer.scrollHeight; // Scroll to bottom
}

function displayTypingAnimation() {
    const typingMessage = document.createElement('div');
    typingMessage.className = 'message girlfriend typing-animation';
    typingMessage.innerHTML = `<span class="typing-indicator"></span><span class="typing-indicator"></span><span class="typing-indicator"></span>`;
    document.getElementById('girlfriendMessage').appendChild(typingMessage);
    document.getElementById('girlfriendMessage').scrollTop = document.getElementById('girlfriendMessage').scrollHeight;
}

function hideTypingAnimation() {
    const typingMessages = document.querySelectorAll('.typing-animation');
    typingMessages.forEach(message => {
        message.remove();
    });
}
function toggleLanguageOptions() {
    const languageSelect = document.getElementById("girlfriendLanguage");
    const languageValue = languageSelect.value;
    const otherOption = languageValue === "Hindi" ? "English" : "Hindi";
    const otherOptionElement = languageSelect.querySelector(`option[value="${otherOption}"]`);
    const options = languageSelect.querySelectorAll("option");
    options.forEach(option => {
        if (option.value !== languageValue) {
            option.disabled = true;
            option.style.color = "gray";
        } else {
            option.disabled = false;
            option.style.color = "black";
        }
    });
}