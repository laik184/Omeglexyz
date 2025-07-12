 
// DOM Elements
const homePage = document.getElementById('homePage');
const homeScreen = document.getElementById('homeScreen');
const chatContainer = document.getElementById('chatContainer');
const videoContainer = document.getElementById('videoContainer');
const startNowBtn = document.getElementById('startNowBtn');
const startChatBtn = document.getElementById('startChatBtn');
const startVideoBtn = document.getElementById('startVideoBtn');
const termsModal = document.getElementById('termsModal');
const closeTermsModal = document.getElementById('closeTermsModal');
const agreeBtn = document.getElementById('agreeBtn');
const chatExitBtn = document.getElementById('chatExitBtn');
const videoExitBtn = document.getElementById('videoExitBtn');
const chatMessages = document.getElementById('chatMessages');
const videoChatMessages = document.getElementById('videoChatMessages');
const messageInput = document.getElementById('messageInput');
const videoMessageInput = document.getElementById('videoMessageInput');
const sendBtn = document.getElementById('sendBtn');
const videoSendBtn = document.getElementById('videoSendBtn');
const userCountText = document.getElementById('userCountText');
const videoUserCountText = document.getElementById('videoUserCountText');
const attachBtn = document.getElementById('attachBtn');
const attachMenu = document.getElementById('attachMenu');
const sendLocation = document.getElementById('sendLocation');
const sendPhoto = document.getElementById('sendPhoto');
const sendVideo = document.getElementById('sendVideo');
const remoteVideo = document.getElementById('remoteVideo');
const localVideo = document.getElementById('localVideo');
const messageMenu = document.getElementById('messageMenu');
const deleteMessage = document.getElementById('deleteMessage');
const replyMessage = document.getElementById('replyMessage');
const termsLink = document.getElementById('termsLink');
const privacyLink = document.getElementById('privacyLink');
const backToHome = document.getElementById('backToHome');
const photoInput = document.getElementById('photoInput');
const videoInput = document.getElementById('videoInput');
const interestsInput = document.getElementById('interestsInput');
const connectBtn = document.getElementById('connectBtn');
const videoConnectBtn = document.getElementById('videoConnectBtn');

// Configuration
const WS_SERVER_URL = 'wss://omegle-i.onrender.com';
const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { 
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    }
];

// State variables
let isConnected = false;
let isTyping = false;
let typingTimeout;
let currentChatType = null; // 'text' or 'video'
let selectedMessage = null;
let localStream = null;
let peerConnection = null;
let dataChannel = null;
let socket = null;
let reconnectAttempts = 0;
let connectionTimeout = null;
let isInitiator = false;
const MAX_RECONNECT_ATTEMPTS = 5;
const CONNECTION_TIMEOUT = 10000;

// Typing indicator functions
function showTypingIndicator() {
    const typingEl = document.getElementById("typingIndicator");
    if (typingEl) typingEl.style.display = "block";

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        hideTypingIndicator();
    }, 3000);
}

function hideTypingIndicator() {
    const typingEl = document.getElementById("typingIndicator");
    if (typingEl) typingEl.style.display = "none";
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showHomePage();
    updateUserCount(0);
    
    window.addEventListener('resize', () => {
        if (currentChatType === 'video' && videoContainer.style.display === 'flex') {
            setTimeout(() => {
                applyDeviceLayout();
            }, 100);
        }
    });

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden, don't automatically reconnect
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
        }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
        cleanupConnections();
    });
});

// Device detection
function isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    
    return isMobileUserAgent || (isTouchDevice && isSmallScreen);
}

function applyDeviceLayout() {
    const videoContainer = document.getElementById('videoContainer');
    const videoSection = document.querySelector('.video-section');
    const chatSection = document.querySelector('.chat-section');
    
    if (isMobileDevice()) {
        videoContainer.classList.add('mobile-layout');
        videoSection?.classList.add('mobile-video-section');
        chatSection?.classList.add('mobile-chat-section');
    } else {
        videoContainer.classList.add('desktop-layout');
        videoSection?.classList.add('desktop-video-section');
        chatSection?.classList.add('desktop-chat-section');
    }
}

// UI Functions
function showHomePage() {
    homePage.style.display = 'block';
    homeScreen.style.display = 'none';
    chatContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    cleanupConnections();
}

function showChatSelection() {
    homePage.style.display = 'none';
    homeScreen.style.display = 'flex';
    chatContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    cleanupConnections();
}

