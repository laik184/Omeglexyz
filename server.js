const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
const users = new Map();
let userCount = 0;

// WebSocket server
wss.on('connection', (ws) => {
    const userId = generateUserId();
    users.set(userId, { ws, interests: [], chatType: null, partner: null, waiting: false });
    userCount++;
    
    // Broadcast real-time user count
    broadcastUserCount();

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMessage(userId, data);
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        const user = users.get(userId);
        if (user) {
            // Notify partner about disconnection
            if (user.partner && users.has(user.partner)) {
                const partner = users.get(user.partner);
                if (partner.ws.readyState === WebSocket.OPEN) {
                    partner.ws.send(JSON.stringify({ type: 'stranger_disconnected' }));
                }
                partner.partner = null;
            }
            users.delete(userId);
            userCount--;
            broadcastUserCount();
        }
    });
});

function handleMessage(userId, data) {
    const user = users.get(userId);
    if (!user) return;

    // Validation: data.type should be a string
    if (typeof data.type !== 'string') return;

    // Anti-spam: simple rate limit
    const now = Date.now();
    if (!user.lastMessageTime) user.lastMessageTime = 0;

    if (data.type === 'message') {
        if (typeof data.message !== 'string' || data.message.length === 0 || data.message.length > 500) {
            return; // invalid message
        }

        if (now - user.lastMessageTime < 500) { // 500ms cooldown
            console.log(`User ${userId} is spamming, ignoring message`);
            return;
        }

        user.lastMessageTime = now;
    }

    switch (data.type) {
        case 'join':
            handleJoin(userId, data);
            break;
        case 'message':
            handleUserMessage(userId, data);
            break;
        case 'typing':
            handleTyping(userId, data);
            break;
        case 'leave':
            handleLeave(userId);
            break;
        case 'webrtc_offer':
        case 'webrtc_answer':
        case 'webrtc_ice_candidate':
            forwardWebRTCData(userId, data);
            break;
        default:
            console.warn('Unknown message type:', data.type);
    }
}

function handleJoin(userId, data) {
    const user = users.get(userId);
    if (!user) return;

    user.chatType = (data.chatType === 'text' || data.chatType === 'video') ? data.chatType : 'text';
    user.interests = Array.isArray(data.interests) ? data.interests : []; 
    
    // Find a matching partner
    const partner = findPartner(userId);
    
    if (partner) {
        // Pair these users
        user.partner = partner.id;
        partner.user.partner = userId;
        user.waiting = false;
        partner.user.waiting = false;

        // Notify both users if connections are still open
        if (user.ws.readyState === WebSocket.OPEN && partner.user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({
                type: 'stranger_connected',
                chatType: user.chatType
            }));
            partner.user.ws.send(JSON.stringify({
                type: 'stranger_connected',
                chatType: partner.user.chatType
            }));
        } else {
            // If either connection is closed, reset the pairing
            user.partner = null;
            user.waiting = true;
            if (user.ws.readyState === WebSocket.OPEN) {
                user.ws.send(JSON.stringify({
                    type: 'waiting',
                    message: 'Partner disconnected. Searching again...'
                }));
            }
        }
    } else {
        // No partner found yet
        user.waiting = true;
        if (user.ws.readyState === WebSocket.OPEN) {
            user.ws.send(JSON.stringify({ 
                type: 'waiting',
                message: 'Looking for someone with similar interests...'
            }));
        }
    }
}

function findPartner(userId) {
    const currentUser = users.get(userId);
    if (!currentUser) return null;

    for (const [id, user] of users.entries()) {
        if (id !== userId && 
            !user.partner && 
            user.chatType === currentUser.chatType &&
            user.waiting &&
            (user.interests.length === 0 || 
             currentUser.interests.length === 0 ||
             hasCommonInterest(user.interests, currentUser.interests))) {
            return { id, user };
        }
    }
    return null;
}

function hasCommonInterest(interests1, interests2) {
    return interests1.some(interest => interests2.includes(interest));
}

function handleUserMessage(userId, data) {
    const user = users.get(userId);
    if (!user || !user.partner) return;

    const partner = users.get(user.partner);
    if (partner && partner.ws.readyState === WebSocket.OPEN) {
        partner.ws.send(JSON.stringify({
            type: 'message',
            message: data.message
        }));
    }
}

function handleTyping(userId, data) {
    const user = users.get(userId);
    if (!user || !user.partner) return;
    
    const partner = users.get(user.partner);
    if (partner && partner.ws.readyState === WebSocket.OPEN) {
        partner.ws.send(JSON.stringify({
            type: 'typing',
            isTyping: data.isTyping
        }));
    }
}

function handleLeave(userId) {
    const user = users.get(userId);
    if (!user) return;
    
    if (user.partner && users.has(user.partner)) {
        const partner = users.get(user.partner);
        if (partner.ws.readyState === WebSocket.OPEN) {
            partner.ws.send(JSON.stringify({ type: 'stranger_disconnected' }));
        }
        partner.partner = null;
    }
    
    users.delete(userId);
    userCount--;
    broadcastUserCount();
}

function forwardWebRTCData(userId, data) {
    const user = users.get(userId);
    if (!user || !user.partner) return;
    
    const partner = users.get(user.partner);
    if (partner && partner.ws.readyState === WebSocket.OPEN) {
        partner.ws.send(JSON.stringify(data));
    }
}

function broadcastUserCount() {
    const countMessage = JSON.stringify({
        type: 'user_count',
        count: userCount
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(countMessage);
        }
    });
}

function generateUserId() {
    return Math.random().toString(36).substring(2, 15);
}

// REST API endpoints
app.get('/api/users/count', (req, res) => {
    res.json({ count: userCount });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
