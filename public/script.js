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
const footerTermsBtn = document.getElementById('footerTermsBtn');
const footerPrivacyBtn = document.getElementById('footerPrivacyBtn');
const footerAboutBtn = document.getElementById('footerAboutBtn');
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
const WS_SERVER_URL = 'wss://omegleweb.io';
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

    // Apply initial device layout for all pages
    applyDeviceLayout();
    applyHomePageLayout();

    // Enhanced resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            applyDeviceLayout();
            applyHomePageLayout();

            // Specific handling for video chat
            if (currentChatType === 'video' && videoContainer.style.display === 'flex') {
                adjustVideoLayout();
            }
        }, 150);
    });

    // Handle orientation change on mobile devices
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            applyDeviceLayout();
            applyHomePageLayout();
            if (currentChatType === 'video' && videoContainer.style.display === 'flex') {
                adjustVideoLayout();
            }
        }, 300);
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

// Enhanced device detection and responsive behavior
function getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) return 'mobile-small';
    if (screenWidth <= 768) return 'mobile';
    if (screenWidth <= 1024) return 'tablet';
    return 'desktop';
}

function isMobileDevice() {
    const deviceType = getDeviceType();
    return deviceType === 'mobile-small' || deviceType === 'mobile';
}

function isTabletDevice() {
    return getDeviceType() === 'tablet';
}

function applyDeviceLayout() {
    const videoContainer = document.getElementById('videoContainer');
    const videoSection = document.querySelector('.video-section');
    const chatSection = document.querySelector('.chat-section');
    const body = document.body;

    // Remove all existing device classes
    const deviceClasses = ['mobile-layout', 'tablet-layout', 'desktop-layout', 
                          'mobile-video-section', 'tablet-video-section', 'desktop-video-section',
                          'mobile-chat-section', 'tablet-chat-section', 'desktop-chat-section'];

    deviceClasses.forEach(className => {
        videoContainer?.classList.remove(className);
        videoSection?.classList.remove(className);
        chatSection?.classList.remove(className);
        body.classList.remove(className);
    });

    const deviceType = getDeviceType();

    // Apply appropriate classes based on device type
    switch(deviceType) {
        case 'mobile-small':
        case 'mobile':
            videoContainer?.classList.add('mobile-layout');
            videoSection?.classList.add('mobile-video-section');
            chatSection?.classList.add('mobile-chat-section');
            body.classList.add('mobile-layout');
            break;
        case 'tablet':
            videoContainer?.classList.add('tablet-layout');
            videoSection?.classList.add('tablet-video-section');
            chatSection?.classList.add('tablet-chat-section');
            body.classList.add('tablet-layout');
            break;
        case 'desktop':
            videoContainer?.classList.add('desktop-layout');
            videoSection?.classList.add('desktop-video-section');
            chatSection?.classList.add('desktop-chat-section');
            body.classList.add('desktop-layout');
            break;
    }

    // Adjust video chat layout for better responsive behavior
    if (currentChatType === 'video' && videoContainer?.style.display === 'flex') {
        adjustVideoLayout();
    }
}