function showTermsModal() {
    termsModal.style.display = 'flex';
}

function hideTermsModal() {
    termsModal.style.display = 'none';
}

function cleanupConnections() {
    console.log('Cleaning up connections...');
    
    // Clear timeouts
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    
    // Reset layout classes
    videoContainer?.classList.remove('mobile-layout', 'desktop-layout');
    document.querySelector('.video-section')?.classList.remove('mobile-video-section', 'desktop-video-section');
    document.querySelector('.chat-section')?.classList.remove('mobile-chat-section', 'desktop-chat-section');
    
    // Clean up WebRTC
    if (peerConnection) {
        try {
            peerConnection.ontrack = null;
            peerConnection.onicecandidate = null;
            peerConnection.onconnectionstatechange = null;
            peerConnection.close();
        } catch (e) {
            console.error('Error closing peer connection:', e);
        }
        peerConnection = null;
    }
    
    if (dataChannel) {
        try {
            dataChannel.close();
        } catch (e) {
            console.error('Error closing data channel:', e);
        }
        dataChannel = null;
    }
    
    if (localStream) {
        try {
            localStream.getTracks().forEach(track => {
                track.stop();
            });
        } catch (e) {
            console.error('Error stopping local stream:', e);
        }
        localStream = null;
    }
    
    // Clear video elements
    if (localVideo && localVideo.srcObject) {
        localVideo.srcObject = null;
    }
    if (remoteVideo && remoteVideo.srcObject) {
        remoteVideo.srcObject = null;
    }
    
    // Reset state
    isConnected = false;
    isInitiator = false;
    reconnectAttempts = 0;
    
    disconnect();
}

function startTextChat() {
    currentChatType = 'text';
    homePage.style.display = 'none';
    homeScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    videoContainer.style.display = 'none';
    
    if (messageInput) messageInput.focus();
    if (chatMessages) chatMessages.innerHTML = '';
    
    addSystemMessage("Looking for someone to chat with...");
    setAttachButtonEnabled(false);
    connectWebSocket();
}
 
async function startVideoChat() {
    currentChatType = 'video';
    homePage.style.display = 'none';
    homeScreen.style.display = 'none';
    chatContainer.style.display = 'none';
    videoContainer.style.display = 'flex';
    applyDeviceLayout();
    
    if (videoChatMessages) videoChatMessages.innerHTML = '';
    addVideoSystemMessage("Initializing video chat...");
    
    try {
        const hasMedia = await requestMediaPermissions();
        if (hasMedia) {
            connectWebSocket();
        } else {
            throw new Error('Media permissions denied');
        }
    } catch (error) {
        console.error('Video chat initialization failed:', error);
        addVideoSystemMessage("Failed to start video chat. Please check your camera/microphone permissions and try again.");
        setTimeout(() => {
            showChatSelection();
        }, 3000);
    }
}

