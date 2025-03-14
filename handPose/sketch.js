// Variables
let video;
let handPose;
let hands = [];
let statusText;
let counterBtn;
let counterValue = 0;
let isDetecting = true;
let lastPredictionTime = 0;
let predictionThreshold = 500; // Time threshold in ms
let isButtonHovered = false;

function setup() {
    // Create canvas that fills the window
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch-holder');
    
    // Create and position counter button in the middle
    counterBtn = createButton('Counter: 0');
    counterBtn.position(width/2 - 50, height/2 - 25);
    counterBtn.style('padding', '15px 30px');
    counterBtn.style('background-color', 'rgba(0, 150, 255, 0.3)');
    counterBtn.style('border', '2px solid #00a2ff');
    counterBtn.style('color', '#00ff00');
    counterBtn.style('font-size', '16px');
    counterBtn.style('cursor', 'pointer');
    
    // Access status text
    statusText = select('#status');
    
    // Create video capture that matches window dimensions
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();
    
    // Initialize handpose model
    statusText.html('Loading handpose model...');
    handPose = ml5.handPose({
        maxHands: 2,
        flipped: true,
        modelType: "full"
    }, modelReady);
}

function modelReady() {
    statusText.html('Model loaded! Starting detection...');
    handPose.detectStart(video, gotHands);
}

// Handle window resizing
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    video.size(width, height);
    
    // Reposition the counter button
    counterBtn.position(width/2 - 50, height/2 - 25);
}

function gotHands(results) {
    lastPredictionTime = millis();
    hands = results;
    
    if (hands.length > 0) {
        processHandInteraction(hands[0]);
    } else {
        isButtonHovered = false;
        counterBtn.style('background-color', 'rgba(0, 150, 255, 0.3)');
    }
}

function processHandInteraction(hand) {
    // Get index finger and thumb positions
    const index = hand.keypoints[8];
    const thumb = hand.keypoints[4];
    
    // Get button position
    const btnRect = counterBtn.elt.getBoundingClientRect();
    
    // Check if index finger is inside button bounds
    if (index.x >= btnRect.left && index.x <= btnRect.right &&
        index.y >= btnRect.top && index.y <= btnRect.bottom) {
        
        if (!isButtonHovered) {
            console.log("Finger Detected on Button!");
            statusText.html('Finger Detected on Button!');
            isButtonHovered = true;
            counterBtn.style('background-color', 'rgba(0, 150, 255, 0.5)');
        }
        
        // Calculate distance between thumb and index
        const distance = dist(thumb.x, thumb.y, index.x, index.y);
        
        // If pinching (distance less than threshold)
        if (distance < 50) {
            counterValue++;
            counterBtn.html(`Counter: ${counterValue}`);
            counterBtn.style('background-color', 'rgba(0, 255, 0, 0.5)');
            statusText.html('Click detected! Counter increased.');
            // Add small delay to prevent multiple clicks
            setTimeout(() => {
                counterBtn.style('background-color', 'rgba(0, 150, 255, 0.5)');
            }, 200);
        }
    } else {
        if (isButtonHovered) {
            isButtonHovered = false;
            counterBtn.style('background-color', 'rgba(0, 150, 255, 0.3)');
        }
    }
}

function draw() {
    // Clear background with black
    background(0);
    
    
    // Check if predictions are recent
    const currentTime = millis();
    const timeSinceLastPrediction = currentTime - lastPredictionTime;
    
    // Only process hand detection if we have recent predictions
    if (hands.length > 0 && timeSinceLastPrediction < predictionThreshold) {
        const hand = hands[0];
        
        // Draw keypoints
        drawKeypoints(hand);
        
        // Draw connections
        drawConnections(hand);
        
        // Highlight thumb and index finger
        highlightFingers(hand);
    }
    
    // Display status information
    fill(255);
    textSize(16);
    text(`FPS: ${floor(frameRate())}`, 10, 20);
    text(`Hands detected: ${hands.length}`, 10, 40);
    
    // If we have hands, show the distance info
    if (hands.length > 0) {
        const thumb = hands[0].keypoints[4];
        const index = hands[0].keypoints[8];
        const distance = dist(thumb.x, thumb.y, index.x, index.y);
        text(`Thumb-Index Distance: ${floor(distance)}px`, 10, 60);
    }
}

function drawKeypoints(hand) {
    for (let j = 0; j < hand.keypoints.length; j++) {
        if (j === 4 || j === 8) continue;
        
        const keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 6);
    }
}

function highlightFingers(hand) {
    const thumb = hand.keypoints[4];
    const index = hand.keypoints[8];
    const distance = dist(thumb.x, thumb.y, index.x, index.y);
    
    // Determine color based on distance
    let fingerColor = distance < 50 ? color(255, 0, 0) : color(0, 0, 255);
    
    // Highlight thumb and index
    fill(fingerColor);
    noStroke();
    circle(thumb.x, thumb.y, 15);
    circle(index.x, index.y, 15);
    
    // Draw line connecting thumb and index
    stroke(fingerColor);
    strokeWeight(2);
    line(thumb.x, thumb.y, index.x, index.y);
}

function drawConnections(hand) {
    stroke(100, 100, 100);
    strokeWeight(1);
    
    // Get connections between keypoints
    const connections = handPose.getConnections();
    
    // Draw each connection
    for (let i = 0; i < connections.length; i++) {
        const [start, end] = connections[i];
        const startPoint = hand.keypoints[start];
        const endPoint = hand.keypoints[end];
        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}