function adjustVideoLayout() {
    const deviceType = getDeviceType();
    const videoSection = document.querySelector('.video-section');
    const chatSection = document.querySelector('.chat-section');
    const userVideo = document.querySelector('.user-video');

    if (!videoSection || !chatSection) return;

    if (deviceType === 'mobile-small' || deviceType === 'mobile') {
        // Mobile: Stack video on top, chat below
        videoSection.style.width = '100%';
        videoSection.style.height = '65vh';
        chatSection.style.width = '100%';
        chatSection.style.height = '35vh';
        chatSection.style.borderLeft = 'none';
        chatSection.style.borderTop = '1px solid #ddd';

        // Position user video as overlay
        if (userVideo) {
            userVideo.style.position = 'absolute';
            userVideo.style.width = '25%';
            userVideo.style.height = '20%';
            userVideo.style.top = '80px';
            userVideo.style.right = '20px';
            userVideo.style.zIndex = '15';
        }
    } else {
        // Desktop/Tablet: Side by side layout
        const videoWidth = deviceType === 'tablet' ? '400px' : '450px';
        videoSection.style.width = videoWidth;
        videoSection.style.height = 'calc(100vh - 60px)';
        chatSection.style.width = `calc(100% - ${videoWidth})`;
        chatSection.style.height = 'calc(100vh - 60px)';
        chatSection.style.borderLeft = '1px solid #ddd';
        chatSection.style.borderTop = 'none';

        // Reset user video positioning
        if (userVideo) {
            userVideo.style.position = 'relative';
            userVideo.style.width = '100%';
            userVideo.style.height = 'calc(45vh - 60px)';
            userVideo.style.top = 'auto';
            userVideo.style.right = 'auto';
            userVideo.style.zIndex = 'auto';
        }
    }
}