// WebSocket Functions
function connectWebSocket() {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket already connected or connecting');
        return;
    }
    
    console.log('Connecting to WebSocket...');
    
    try {
        socket = new WebSocket(WS_SERVER_URL);
        
        // Set connection timeout
        connectionTimeout = setTimeout(() => {
            if (socket && socket.readyState === WebSocket.CONNECTING) {
                console.log('Connection timeout');
                socket.close();
                handleConnectionError('Connection timeout');
            }
        }, CONNECTION_TIMEOUT);
        
        socket.onopen = () => {
            console.log('Connected to server');
            
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            
            reconnectAttempts = 0;
            
            if (socket.readyState === WebSocket.OPEN) {
                const interests = interestsInput ? interestsInput.value.split(',').map(i => i.trim()).filter(i => i) : [];
                
                socket.send(JSON.stringify({
                    type: 'join',
                    chatType: currentChatType,
                    interests: interests
                }));
            }
        };
        
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
        
        socket.onclose = (event) => {
            console.log('Disconnected from server', event.code, event.reason);
            
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            
            isConnected = false;
            updateConnectionStatus(false);
            
            // Only attempt reconnection if we're still in a chat state and haven't exceeded max attempts
            if (currentChatType && reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !document.hidden) {
                reconnectAttempts++;
                const delay = Math.min(2000 * Math.pow(2, reconnectAttempts - 1), 10000);
                
                console.log(`Attempting reconnection ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);
                
                const message = `Connection lost. Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`;
                currentChatType === 'text' 
                    ? addSystemMessage(message)
                    : addVideoSystemMessage(message);
                
                connectionTimeout = setTimeout(() => {
                    if (currentChatType) connectWebSocket();
                }, delay);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                const message = "Connection failed. Please try again.";
                currentChatType === 'text' 
                    ? addSystemMessage(message)
                    : addVideoSystemMessage(message);
            }
        };
        
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            handleConnectionError('Connection error occurred');
        };
        
    } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        handleConnectionError('Failed to connect to server');
    }
}

function handleConnectionError(message) {
    console.error('Connection error:', message);
    
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
    
    currentChatType === 'text' 
        ? addSystemMessage(message)
        : addVideoSystemMessage(message);
        
    setConnectButtonDisabled(false);
}

function handleWebSocketMessage(data) {
    if (!data || typeof data.type !== 'string') {
        console.warn('Invalid WebSocket message:', data);
        return;
    }
    
    switch (data.type) {
        case 'stranger_connected':
            handleStrangerConnected(data);
            break;
        case 'waiting':
            setConnectButtonDisabled(false);
            const waitMessage = data.message || "Looking for someone...";
            currentChatType === 'text' 
                ? addSystemMessage(waitMessage)
                : addVideoSystemMessage(waitMessage);
            break;
        case 'message':
            handleReceivedMessage(data);
            break;
        case 'typing':
            handleTypingIndicator(data);
            break;
        case 'stranger_disconnected':
            handleStrangerDisconnected();
            break;
        case 'user_count':
            updateUserCount(data.count || 0);
            break;
        case 'webrtc_offer':
            handleWebRTCOffer(data);
            break;
        case 'webrtc_answer':
            handleWebRTCAnswer(data);
            break;
        case 'webrtc_ice_candidate':
            handleWebRTCIceCandidate(data);
            break;
        case 'error':
            console.error('Server error:', data.message);
            const errorMessage = data.message || 'Server error occurred';
            currentChatType === 'text' 
                ? addSystemMessage(errorMessage)
                : addVideoSystemMessage(errorMessage);
            break;
        default:
            console.warn('Unknown message type:', data.type);
    }
}

// Message Handling
function sendMessage() {
    const message = messageInput?.value?.trim();
    if (!message || !isConnected || !socket || socket.readyState !== WebSocket.OPEN) return;

    addUserMessage(message);

    try {
        socket.send(JSON.stringify({
            type: 'message',
            message: message
        }));
    } catch (error) {
        console.error('Error sending message:', error);
        addSystemMessage('Failed to send message');
    }

    messageInput.value = '';
    isTyping = false;
    sendTypingStatus(false);
}

function sendVideoMessage() {
    const message = videoMessageInput?.value?.trim();
    if (!message || !isConnected || !socket || socket.readyState !== WebSocket.OPEN) return;
    
    addVideoUserMessage(message);
    
    try {
        socket.send(JSON.stringify({
            type: 'message',
            message: message
        }));
    } catch (error) {
        console.error('Error sending video message:', error);
        addVideoSystemMessage('Failed to send message');
    }
    
    videoMessageInput.value = '';
}

// Message Display Functions
function addUserMessage(message) {
    addMessage(chatMessages, message, 'user-message');
}

function addStrangerMessage(message) {
    addMessage(chatMessages, message, 'stranger-message');
}

function addSystemMessage(message) {
    return addMessage(chatMessages, message, 'system-message');
}

function addVideoUserMessage(message) {
    addMessage(videoChatMessages, message, 'user-message');
}

function addVideoStrangerMessage(message) {
    addMessage(videoChatMessages, message, 'stranger-message');
}

function addVideoSystemMessage(message) {
    return addMessage(videoChatMessages, message, 'system-message');
}

function addMessage(container, message, className) {
    if (!container || !message) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.textContent = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

function addUserMediaMessage(fileName, fileSize, fileURL, mediaType) {
    addMediaMessage(chatMessages, fileName, fileSize, fileURL, mediaType, 'user-message');
}

function addVideoUserMediaMessage(fileName, fileSize, fileURL, mediaType) {
    addMediaMessage(videoChatMessages, fileName, fileSize, fileURL, mediaType, 'user-message');
}

function addMediaMessage(container, fileName, fileSize, fileURL, mediaType, className) {
    if (!container) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    
    if (mediaType === 'image') {
        const img = document.createElement('img');
        img.src = fileURL;
        img.alt = fileName;
        img.style.maxWidth = '250px';
        img.style.maxHeight = '200px';
        img.style.borderRadius = '8px';
        img.style.cursor = 'pointer';
        img.style.display = 'block';
        img.style.marginBottom = '5px';
        
        // Add download functionality
        let pressTimer;
        const handleLongPress = () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        };
        
        const clearPress = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };
        
        img.addEventListener('mousedown', handleLongPress);
        img.addEventListener('mouseup', clearPress);
        img.addEventListener('mouseleave', clearPress);
        img.addEventListener('touchstart', handleLongPress);
        img.addEventListener('touchend', clearPress);
        
        messageDiv.appendChild(img);
    } else if (mediaType === 'video') {
        const video = document.createElement('video');
        video.src = fileURL;
        video.controls = true;
        video.style.maxWidth = '250px';
        video.style.maxHeight = '200px';
        video.style.borderRadius = '8px';
        video.style.display = 'block';
        video.style.marginBottom = '5px';
        
        // Add download functionality
        let pressTimer;
        const handleLongPress = () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        };
        
        const clearPress = () => {
            if (pressTimer) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        };
        
        video.addEventListener('mousedown', handleLongPress);
        video.addEventListener('mouseup', clearPress);
        video.addEventListener('mouseleave', clearPress);
        video.addEventListener('touchstart', handleLongPress);
        video.addEventListener('touchend', clearPress);
        
        messageDiv.appendChild(video);
    }
    
    const caption = document.createElement('div');
    caption.style.fontSize = '0.8rem';
    caption.style.color = '#666';
    caption.textContent = `${fileName} (${fileSize}MB)`;
    messageDiv.appendChild(caption);
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

function showDownloadOption(fileURL, fileName) {
    if (confirm(`Download ${fileName}?`)) {
        try {
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    }
}

// WebRTC Functions
async function requestMediaPermissions() {
    try {
        const constraints = {
            video: {
                width: { ideal: 1280, max: 1920 },
                height: { ideal: 720, max: 1080 },
                facingMode: 'user',
                frameRate: { ideal: 30, max: 60 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: { ideal: 48000 }
            }
        };

        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (localVideo) {
            localVideo.srcObject = localStream;
        }
        
        addVideoSystemMessage("Camera ready. Looking for someone to chat with...");
        return true;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        
        let errorMessage = "Camera access denied or not found.";
        if (error.name === 'NotAllowedError') {
            errorMessage = "Camera/microphone access denied. Please allow permissions and try again.";
        } else if (error.name === 'NotFoundError') {
            errorMessage = "No camera/microphone found. Please check your devices.";
        } else if (error.name === 'NotReadableError') {
            errorMessage = "Camera/microphone is already in use by another application.";
        }
        
        addVideoSystemMessage(errorMessage);
        return false;
    }
}
 
async function initializeWebRTC(initiator) {
    try {
        console.log('Initializing WebRTC, initiator:', initiator);
        isInitiator = initiator;
        
        peerConnection = new RTCPeerConnection({ 
            iceServers: ICE_SERVERS,
            iceCandidatePoolSize: 10
        });
        
        // Add local stream tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                console.log('Adding track:', track.kind);
                peerConnection.addTrack(track, localStream);
            });
        }
        
        // Handle remote stream
        peerConnection.ontrack = (event) => {
            console.log('Received remote track:', event.track.kind);
            if (remoteVideo && event.streams[0]) {
                remoteVideo.srcObject = event.streams[0];
            }
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                console.log('Sending ICE candidate');
                socket.send(JSON.stringify({
                    type: 'webrtc_ice_candidate',
                    candidate: event.candidate
                }));
            }
        };
        
        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
            console.log('Connection state:', peerConnection.connectionState);
            
            if (peerConnection.connectionState === 'connected') {
                addVideoSystemMessage('Video call connected!');
            } else if (peerConnection.connectionState === 'disconnected') {
                addVideoSystemMessage('Video call disconnected.');
            } else if (peerConnection.connectionState === 'failed') {
                addVideoSystemMessage('Video call failed. Attempting to reconnect...');
                // Attempt to restart ICE
                if (peerConnection) {
                    peerConnection.restartIce();
                }
            }
        };
        
        // Create offer if initiator
        if (isInitiator) {
            await createOffer();
        }
        
        return peerConnection;
    } catch (error) {
        console.error('Error initializing WebRTC:', error);
        addVideoSystemMessage('Failed to initialize video connection.');
        throw error;
    }
}

async function createOffer() {
    try {
        console.log('Creating offer...');
        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });
        
        await peerConnection.setLocalDescription(offer);
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'webrtc_offer',
                offer: offer
            }));
        }
    } catch (error) {
        console.error('Error creating offer:', error);
        addVideoSystemMessage('Failed to create video offer.');
    }
}

async function handleWebRTCOffer(data) {
    try {
        console.log('Handling WebRTC offer...');
        
        if (!peerConnection) {
            await initializeWebRTC(false);
        }
        
        if (!data.offer) {
            console.error('No offer data received');
            return;
        }
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        const answer = await peerConnection.createAnswer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
        });
        
        await peerConnection.setLocalDescription(answer);
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'webrtc_answer',
                answer: answer
            }));
        }
    } catch (error) {
        console.error('Error handling offer:', error);
        addVideoSystemMessage('Failed to handle video offer.');
    }
}

async function handleWebRTCAnswer(data) {
    try {
        console.log('Handling WebRTC answer...');
        
        if (!peerConnection) {
            console.error('No peer connection available for answer');
            return;
        }
        
        if (!data.answer) {
            console.error('No answer data received');
            return;
        }
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (error) {
        console.error('Error handling answer:', error);
        addVideoSystemMessage('Failed to handle video answer.');
    }
}

async function handleWebRTCIceCandidate(data) {
    try {
        if (!peerConnection) {
            console.error('No peer connection available for ICE candidate');
            return;
        }
        
        if (!data.candidate) {
            console.error('No candidate data received');
            return;
        }
        
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
        console.error('Error adding ice candidate:', error);
    }
}

// Utility Functions
function disconnect() {
    if (socket) {
        try {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'leave' }));
            }
            socket.close();
        } catch (e) {
            console.error("Socket error on disconnect:", e);
        }
        socket = null;
    }

    isConnected = false;
    updateConnectionStatus(false);
    setAttachButtonEnabled(false);

    // Reset button labels
    const connectLabel = connectBtn?.querySelector('span');
    const videoConnectLabel = videoConnectBtn?.querySelector('span');
    
    if (connectLabel) connectLabel.textContent = "New";
    if (videoConnectLabel) videoConnectLabel.textContent = "New";

    setConnectButtonDisabled(false);
}

function updateUserCount(count) {
    const safeCount = Math.max(0, parseInt(count) || 0);
    const userText = `${safeCount} user${safeCount !== 1 ? 's' : ''} online`;
    
    if (userCountText) {
        userCountText.textContent = userText;
    }
    if (videoUserCountText) {
        videoUserCountText.textContent = userText;
    }
}

function updateConnectionStatus(connected) {
    const connectBtns = [connectBtn, videoConnectBtn].filter(btn => btn);
    connectBtns.forEach(btn => {
        if (connected) {
            btn.classList.remove('disconnected');
        } else {
            btn.classList.add('disconnected');
        }
    });
}

function sendTypingStatus(typing) {
    if (socket?.readyState === WebSocket.OPEN) {
        try {
            socket.send(JSON.stringify({
                type: 'typing',
                isTyping: !!typing
            }));
        } catch (error) {
            console.error('Error sending typing status:', error);
        }
    }
}

function setConnectButtonDisabled(isDisabled) {
    if (connectBtn) connectBtn.disabled = isDisabled;
    if (videoConnectBtn) videoConnectBtn.disabled = isDisabled;
}

function setAttachButtonEnabled(enabled) {
    if (attachBtn) {
        attachBtn.disabled = !enabled;
        attachBtn.style.opacity = enabled ? '1' : '0.5';
        attachBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
        
        const menuOptions = attachMenu?.querySelectorAll('.attach-option') || [];
        menuOptions.forEach(option => {
            option.style.opacity = enabled ? '1' : '0.5';
            option.style.cursor = enabled ? 'pointer' : 'not-allowed';
            option.style.pointerEvents = enabled ? 'auto' : 'none';
        });
    }
}

// Event Handlers
function setupEventListeners() {
    // Start Now button from home page
    if (startNowBtn) {
        startNowBtn.addEventListener('click', () => {
            showChatSelection();
        });
    }

    // Home screen buttons
    if (startChatBtn) {
        startChatBtn.addEventListener('click', () => {
            currentChatType = 'text';
            showTermsModal();
        });
    }
    
    if (startVideoBtn) {
        startVideoBtn.addEventListener('click', () => {
            currentChatType = 'video';
            showTermsModal();
        });
    }
    
    // Terms modal
    if (closeTermsModal) {
        closeTermsModal.addEventListener('click', hideTermsModal);
    }
    
    if (agreeBtn) {
        agreeBtn.addEventListener('click', () => {
            hideTermsModal();
            if (currentChatType === 'text') {
                startTextChat();
            } else {
                startVideoChat();
            }
        });
    }
    
    // Chat interface
    if (chatExitBtn) {
        chatExitBtn.addEventListener('click', () => {
            disconnect();
            showChatSelection();
        });
    }
    
    if (videoExitBtn) {
        videoExitBtn.addEventListener('click', () => {
            endVideoCall();
            showChatSelection();
        });
    }
    
    // Back to home
    if (backToHome) {
        backToHome.addEventListener('click', (e) => {
            e.preventDefault();
            showHomePage();
        });
    }
    
    // Message input handling
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim()) {
                sendMessage();
                sendTypingStatus(false);
            }
        });

        // Typing detection
        messageInput.addEventListener('input', () => {
            if (isConnected) {
                sendTypingStatus(true);

                if (typingTimeout) clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    sendTypingStatus(false);
                }, 2000);
            }
        });
    }
    
    // Video chat input
    if (videoMessageInput) {
        videoMessageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && videoMessageInput.value.trim()) {
                sendVideoMessage();
            }
        });
    }
    
    // Send buttons
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (videoSendBtn) {
        videoSendBtn.addEventListener('click', sendVideoMessage);
    }
    
    // Connect buttons
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            const label = connectBtn.querySelector('span');
            if (label && label.textContent === "New") {
                if (chatMessages) chatMessages.innerHTML = '';
                addSystemMessage("Looking for a stranger to chat with...");
                setConnectButtonDisabled(true);
                setTimeout(() => {
                    connectWebSocket();
                }, 100);
            } else if (label && label.textContent === "Skip") {
                addSystemMessage("You disconnected from the stranger.");
                disconnect();
            }
        });
    }
    
    if (videoConnectBtn) {
        videoConnectBtn.addEventListener('click', () => {
            const label = videoConnectBtn.querySelector('span');
            if (label && label.textContent === "New") {
                if (videoChatMessages) videoChatMessages.innerHTML = '';
                addVideoSystemMessage("Looking for a stranger to chat with...");
                setConnectButtonDisabled(true);
                setTimeout(() => {
                    connectWebSocket();
                }, 100);
            } else if (label && label.textContent === "Skip") {
                addVideoSystemMessage("You disconnected from the stranger.");
                disconnect();
            }
        });
    }
    
    // Footer links
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showTermsModal();
        });
    }
    
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert("Privacy policy message...");
        });
    }
    
    // File inputs
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    if (videoInput) {
        videoInput.addEventListener('change', handleVideoUpload);
    }
    
    // Attach menu
    if (attachBtn) {
        attachBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isConnected) {
                alert('Please wait until you are connected to a stranger before sending files.');
                return;
            }
            toggleAttachMenu();
        });
    }
    
    // Close attach menu when clicking outside
    document.addEventListener('click', (e) => {
        if (attachMenu && !attachBtn?.contains(e.target) && !attachMenu.contains(e.target)) {
            hideAttachMenu();
        }
    });
    
    if (sendPhoto) {
        sendPhoto.addEventListener('click', () => {
            if (!isConnected) {
                alert('Please wait until you are connected to a stranger before sending photos.');
                return;
            }
            photoInput.click();
            hideAttachMenu();
        });
    }
    
    if (sendVideo) {
        sendVideo.addEventListener('click', () => {
            if (!isConnected) {
                alert('Please wait until you are connected to a stranger before sending videos.');
                return;
            }
            videoInput.click();
            hideAttachMenu();
        });
    }
    
    if (sendLocation) {
        sendLocation.addEventListener('click', () => {
            if (!isConnected) {
                alert('Please wait until you are connected to a stranger before sending location.');
                return;
            }
            sendCurrentLocation();
            hideAttachMenu();
        });
    }
}

function handleStrangerConnected(data) {
    isConnected = true;
    setConnectButtonDisabled(false);
    setAttachButtonEnabled(true);

    if (currentChatType === 'text') {
        const label = connectBtn?.querySelector('span');
        if (label) {
            label.textContent = "Skip";
        }

        if (chatMessages) chatMessages.innerHTML = '';
        addSystemMessage("Stranger connected! Start chatting now.");
    } else if (currentChatType === 'video') {
        const label = videoConnectBtn?.querySelector('span');
        if (label) {
            label.textContent = "Skip";
        }

        if (videoChatMessages) videoChatMessages.innerHTML = '';
        addVideoSystemMessage("Stranger connected! Initializing video...");
        initializeWebRTC(true);
    }
}

function handleReceivedMessage(data) {
    if (!data.message) return;
    
    currentChatType === 'text' 
        ? addStrangerMessage(data.message)
        : addVideoStrangerMessage(data.message);
}

function handleTypingIndicator(data) {
    if (currentChatType === 'text') {
        if (data.isTyping) {
            showTypingIndicator();
        } else {
            hideTypingIndicator();
        }
    }
}

function handleStrangerDisconnected() {
    isConnected = false;
    setConnectButtonDisabled(false);
    setAttachButtonEnabled(false);

    if (currentChatType === 'text') {
        addSystemMessage("Stranger has disconnected from the chat.");
        const label = connectBtn?.querySelector('span');
        if (label) {
            label.textContent = "New";
        }
        if (connectBtn) connectBtn.classList.add('disconnected');
    } else if (currentChatType === 'video') {
        addVideoSystemMessage("Stranger has disconnected from the video chat.");
        const label = videoConnectBtn?.querySelector('span');
        if (label) {
            label.textContent = "New";
        }
        if (videoConnectBtn) videoConnectBtn.classList.add('disconnected');
    }

    // Clean up WebRTC connection
    if (remoteVideo && remoteVideo.srcObject) {
        remoteVideo.srcObject = null;
    }
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
}

function endVideoCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    if (remoteVideo && remoteVideo.srcObject) remoteVideo.srcObject = null;
    if (localVideo && localVideo.srcObject) localVideo.srcObject = null;
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    disconnect();
}

function toggleAttachMenu() {
    if (attachMenu) {
        const isVisible = attachMenu.classList.contains('show');
        if (isVisible) {
            attachMenu.classList.remove('show');
        } else {
            attachMenu.classList.add('show');
        }
    }
}

function hideAttachMenu() {
    if (attachMenu) {
        attachMenu.classList.remove('show');
    }
}

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
        alert('File size exceeds 500MB limit. Please select a smaller file.');
        event.target.value = '';
        return;
    }
    
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    try {
        const fileURL = URL.createObjectURL(file);
        
        currentChatType === 'text'
            ? addUserMediaMessage(fileName, fileSize, fileURL, 'image')
            : addVideoUserMediaMessage(fileName, fileSize, fileURL, 'image');
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                message: `📷 Photo: ${fileName} (${fileSize}MB)`,
                mediaType: 'image',
                mediaURL: fileURL
            }));
        }
    } catch (error) {
        console.error('Error handling photo upload:', error);
        alert('Failed to upload photo');
    }
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
        alert('File size exceeds 500MB limit. Please select a smaller file.');
        event.target.value = '';
        return;
    }
    
    const fileName = file.name;
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    
    try {
        const fileURL = URL.createObjectURL(file);
        
        currentChatType === 'text'
            ? addUserMediaMessage(fileName, fileSize, fileURL, 'video')
            : addVideoUserMediaMessage(fileName, fileSize, fileURL, 'video');
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                message: `🎥 Video: ${fileName} (${fileSize}MB)`,
                mediaType: 'video',
                mediaURL: fileURL
            }));
        }
    } catch (error) {
        console.error('Error handling video upload:', error);
        alert('Failed to upload video');
    }
}

function sendCurrentLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }
    
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        const locationMessage = `📍 Location: https://maps.google.com/?q=${lat},${lng}`;
        
        currentChatType === 'text'
            ? addUserMessage(locationMessage)
            : addVideoUserMessage(locationMessage);
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                message: locationMessage
            }));
        }
    }, (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location.';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied. Please check your browser settings.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable.';
                break;
            case error.TIMEOUT:
                errorMessage = 'Location request timed out.';
                break;
        }
        
        alert(errorMessage);
    });
}
