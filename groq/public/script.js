<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Virtual Girlfriend</title>
    <link rel="stylesheet" href="style.css">
    <!-- Add Stripe library -->
    <script src="https://js.stripe.com/v3/"></script>
</head>
<body>
    <div class="container">
        <h1>Create Your Virtual Girlfriend</h1>
        <form id="girlfriendForm" class="input-form">
            <div class="input-group">
                <label for="userName">Your Name:</label>
                <input type="text" id="userName" name="userName" required>
            </div>
            <div class="input-group">
                <label for="girlfriendName">Girlfriend's Name:</label>
                <input type="text" id="girlfriendName" name="girlfriendName" required>
            </div>
            <div class="input-group">
                <label for="girlfriendPersonality">Girlfriend's Personality:</label>
                <select id="girlfriendPersonality" name="girlfriendPersonality" required>
                    <option value="">Select Personality</option>
                    <option value="Witty and Caring">Witty and Caring</option>
                    <option value="Sassy and Playful">Sassy and Playful</option>
                    <option value="Sweet and Romantic">Sweet and Romantic</option>
                    <option value="Intelligent and Empathetic">Intelligent and Empathetic</option>
                    <option value="Naughty and Flirtatious">Naughty and Flirtatious</option>
                </select>
            </div>
            <div class="input-group">
                <label for="girlfriendLanguage">Language:</label>
                <select id="girlfriendLanguage" name="girlfriendLanguage" onchange="toggleLanguageOptions()" required>
                    <option value="">Choose Language</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                </select>
                <span id="languageMessage" style="color: gray; font-style: italic;"></span>
            </div>
            
            <div class="input-group">
                <label for="girlfriendInterests">Girlfriend's Interests:</label>
                <input type="text" id="girlfriendInterests" name="girlfriendInterests" required>
            </div>
            <!-- Button to initiate payment -->
            <button id="payForPremiumFeatures">Unlock Premium Features</button>
            <!-- Button to initiate the chat -->
            <button id="scrollToBottomBtn" onclick="scrollToBottom()">Chat</button>
        </form>
        <div class="messageBox">
            <div id="girlfriendMessage" class="message-container"></div>
            <div class="input-group message-input-group">
                <input type="text" id="message" name="message" autocomplete="off" required maxlength="300">
                <button type="submit" id="sendMessageButton"><img src="send_icon.png" alt="Send" width="25px" height="20px"></button>
            </div>
        </div>
    </div>

    <script>
        // Stripe Public Key
        const stripePublicKey = 'your_stripe_public_key';
        // Create a Stripe instance
        const stripe = Stripe(stripePublicKey);

        // Function to handle payment
        async function payForPremiumFeatures() {
            try {
                // Fetch the client secret for the payment intent from the server
                const response = await fetch('/create-payment-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: 1000, // Example amount in cents ($10.00)
                        currency: 'usd' // Example currency
                    })
                });
                const { clientSecret } = await response.json();
                // Confirm the payment with Stripe.js
                const { error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement('card'),
                        billing_details: {
                            name: 'Jenny Rosen'
                        }
                    }
                });
                if (error) {
                    console.error('Payment failed:', error);
                } else {
                    console.log('Payment successful');
                    // Proceed to unlock premium features
                    unlockPremiumFeatures();
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        // Function to unlock premium features
        function unlockPremiumFeatures() {
            // Implement logic to unlock premium features
            console.log('Premium features unlocked!');
        }

        document.getElementById('payForPremiumFeatures').addEventListener('click', payForPremiumFeatures);
    </script>
</body>
</html>
