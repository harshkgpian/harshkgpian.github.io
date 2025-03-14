// Variables
let video;
let handPose;
let hands = [];
let statusText;
let toggleBtn;
let isDetecting = true;
let connections = [];
let lastPredictionTime = 0;
let predictionThreshold = 500; // Time threshold in ms to consider a prediction old

// Drawing related variables
let drawingPoints = [];
let isDrawing = false;
let currentStroke = [];
const distanceThreshold = 40; // Threshold distance to activate drawing mode
let clearBtn;

function setup() {
    // Create canvas and place it in the sketch-holder div
    const canvas = createCanvas(640, 480);
    canvas.parent('sketch-holder');
    
    // Access DOM elements
    statusText = select('#status');
    toggleBtn = select('#toggle-btn');
    
    // Add clear button for drawings
    clearBtn = createButton('Clear Drawing');
    clearBtn.position(10, height + 10);
    clearBtn.mousePressed(clearDrawing);
    
    // Configure toggle button
    toggleBtn.mousePressed(toggleDetection);
    
    // Create video capture
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Hide the video element
    
    // Initialize handpose model
    statusText.html('Loading handpose model...');
    
    // Create handpose with options
    handPose = ml5.handPose({
        maxHands: 2,
        flipped: true,  // Set to true for mirrored webcam
        modelType: "full"
    }, modelReady);
    
    // Get connections between keypoints
    connections = handPose.getConnections();
}

function modelReady() {
    statusText.html('Model loaded! Starting detection...');
    // Start detecting hands
    handPose.detectStart(video, gotHands);
}

function gotHands(results) {
    // Update the prediction time
    lastPredictionTime = millis();
    
    // Store the detected hands
    hands = results;
    
    // Process drawing if we have hands
    if (hands.length > 0) {
        processDrawing(hands[0]); // Use the first detected hand for drawing
    }
}

function processDrawing(hand) {
    // Get thumb and index finger positions
    const thumb = hand.keypoints[4]; // Thumb tip
    const index = hand.keypoints[8]; // Index finger tip
    
    // Calculate distance between thumb and index
    const distance = dist(thumb.x, thumb.y, index.x, index.y);
    
    // Calculate midpoint between thumb and index
    const midX = (thumb.x + index.x) / 2;
    const midY = (thumb.y + index.y) / 2;
    
    // Check if drawing should be active
    if (distance < distanceThreshold) {
        // Start a new stroke if not already drawing
        if (!isDrawing) {
            isDrawing = true;
            currentStroke = [];
        }
        
        // Add current point to the stroke
        currentStroke.push({ x: midX, y: midY });
        
    } else if (isDrawing) {
        // End the current stroke
        if (currentStroke.length > 1) {
            drawingPoints.push([...currentStroke]);
        }
        currentStroke = [];
        isDrawing = false;
    }
}

function draw() {
    // Clear background - don't show video, just the detection results
    background(0);
    
    // Render all saved drawings first
    renderDrawings();
    
    // Check if predictions are recent
    const currentTime = millis();
    const timeSinceLastPrediction = currentTime - lastPredictionTime;
    
    // Only draw hand detection if we have recent predictions
    if (hands.length > 0 && timeSinceLastPrediction < predictionThreshold) {
        // Draw first detected hand (for simplicity)
        if (hands.length > 0) {
            const hand = hands[0];
            
            // Draw keypoints
            drawKeypoints(hand);
            
            // Draw connections
            drawConnections(hand);
            
            // Highlight thumb and index finger
            highlightFingers(hand);
        }
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
        text(`Drawing: ${distance < distanceThreshold ? "ON" : "OFF"}`, 10, 80);
    }
    
    // Clear old predictions
    if (timeSinceLastPrediction >= predictionThreshold && hands.length > 0) {
        hands = [];
        statusText.html('No recent hand detections');
    }
}

function drawKeypoints(hand) {
    // Loop through all keypoints of this hand (except thumb and index which we'll highlight separately)
    for (let j = 0; j < hand.keypoints.length; j++) {
        // Skip thumb tip and index tip as we'll highlight them separately
        if (j === 4 || j === 8) continue;
        
        const keypoint = hand.keypoints[j];
        
        // Draw a circle at each keypoint
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 6);
    }
}

function highlightFingers(hand) {
    // Get thumb and index positions
    const thumb = hand.keypoints[4];
    const index = hand.keypoints[8];
    
    // Calculate distance between thumb and index
    const distance = dist(thumb.x, thumb.y, index.x, index.y);
    
    // Determine color based on distance
    let fingerColor;
    if (distance < distanceThreshold) {
        fingerColor = color(255, 0, 0); // Red when close enough to draw
    } else {
        fingerColor = color(0, 0, 255); // Blue when too far apart
    }
    
    // Highlight thumb
    fill(fingerColor);
    noStroke();
    circle(thumb.x, thumb.y, 15);
    
    // Highlight index
    fill(fingerColor);
    circle(index.x, index.y, 15);
    
    // Draw line connecting thumb and index
    stroke(fingerColor);
    strokeWeight(2);
    line(thumb.x, thumb.y, index.x, index.y);
    
    // Draw midpoint if in drawing mode
    if (distance < distanceThreshold) {
        const midX = (thumb.x + index.x) / 2;
        const midY = (thumb.y + index.y) / 2;
        
        fill(255, 255, 0);
        noStroke();
        circle(midX, midY, 10);
    }
}

function drawConnections(hand) {
    // Set styling for connections
    stroke(100, 100, 100);
    strokeWeight(1);
    
    // Draw each connection
    for (let i = 0; i < connections.length; i++) {
        const [start, end] = connections[i];
        const startPoint = hand.keypoints[start];
        const endPoint = hand.keypoints[end];
        
        line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    }
}

function renderDrawings() {
    // Draw all saved strokes
    strokeWeight(4);
    stroke(255, 0, 255); // Magenta
    noFill();
    
    // Draw completed strokes
    for (let i = 0; i < drawingPoints.length; i++) {
        const stroke = drawingPoints[i];
        
        beginShape();
        for (let j = 0; j < stroke.length; j++) {
            vertex(stroke[j].x, stroke[j].y);
        }
        endShape();
    }
    
    // Draw current active stroke if drawing
    if (isDrawing && currentStroke.length > 1) {
        beginShape();
        for (let i = 0; i < currentStroke.length; i++) {
            vertex(currentStroke[i].x, currentStroke[i].y);
        }
        endShape();
    }
}

function clearDrawing() {
    drawingPoints = [];
    currentStroke = [];
    isDrawing = false;
}

function toggleDetection() {
    if (isDetecting) {
        // Stop detection
        handPose.detectStop();
        toggleBtn.html('Resume Detection');
        statusText.html('Detection paused');
    } else {
        // Start detection
        handPose.detectStart(video, gotHands);
        toggleBtn.html('Pause Detection');
        statusText.html('Detection active');
    }
    isDetecting = !isDetecting;
}