function applyHomePageLayout() {
    const deviceType = getDeviceType();
    const homePage = document.getElementById('homePage');

    if (!homePage) return;

    // Remove all existing home page device classes
    const homePageClasses = ['home-mobile-layout', 'home-tablet-layout', 'home-desktop-layout'];
    homePageClasses.forEach(className => {
        homePage.classList.remove(className);
    });

    // Apply appropriate class based on device type
    switch(deviceType) {
        case 'mobile-small':
        case 'mobile':
            homePage.classList.add('home-mobile-layout');
            break;
        case 'tablet':
            homePage.classList.add('home-tablet-layout');
            break;
        case 'desktop':
            homePage.classList.add('home-desktop-layout');
            break;
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

    // Remove mobile body class
    document.body.classList.remove('mobile-video-active');

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

    // Stop NSFW monitoring
    if (typeof clientNSFWDetector !== 'undefined') {
        clientNSFWDetector.stopMonitoring();
    }

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

    // Add mobile body class to prevent scrolling
    if (isMobileDevice()) {
        document.body.classList.add('mobile-video-active');
    }

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
        case 'nsfw_warning':
            handleNSFWWarning(data);
            break;
        case 'partner_video_blocked':
            handlePartnerVideoBlocked(data);
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
            
            // Initialize NSFW detection for local video
            localVideo.addEventListener('loadeddata', async () => {
                await clientNSFWDetector.initialize();
                clientNSFWDetector.startMonitoring(localVideo);
            });
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

function handleNSFWWarning(data) {
    addVideoSystemMessage(`⚠️ ${data.message}`);
    if (data.violations >= 3) {
        addVideoSystemMessage("Multiple violations detected. Connection will be terminated.");
        setTimeout(() => {
            endVideoCall();
            showChatSelection();
        }, 3000);
    }
}

function handlePartnerVideoBlocked(data) {
    addVideoSystemMessage(`Partner's video blocked: ${data.reason}`);
    
    // Show overlay on remote video
    const remoteVideoContainer = remoteVideo?.parentElement;
    if (remoteVideoContainer) {
        const blockOverlay = document.createElement('div');
        blockOverlay.className = 'video-block-overlay';
        blockOverlay.innerHTML = `
            <div class="block-message">
                <h3>🚫 Video Blocked</h3>
                <p>${data.reason}</p>
            </div>
        `;
        remoteVideoContainer.appendChild(blockOverlay);
        
        // Remove overlay after 5 seconds
        setTimeout(() => {
            if (blockOverlay.parentNode) {
                blockOverlay.parentNode.removeChild(blockOverlay);
            }
        }, 5000);
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
    const userText = `${safeCount} online`;

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

    // Message input handling
    if (messageInput) {
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && messageInput.value.trim()) {
                sendMessage();
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

    // Footer navigation buttons
    if (footerTermsBtn) {
        footerTermsBtn.addEventListener('click', () => {
            alert('Terms & Conditions\n\nBy using our website, you agree to the following terms and conditions. Please read them carefully before using the chat service.\n\nYou must be at least 18 years old to use this platform. We do not permit minors to access or use the services provided.\n\nThis website allows users to connect and chat with strangers anonymously via text or video. While the platform is designed for casual and fun interactions, users must not use it for harassment, bullying, threats, hate speech, illegal activities, or explicit content.\n\nWe are not responsible for user-generated content or behavior during chats. Conversations are not monitored in real-time, but users are encouraged to report any violations using the report option or contact form.\n\nWe do not store or retain chat history. Once a chat ends, all messages and video streams are gone permanently. We value your privacy and avoid unnecessary data collection.\n\nUsers are not allowed to exploit or attempt to disrupt the platform using scripts, bots, or hacks. Any such behavior may lead to a permanent ban.\n\nThe website reserves the right to terminate or block users at any time if they are found violating these terms or creating a negative experience for others.\n\nThese terms may be updated at any time. Continued use of the site implies your acceptance of any changes made.\n\nBy using this site, you acknowledge and agree that you are solely responsible for your interactions and understand the potential risks of speaking with strangers online.\n\nIf you do not agree with these terms, please stop using the site immediately.');
        });
    }

    if (footerPrivacyBtn) {
        footerPrivacyBtn.addEventListener('click', () => {
            alert('Privacy Policy\n\nYour privacy matters to us. This policy explains how we handle your data and ensure a safe browsing and chatting experience on our platform.\n\nWe do not require users to register or submit personal information. No email, no password, no identity details — just open and start chatting. We do not store text chats or video content. All connections are made peer-to-peer and disappear as soon as the chat ends.\n\nWe may temporarily collect anonymized technical data like IP address or device type to help improve security, prevent spam, and ensure fair usage. This data is not stored permanently or shared with any third-party vendors, except analytics tools that help us measure general site performance (such as Google Analytics).\n\nCookies may be used to remember your preferences or help keep you connected between sessions. These cookies do not collect personal data and can be cleared at any time from your browser settings.\n\nWe do not target children and this platform is strictly for users aged 18 and above. If you are under 18, please leave the site immediately.\n\nWe take reasonable security measures to protect our servers and platform, but no system is 100% secure. Users are advised never to share personal information (e.g., name, address, phone number) during conversations.\n\nWe may update this policy at any time. Significant changes will be announced on the homepage or through a notification.');
        });
    }

    if (footerAboutBtn) {
        footerAboutBtn.addEventListener('click', () => {
            alert('About Us\n\nWelcome to our anonymous chat platform — a modern and secure way to meet strangers from across the world. Whether you\'re looking for a quick conversation, new friendships, or simply passing time, our platform provides a safe and easy environment to chat through text or video.\n\nWe created this website to help people connect in a spontaneous, open, and anonymous setting. Unlike traditional social networks, you don\'t need to register or create an account. Just click "New" and you\'re instantly matched with someone looking to talk — just like you.\n\nOur team is focused on building a distraction-free space that puts user privacy and simplicity first. With powerful peer-to-peer WebRTC technology, your chats and video calls are never stored or recorded. Everything happens in real time.\n\nWe care about community and safety. Our platform includes basic protections, moderation tools, and a report system to help prevent misuse. While we do not monitor every conversation, we expect all users to follow respectful behavior and our terms.\n\nWe\'re constantly improving the platform, fixing bugs, and adding useful features based on user feedback. If you\'d like to contribute ideas or report an issue, we welcome your input through the contact page.\n\nThank you for being part of our global chat community!');
        });
    }

    // Global Community section click handler
    const globalCommunitySection = document.getElementById('globalCommunitySection');
    if (globalCommunitySection) {
        globalCommunitySection.addEventListener('click', () => {
            window.location.href = 'global-community.html';
        });
    }

    // Back Home button handler
    const backHomeBtn = document.getElementById('backHomeBtn');
    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            showHomePage();
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
    // Remove mobile body class
    document.body.classList.remove('mobile-video-active');

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