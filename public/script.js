
// Enhanced video element management with duplicate cleanup
function ensureVideoElements() {
    // Clean up any duplicate video elements first
    cleanupDuplicateVideoElements();
    
    if (!localVideo) {
        localVideo = document.getElementById('localVideo');
    }
    if (!remoteVideo) {
        remoteVideo = document.getElementById('remoteVideo');
    }
    
    if (localVideo) {
        localVideo.autoplay = true;
        localVideo.playsInline = true;
        localVideo.muted = true;
        localVideo.setAttribute('playsinline', '');
        localVideo.setAttribute('webkit-playsinline', '');
        console.log('Local video element configured with attributes:', {
            autoplay: localVideo.autoplay,
            playsInline: localVideo.playsInline,
            muted: localVideo.muted
        });
    }
    
    if (remoteVideo) {
        remoteVideo.autoplay = true;
        remoteVideo.playsInline = true;
        remoteVideo.muted = false;
        remoteVideo.controls = false;
        remoteVideo.setAttribute('playsinline', '');
        remoteVideo.setAttribute('webkit-playsinline', '');
        console.log('Remote video element configured with attributes:', {
            autoplay: remoteVideo.autoplay,
            playsInline: remoteVideo.playsInline,
            muted: remoteVideo.muted,
            controls: remoteVideo.controls
        });
    }
    
    console.log('Video elements status:', {
        localVideo: localVideo ? 'ready' : 'missing',
        remoteVideo: remoteVideo ? 'ready' : 'missing'
    });
}

// Function to clean up duplicate video elements
function cleanupDuplicateVideoElements() {
    // Find all elements with localVideo ID
    const localVideoElements = document.querySelectorAll('#localVideo');
    if (localVideoElements.length > 1) {
        console.log(`Found ${localVideoElements.length} localVideo elements, removing duplicates`);
        // Keep the first one, remove the rest
        for (let i = 1; i < localVideoElements.length; i++) {
            localVideoElements[i].remove();
        }
    }
    
    // Find all elements with remoteVideo ID
    const remoteVideoElements = document.querySelectorAll('#remoteVideo');
    if (remoteVideoElements.length > 1) {
        console.log(`Found ${remoteVideoElements.length} remoteVideo elements, removing duplicates`);
        // Keep the first one, remove the rest
        for (let i = 1; i < remoteVideoElements.length; i++) {
            remoteVideoElements[i].remove();
        }
    }
    
    // Also clean up any video elements without proper IDs that might be duplicates
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
        const allVideoElements = videoContainer.querySelectorAll('video');
        const validVideoElements = [];
        
        allVideoElements.forEach(video => {
            if (video.id === 'localVideo' || video.id === 'remoteVideo') {
                validVideoElements.push(video);
            } else if (!video.id || video.id === '') {
                // Remove video elements without proper IDs (likely duplicates)
                console.log('Removing video element without proper ID:', video);
                video.remove();
            }
        });
    }
}

// Call this function when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ensureVideoElements();
    // ... rest of initialization
});

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
let remoteVideo = document.getElementById('remoteVideo');
let localVideo = document.getElementById('localVideo');
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
const WS_SERVER_URL = 'wss://omegle-xyz.onrender.com';
const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { 
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    },
    { 
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    },
    { 
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
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
let iceCandidateQueue = []; // Queue for ICE candidates
let isRemoteDescriptionSet = false;
let peerConnectionTimeout = null; // Timeout for peer connection
let webrtcRetryAttempts = 0; // WebRTC specific retry counter
// Fix 1: Add shouldReconnect flag to track if user is still in active chat
let shouldReconnect = false;
// Fix 5: Add heartbeat/ping system variables
let heartbeatInterval = null;
let lastPingTime = null;
let awaitingPong = false;
const MAX_RECONNECT_ATTEMPTS = 5;
const MAX_WEBRTC_RETRIES = 3; // Maximum WebRTC connection retry attempts
const CONNECTION_TIMEOUT = 10000;
const PEER_CONNECTION_TIMEOUT = 10000;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

// XSS Sanitization function
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// Check media permissions using Permissions API
async function checkMediaPermissions() {
    try {
        if (!navigator.permissions) {
            console.warn('Permissions API not supported');
            return { camera: 'unknown', microphone: 'unknown' };
        }

        const [cameraPermission, microphonePermission] = await Promise.all([
            navigator.permissions.query({ name: 'camera' }).catch(() => ({ state: 'unknown' })),
            navigator.permissions.query({ name: 'microphone' }).catch(() => ({ state: 'unknown' }))
        ]);

        return {
            camera: cameraPermission.state,
            microphone: microphonePermission.state
        };
    } catch (error) {
        console.warn('Error checking permissions:', error);
        return { camera: 'unknown', microphone: 'unknown' };
    }
}

// Enhanced media permission error handling
async function handleMediaPermissionDenied() {
    const permissions = await checkMediaPermissions();
    
    let message = 'Camera/microphone access is required for video chat.\n\n';
    let feedbackMessage = 'Camera/Microphone Access Blocked';
    
    if (permissions.camera === 'denied' || permissions.microphone === 'denied') {
        message += 'Permissions have been blocked. To enable:\n';
        message += '1. Click the camera/microphone icon in your browser\'s address bar\n';
        message += '2. Select "Allow" for camera and microphone\n';
        message += '3. Refresh the page and try again\n\n';
        message += 'Or check your browser settings to unblock this site.';
        feedbackMessage = 'Media Permissions Blocked - Check Browser Settings';
    } else {
        message += 'Please allow camera and microphone access when prompted.';
        feedbackMessage = 'Media Access Denied - Allow Permissions When Prompted';
    }
    
    // Show enhanced user feedback
    showUserFeedback(feedbackMessage, 'error');
    showErrorFeedback('Camera/microphone access denied - check browser permissions');
    
    // Show detailed alert for critical error
    setTimeout(() => {
        alert(message);
    }, 1000);
}

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
    ensureMobileViewport();

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

    // Fix 3: Handle page visibility change - skip reconnect when tab is hidden, reconnect when visible
    document.addEventListener('visibilitychange', () => {
        console.log('Visibility changed:', document.hidden ? 'hidden' : 'visible');
        
        if (document.hidden) {
            // Page is hidden, pause reconnection attempts
            if (connectionTimeout) {
                clearTimeout(connectionTimeout);
                connectionTimeout = null;
            }
            // Stop heartbeat when tab is hidden
            stopHeartbeat();
        } else {
            // Page became visible, check if we need to reconnect
            if (shouldReconnect && currentChatType && (!socket || socket.readyState !== WebSocket.OPEN)) {
                console.log('Tab became visible and WebSocket is disconnected, attempting reconnection...');
                const message = "Tab became active. Reconnecting...";
                currentChatType === 'text' 
                    ? addSystemMessage(message)
                    : addVideoSystemMessage(message);
                
                // Reset attempts when coming back from hidden state
                reconnectAttempts = 0;
                connectWebSocket();
            }
        }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
        cleanupConnections();
    });
});

// Mobile-first responsive viewport
function ensureMobileViewport() {
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
    }
    // Mobile-first responsive viewport
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// Enhanced device detection and responsive behavior
function getDeviceType() {
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
}

function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTabletDevice() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
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
        if (videoContainer) videoContainer.classList.remove(className);
        if (videoSection) videoSection.classList.remove(className);
        if (chatSection) chatSection.classList.remove(className);
        if (body) body.classList.remove(className);
    });

    // Get actual device type
    const deviceType = getDeviceType();

    // Apply appropriate layout classes
    if (videoContainer) videoContainer.classList.add(`${deviceType}-layout`);
    if (videoSection) videoSection.classList.add(`${deviceType}-video-section`);
    if (chatSection) chatSection.classList.add(`${deviceType}-chat-section`);
    if (body) body.classList.add(`${deviceType}-layout`);

    // Adjust video chat layout for better responsive behavior
    if (currentChatType === 'video' && videoContainer && videoContainer.style.display === 'flex') {
        adjustVideoLayout();
    }
}

function adjustVideoLayout() {
    const videoSection = document.querySelector('.video-section');
    const chatSection = document.querySelector('.chat-section');
    const userVideo = document.querySelector('.user-video');
    const floatingVideo = document.querySelector('.local-video-float');
    const localVideo = document.getElementById('localVideo');
    const strangerVideoContainer = document.querySelector('.stranger-video');

    if (!videoSection || !chatSection) return;

    if (isMobileDevice()) {
        // Mobile layout - local video floats inside stranger video container
        if (localVideo && strangerVideoContainer && !strangerVideoContainer.contains(localVideo)) {
            strangerVideoContainer.appendChild(localVideo);
        }
        
        // Ensure mobile floating styles are applied
        if (localVideo) {
            localVideo.style.position = 'absolute';
            localVideo.style.top = '10px';
            localVideo.style.right = '10px';
            localVideo.style.width = '90px';
            localVideo.style.height = '70px';
            localVideo.style.zIndex = '10';
            localVideo.style.borderRadius = '8px';
            localVideo.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            localVideo.style.objectFit = 'cover';
            localVideo.style.display = 'block';
            localVideo.style.opacity = '1';
            localVideo.style.visibility = 'visible';
            localVideo.style.border = '2px solid white';
            localVideo.style.backgroundColor = '#2a2a2a';
        }
        
        // Hide the separate floating video container on mobile
        if (floatingVideo) {
            floatingVideo.style.display = 'none';
        }
    } else {
        // Desktop layout: Side by side
        const videoWidth = '450px';
        videoSection.style.width = videoWidth;
        videoSection.style.height = 'calc(100vh - 60px)';
        chatSection.style.width = `calc(100% - ${videoWidth})`;
        chatSection.style.height = 'calc(100vh - 60px)';
        chatSection.style.borderLeft = '1px solid #ddd';
        chatSection.style.borderTop = 'none';

        // Reset user video positioning for desktop
        if (userVideo) {
            userVideo.style.position = 'relative';
            userVideo.style.width = '100%';
            userVideo.style.height = 'calc(45vh - 60px)';
            userVideo.style.top = 'auto';
            userVideo.style.right = 'auto';
            userVideo.style.zIndex = 'auto';
        }

        // Move local video back to user video container on desktop
        if (localVideo && userVideo && !userVideo.contains(localVideo)) {
            userVideo.appendChild(localVideo);
        }

        // Ensure floating video is hidden on desktop
        if (floatingVideo) {
            floatingVideo.style.display = 'none';
        }
    }
}

function applyHomePageLayout() {
    const homePage = document.getElementById('homePage');

    if (!homePage) return;

    // Remove all existing home page device classes
    const homePageClasses = ['home-mobile-layout', 'home-tablet-layout', 'home-desktop-layout'];
    homePageClasses.forEach(className => {
        homePage.classList.remove(className);
    });

    // Always apply desktop layout
    homePage.classList.add('home-desktop-layout');
}

// UI Functions
function showHomePage() {
    // Fix 1: Reset shouldReconnect when going back to home page
    shouldReconnect = false;
    homePage.style.display = 'block';
    homeScreen.style.display = 'none';
    chatContainer.style.display = 'none';
    videoContainer.style.display = 'none';
    cleanupConnections();
}

function showChatSelection() {
    // Fix 1: Reset shouldReconnect when going to chat selection
    shouldReconnect = false;
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

// Fix 5: Heartbeat/ping system to keep WebSocket alive
function startHeartbeat() {
    // Clear any existing heartbeat
    stopHeartbeat();
    
    console.log('Starting WebSocket heartbeat (ping every 30s)');
    heartbeatInterval = setInterval(() => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            if (awaitingPong) {
                console.warn('Previous ping did not receive pong, connection may be dead');
                // Connection might be dead, trigger reconnection
                handleConnectionError('Heartbeat failed - connection timeout');
                return;
            }
            
            console.log('Sending ping to server');
            lastPingTime = Date.now();
            awaitingPong = true;
            
            try {
                socket.send(JSON.stringify({
                    type: 'ping',
                    timestamp: lastPingTime
                }));
            } catch (error) {
                console.error('Failed to send ping:', error);
                handleConnectionError('Failed to send heartbeat ping');
            }
        } else {
            console.log('WebSocket not open, stopping heartbeat');
            stopHeartbeat();
        }
    }, HEARTBEAT_INTERVAL);
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        console.log('Stopping WebSocket heartbeat');
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
    awaitingPong = false;
    lastPingTime = null;
}

function handlePongResponse(data) {
    awaitingPong = false;
    const roundTripTime = Date.now() - (data.timestamp || lastPingTime || Date.now());
    console.log(`Received pong from server (RTT: ${roundTripTime}ms)`);
}

// Enhanced cleanup with proper resource management
function cleanupConnections() {
    console.log('Cleaning up connections...');

    // Fix 1: Set shouldReconnect to false when cleaning up
    shouldReconnect = false;
    
    // Fix 5: Stop heartbeat when cleaning up
    stopHeartbeat();

    // Clean up error state manager
    errorStateManager.cleanup();

    // Remove mobile body class with null check
    if (document.body) {
        document.body.classList.remove('mobile-video-active');
    }

    // Clear all timeouts
    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    if (peerConnectionTimeout) {
        clearTimeout(peerConnectionTimeout);
        peerConnectionTimeout = null;
    }

    // Reset layout classes with comprehensive null checks
    try {
        if (videoContainer) {
            videoContainer.classList.remove('mobile-layout', 'desktop-layout');
        }
        const videoSection = document.querySelector('.video-section');
        if (videoSection) {
            videoSection.classList.remove('mobile-video-section', 'desktop-video-section');
        }
        const chatSection = document.querySelector('.chat-section');
        if (chatSection) {
            chatSection.classList.remove('mobile-chat-section', 'desktop-chat-section');
        }
    } catch (error) {
        console.error('Error resetting layout classes:', error);
    }

    // Stop NSFW monitoring with error handling
    try {
        if (typeof clientNSFWDetector !== 'undefined' && clientNSFWDetector) {
            clientNSFWDetector.stopMonitoring();
        }
    } catch (error) {
        console.error('Error stopping NSFW monitoring:', error);
    }

    // Enhanced WebRTC cleanup with better error handling
    if (peerConnection) {
        try {
            // Remove all event listeners to prevent memory leaks
            peerConnection.ontrack = null;
            peerConnection.onicecandidate = null;
            peerConnection.onconnectionstatechange = null;
            peerConnection.oniceconnectionstatechange = null;
            peerConnection.onsignalingstatechange = null;
            peerConnection.ondatachannel = null;
            
            // Close the connection
            peerConnection.close();
        } catch (e) {
            console.error('Error closing peer connection:', e);
        }
        peerConnection = null;
    }

    if (dataChannel) {
        try {
            dataChannel.onopen = null;
            dataChannel.onclose = null;
            dataChannel.onmessage = null;
            dataChannel.onerror = null;
            dataChannel.close();
        } catch (e) {
            console.error('Error closing data channel:', e);
        }
        dataChannel = null;
    }

    // Stop and release all media tracks with enhanced error handling
    if (localStream) {
        try {
            localStream.getTracks().forEach(track => {
                try {
                    track.stop();
                    // Remove track event listeners
                    track.onended = null;
                    track.onmute = null;
                    track.onunmute = null;
                } catch (trackError) {
                    console.error('Error stopping individual track:', trackError);
                }
            });
        } catch (e) {
            console.error('Error stopping local stream:', e);
        }
        localStream = null;
    }

    // Clear video elements and release resources with null checks
    try {
        if (localVideo && localVideo.srcObject) {
            localVideo.srcObject = null;
            localVideo.load(); // Force release of resources
        }
        if (remoteVideo && remoteVideo.srcObject) {
            remoteVideo.srcObject = null;
            remoteVideo.load(); // Force release of resources
        }
    } catch (error) {
        console.error('Error clearing video elements:', error);
    }

    // Reset state variables
    isConnected = false;
    isInitiator = false;
    reconnectAttempts = 0;
    webrtcRetryAttempts = 0; // Reset WebRTC retry counter
    iceCandidateQueue = [];
    isRemoteDescriptionSet = false;

    disconnect();
}

function startTextChat() {
    currentChatType = 'text';
    // Fix 1: Set shouldReconnect to true when starting chat
    shouldReconnect = true;
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
    console.log('Starting video chat...');
    currentChatType = 'video';
    // Fix 1: Set shouldReconnect to true when starting video chat
    shouldReconnect = true;
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

    // Add connecting animation
    const strangerVideo = document.querySelector('.stranger-video');
    if (strangerVideo) {
        strangerVideo.classList.add('connecting');
    }

    try {
        console.log('Requesting media permissions...');
        const hasMedia = await requestMediaPermissions();
        if (hasMedia) {
            console.log('Media permissions granted, connecting to WebSocket...');
            connectWebSocket();
        } else {
            throw new Error('Media permissions denied');
        }
    } catch (error) {
        console.error('Video chat initialization failed:', error);
        addVideoSystemMessage("Failed to start video chat. Please check your camera/microphone permissions and try again.");
        
        // Handle permission denied specifically
        await handleMediaPermissionDenied();
        
        // Give user option to try again
        setTimeout(() => {
            const tryAgainBtn = document.createElement('button');
            tryAgainBtn.textContent = 'Try Again';
            tryAgainBtn.style.margin = '10px';
            tryAgainBtn.style.padding = '8px 16px';
            tryAgainBtn.style.backgroundColor = '#4a90e2';
            tryAgainBtn.style.color = 'white';
            tryAgainBtn.style.border = 'none';
            tryAgainBtn.style.borderRadius = '4px';
            tryAgainBtn.style.cursor = 'pointer';
            
            tryAgainBtn.onclick = () => {
                startVideoChat();
            };
            
            if (videoChatMessages) {
                const msgDiv = document.createElement('div');
                msgDiv.appendChild(tryAgainBtn);
                videoChatMessages.appendChild(msgDiv);
            }
        }, 2000);
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

        // Clear any existing timeout
        errorStateManager.clearTimeoutAlert('websocket');

        // Set connection timeout using new system
        timeoutAlert('websocket', CONNECTION_TIMEOUT, 
            'WebSocket connection timed out. Please check your internet connection.',
            () => connectWebSocket()
        );

        socket.onopen = () => {
            console.log('Connected to server');

            // Clear timeout on successful connection
            errorStateManager.clearTimeoutAlert('websocket');

            reconnectAttempts = 0;
            
            // Remove any reconnecting overlay
            errorStateManager.removeOverlay(null, 'reconnecting');
            
            // Fix 5: Start heartbeat system when connection opens
            startHeartbeat();

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

            // Clear timeout
            errorStateManager.clearTimeoutAlert('websocket');
            
            // Fix 5: Stop heartbeat when connection closes
            stopHeartbeat();

            isConnected = false;
            updateConnectionStatus(false);

            // Fix 1 & 3: Only attempt reconnection if shouldReconnect is true, we're in chat, haven't exceeded max attempts, and tab is visible
            if (shouldReconnect && currentChatType && reconnectAttempts < MAX_RECONNECT_ATTEMPTS && !document.hidden) {
                reconnectAttempts++;
                const delay = Math.min(2000 * Math.pow(2, reconnectAttempts - 1), 10000);

                console.log(`Attempting reconnection ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`);

                // Show reconnecting overlay
                showUserFeedback('Reconnecting...', 'reconnecting', { showSpinner: true });

                connectionTimeout = setTimeout(() => {
                    if (shouldReconnect && currentChatType) connectWebSocket();
                }, delay);
            } else if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS && shouldReconnect) {
                // Show critical error overlay with retry options
                errorStateManager.showCriticalError({
                    title: 'Connection Failed',
                    message: 'Unable to connect after multiple attempts. Please check your internet connection and try again.',
                    type: 'connection',
                    onRetry: () => {
                        reconnectAttempts = 0;
                        connectWebSocket();
                    },
                    onGoBack: () => {
                        cleanupConnections();
                        showHomePage();
                    }
                });
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
            
            // Add connecting animation for video chat
            if (currentChatType === 'video') {
                const strangerVideo = document.querySelector('.stranger-video');
                if (strangerVideo) {
                    strangerVideo.classList.add('connecting');
                }
            }
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
        case 'pong':
            // Fix 5: Handle pong response from server
            handlePongResponse(data);
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

// Message Handling with XSS protection
function sendMessage() {
    const message = messageInput?.value?.trim();
    if (!message || !isConnected || !socket || socket.readyState !== WebSocket.OPEN) return;

    // Sanitize input before sending
    const sanitizedMessage = sanitizeInput(message);
    addUserMessage(sanitizedMessage);

    try {
        socket.send(JSON.stringify({
            type: 'message',
            message: sanitizedMessage
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

    // Sanitize input before sending
    const sanitizedMessage = sanitizeInput(message);
    addVideoUserMessage(sanitizedMessage);

    try {
        socket.send(JSON.stringify({
            type: 'message',
            message: sanitizedMessage
        }));
    } catch (error) {
        console.error('Error sending video message:', error);
        addVideoSystemMessage('Failed to send message');
    }

    videoMessageInput.value = '';
}

// Message Display Functions with XSS protection
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
    // Use textContent to prevent XSS
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
        img.alt = sanitizeInput(fileName);
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
    caption.textContent = `${sanitizeInput(fileName)} (${fileSize}MB)`;
    messageDiv.appendChild(caption);

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    return messageDiv;
}

function showDownloadOption(fileURL, fileName) {
    if (confirm(`Download ${sanitizeInput(fileName)}?`)) {
        try {
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = sanitizeInput(fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    }
}

// Enhanced WebRTC Functions with proper error handling
async function requestMediaPermissions() {
    try {
        // First check permissions
        const permissions = await checkMediaPermissions();
        
        if (permissions.camera === 'denied' || permissions.microphone === 'denied') {
            await handleMediaPermissionDenied();
            return false;
        }

        // First try with video and audio
        let constraints = {
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

        try {
            localStream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (error) {
            // Fallback to video only if audio fails
            console.warn('Audio failed, trying video only:', error);
            try {
                constraints = { video: constraints.video };
                localStream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (videoError) {
                console.error('Video also failed:', videoError);
                throw videoError;
            }
        }

        if (localVideo && localStream) {
            // Check if we actually have tracks
            const videoTracks = localStream.getVideoTracks();
            const audioTracks = localStream.getAudioTracks();
            
            if (videoTracks.length === 0 && audioTracks.length === 0) {
                throw new Error('No media tracks available - camera/microphone may be blocked');
            }
            
            // Enhanced audio tracks debugging for mute/permission issues
            console.log("Audio tracks:", audioTracks);
            audioTracks.forEach((track, index) => {
                console.log(`Audio track ${index}:`, {
                    id: track.id,
                    label: track.label,
                    enabled: track.enabled,
                    muted: track.muted,
                    readyState: track.readyState,
                    constraints: track.getConstraints(),
                    settings: track.getSettings()
                });
            });
            
            // Log track information for debugging
            console.log(`Media tracks: ${videoTracks.length} video, ${audioTracks.length} audio`);
            
            // Set local video source to show user's own video with error handling
            try {
                localVideo.srcObject = localStream;
                localVideo.muted = true; // Prevent feedback
                
                // For mobile devices, ensure local video is positioned correctly inside stranger video container
                if (isMobileDevice()) {
                    const strangerVideoContainer = document.querySelector('.stranger-video');
                    if (strangerVideoContainer && localVideo && !strangerVideoContainer.contains(localVideo)) {
                        // Move local video inside stranger video container for mobile floating effect
                        strangerVideoContainer.appendChild(localVideo);
                        console.log('Local video moved to stranger video container for mobile floating preview');
                    }
                    
                    // Ensure local video has the correct mobile floating styles
                    if (localVideo) {
                        localVideo.style.position = 'absolute';
                        localVideo.style.top = '10px';
                        localVideo.style.right = '10px';
                        localVideo.style.width = '90px';
                        localVideo.style.height = '70px';
                        localVideo.style.zIndex = '10';
                        localVideo.style.borderRadius = '8px';
                        localVideo.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
                        localVideo.style.objectFit = 'cover';
                        localVideo.style.display = 'block';
                        localVideo.style.opacity = '1';
                        localVideo.style.visibility = 'visible';
                        localVideo.style.border = '2px solid white';
                        localVideo.style.backgroundColor = '#2a2a2a';
                    }
                    
                    // Hide the separate floating video container on mobile
                    const floatingContainer = document.querySelector('.local-video-float');
                    if (floatingContainer) {
                        floatingContainer.style.display = 'none';
                    }
                } else {
                    // Desktop behavior - keep local video in its designated container
                    const userVideoContainer = document.querySelector('.user-video');
                    if (userVideoContainer && localVideo && !userVideoContainer.contains(localVideo)) {
                        userVideoContainer.appendChild(localVideo);
                    }
                    
                    // Reset local video styles for desktop
                    if (localVideo) {
                        localVideo.style.position = 'static';
                        localVideo.style.width = '100%';
                        localVideo.style.height = '100%';
                        localVideo.style.top = 'auto';
                        localVideo.style.right = 'auto';
                        localVideo.style.zIndex = 'auto';
                        localVideo.style.border = 'none';
                    }
                    
                    // Hide floating video on desktop to prevent confusion
                    const floatingContainer = document.querySelector('.local-video-float');
                    if (floatingContainer) {
                        floatingContainer.style.display = 'none';
                    }
                }
                
                // Wait for video to be ready
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Video load timeout'));
                    }, 5000);
                    
                    localVideo.addEventListener('loadeddata', () => {
                        clearTimeout(timeout);
                        resolve();
                    }, { once: true });
                });
            } catch (videoLoadError) {
                console.error('Error loading local video:', videoLoadError);
                throw new Error('Failed to initialize camera display');
            }

            // Initialize NSFW detection for local video
            try {
                if (typeof clientNSFWDetector !== 'undefined') {
                    await clientNSFWDetector.initialize();
                    clientNSFWDetector.startMonitoring(localVideo);
                }
            } catch (nsfwError) {
                console.warn('NSFW detector failed to initialize:', nsfwError);
            }
        }

        addVideoSystemMessage("Camera ready. Looking for someone to chat with...");
        return true;
    } catch (error) {
        console.error('Error accessing media devices:', error);

        let errorMessage = "Camera access denied or not found.";
        let errorType = 'error';

        if (error.name === 'NotAllowedError') {
            errorMessage = "Camera/microphone access denied. Please allow permissions and try again.";
            errorType = 'permission';
            
            // Show permission error overlay
            showUserFeedback(errorMessage, errorType, {
                fullModal: true,
                persistent: true,
                onRetry: () => startVideoChat(),
                onGoBack: () => {
                    cleanupConnections();
                    showHomePage();
                }
            });
        } else if (error.name === 'NotFoundError') {
            errorMessage = "No camera/microphone found. Please check your devices and try again.";
            showUserFeedback(errorMessage, 'error', {
                fullModal: true,
                onRetry: () => startVideoChat()
            });
        } else if (error.name === 'NotReadableError') {
            errorMessage = "Camera/microphone is already in use by another application. Please close other apps and try again.";
            showUserFeedback(errorMessage, 'error', {
                fullModal: true,
                onRetry: () => startVideoChat()
            });
        } else if (error.name === 'OverconstrainedError') {
            errorMessage = "Camera constraints not supported. Trying with basic settings.";
            showUserFeedback(errorMessage, 'warning');
        } else {
            // Generic error with full modal
            showUserFeedback(errorMessage, 'error', {
                fullModal: true,
                onRetry: () => startVideoChat()
            });
        }

        addVideoSystemMessage(errorMessage);
        return false;
    }
}

// Enhanced WebRTC initialization with proper ICE candidate queueing
async function initializeWebRTC(initiator) {
    try {
        console.log('Initializing WebRTC, initiator:', initiator);
        isInitiator = initiator;

        // Clean up existing connection
        if (peerConnection) {
            peerConnection.close();
            peerConnection = null;
        }

        // Reset ICE candidate queue
        iceCandidateQueue = [];
        isRemoteDescriptionSet = false;

        peerConnection = new RTCPeerConnection({ 
            iceServers: ICE_SERVERS,
            iceCandidatePoolSize: 10,
            iceTransportPolicy: 'all',
            bundlePolicy: 'balanced'
        });

        // Set peer connection timeout
        peerConnectionTimeout = setTimeout(() => {
            if (peerConnection && peerConnection.connectionState !== 'connected') {
                console.log('Peer connection timeout');
                addVideoSystemMessage('Connection timeout. Would you like to try again?');
                
                // Show retry option
                const retryBtn = document.createElement('button');
                retryBtn.textContent = 'Retry Connection';
                retryBtn.style.margin = '10px';
                retryBtn.style.padding = '8px 16px';
                retryBtn.style.backgroundColor = '#28a745';
                retryBtn.style.color = 'white';
                retryBtn.style.border = 'none';
                retryBtn.style.borderRadius = '4px';
                retryBtn.style.cursor = 'pointer';
                
                retryBtn.onclick = () => {
                    // Retry connection
                    if (videoChatMessages) videoChatMessages.innerHTML = '';
                    addVideoSystemMessage("Retrying connection...");
                    connectWebSocket();
                };
                
                if (videoChatMessages) {
                    const msgDiv = document.createElement('div');
                    msgDiv.appendChild(retryBtn);
                    videoChatMessages.appendChild(msgDiv);
                }
            }
        }, PEER_CONNECTION_TIMEOUT);

        // Add local stream tracks
        if (localStream) {
            localStream.getTracks().forEach(track => {
                console.log('Adding track:', track.kind, track.label);
                const sender = peerConnection.addTrack(track, localStream);
                console.log('Track added with sender:', sender);
            });
        }

        // Handle remote stream - modern approach with ontrack
        peerConnection.ontrack = (event) => {
            console.log('Received remote track:', {
                kind: event.track.kind,
                streamsCount: event.streams.length,
                trackId: event.track.id,
                trackEnabled: event.track.enabled,
                trackReadyState: event.track.readyState,
                trackMuted: event.track.muted
            });
            
            // Log detailed track state
            console.log('Track details:', {
                enabled: event.track.enabled,
                readyState: event.track.readyState,
                muted: event.track.muted,
                label: event.track.label,
                settings: event.track.getSettings ? event.track.getSettings() : 'not supported'
            });
            
            // Ensure remote video element is available and properly configured
            if (!remoteVideo) {
                remoteVideo = document.getElementById('remoteVideo');
                console.log('Re-fetching remote video element:', remoteVideo ? 'found' : 'not found');
                if (!remoteVideo) {
                    console.error('Remote video element not found in DOM');
                    addVideoSystemMessage('Error: Remote video element not found');
                    return;
                }
            }
            
            if (event.streams && event.streams.length > 0) {
                const stream = event.streams[0];
                console.log('Setting remote video source with stream:', {
                    streamId: stream.id,
                    streamActive: stream.active,
                    audioTracks: stream.getAudioTracks().length,
                    videoTracks: stream.getVideoTracks().length
                });
                
                // Log detailed stream state
                stream.getTracks().forEach((track, index) => {
                    console.log(`Stream track ${index} (${track.kind}):`, {
                        id: track.id,
                        enabled: track.enabled,
                        readyState: track.readyState,
                        muted: track.muted,
                        label: track.label
                    });
                });
                
                // Ensure video element has correct attributes before setting stream
                remoteVideo.autoplay = true;
                remoteVideo.playsInline = true;
                remoteVideo.muted = false;
                remoteVideo.controls = false;
                remoteVideo.setAttribute('playsinline', '');
                remoteVideo.setAttribute('webkit-playsinline', '');
                
                // Set the remote stream
                remoteVideo.srcObject = stream;
                
                // Enhanced play handling with proper metadata waiting and error handling
                const attemptVideoPlay = async () => {
                    try {
                        console.log('Attempting to play remote video...');
                        console.log('Remote video state before play:', {
                            readyState: remoteVideo.readyState,
                            networkState: remoteVideo.networkState,
                            paused: remoteVideo.paused,
                            currentTime: remoteVideo.currentTime,
                            videoWidth: remoteVideo.videoWidth,
                            videoHeight: remoteVideo.videoHeight
                        });
                        
                        // Wait for metadata if not ready
                        if (remoteVideo.readyState < 1) {
                            console.log('Waiting for metadata to load...');
                            await new Promise((resolve, reject) => {
                                const timeout = setTimeout(() => reject(new Error('Metadata load timeout')), 5000);
                                remoteVideo.onloadedmetadata = () => {
                                    clearTimeout(timeout);
                                    console.log('Metadata loaded successfully');
                                    resolve();
                                };
                            });
                        }
                        
                        // Attempt to play
                        await remoteVideo.play();
                        
                        console.log('Remote video playing successfully!');
                        console.log('Final remote video state:', {
                            currentTime: remoteVideo.currentTime,
                            duration: remoteVideo.duration,
                            videoWidth: remoteVideo.videoWidth,
                            videoHeight: remoteVideo.videoHeight,
                            paused: remoteVideo.paused,
                            ended: remoteVideo.ended,
                            readyState: remoteVideo.readyState
                        });
                        
                        addVideoSystemMessage('Remote video connected successfully!');
                        showUserFeedback('Remote video connected!', 'success');
                        
                        // Remove connecting animation
                        const strangerVideo = document.querySelector('.stranger-video');
                        if (strangerVideo) {
                            strangerVideo.classList.remove('connecting');
                        }
                        
                    } catch (playError) {
                        console.error('Remote video play failed:', {
                            error: playError,
                            name: playError.name,
                            message: playError.message,
                            videoReadyState: remoteVideo.readyState,
                            videoSrc: remoteVideo.srcObject ? 'set' : 'null',
                            streamActive: stream.active,
                            trackStates: stream.getTracks().map(t => ({
                                kind: t.kind,
                                enabled: t.enabled,
                                readyState: t.readyState,
                                muted: t.muted
                            }))
                        });
                        
                        // Handle autoplay policy restrictions
                        if (playError.name === 'NotAllowedError') {
                            console.log('Autoplay blocked by browser policy, requiring user interaction');
                            addVideoSystemMessage('Click anywhere to enable remote video playback');
                            
                            const enablePlayback = async () => {
                                try {
                                    await remoteVideo.play();
                                    console.log('Remote video playing after user interaction');
                                    addVideoSystemMessage('Remote video connected!');
                                    showUserFeedback('Remote video enabled!', 'success');
                                } catch (retryError) {
                                    console.error('Remote video still failed after user interaction:', retryError);
                                    addVideoSystemMessage('Remote video failed to play - please refresh and try again');
                                    showErrorFeedback('Failed to enable remote video');
                                }
                            };
                            
                            // Listen for user interaction
                            document.addEventListener('click', enablePlayback, { once: true });
                            document.addEventListener('touchstart', enablePlayback, { once: true });
                        } else {
                            addVideoSystemMessage('Remote video connection failed');
                            showErrorFeedback('Failed to play remote video: ' + playError.message);
                        }
                    }
                };
                
                // Start play attempt with proper timing
                if (remoteVideo.readyState >= 1) { // HAVE_METADATA or higher
                    console.log('Video metadata already available, playing immediately');
                    attemptVideoPlay();
                } else {
                    console.log('Waiting for video metadata to load...');
                    remoteVideo.onloadedmetadata = () => {
                        console.log('Video metadata loaded event fired');
                        attemptVideoPlay();
                    };
                    
                    // Fallback timeout in case metadata doesn't load
                    setTimeout(() => {
                        if (remoteVideo.readyState < 1) {
                            console.log('Metadata load timeout, attempting play anyway');
                            attemptVideoPlay();
                        }
                    }, 3000);
                }
                
            } else {
                console.warn('No remote stream available in ontrack event');
                console.warn('Event details:', {
                    streams: event.streams,
                    track: event.track
                });
                addVideoSystemMessage('No remote video stream received');
                showUserFeedback('No remote stream received', 'warning');
            }
        };

        // Enhanced browser compatibility: fallback for older browsers using onaddstream
        if (typeof peerConnection.onaddstream !== 'undefined') {
            console.log('Adding legacy onaddstream support for browser compatibility');
            peerConnection.onaddstream = (event) => {
                console.log('Received remote stream (legacy onaddstream):', event.stream);
                if (remoteVideo && event.stream) {
                    console.log('Setting remote video source (legacy)');
                    
                    // Ensure video element has correct attributes for legacy browsers
                    remoteVideo.autoplay = true;
                    remoteVideo.playsInline = true;
                    remoteVideo.muted = false;
                    remoteVideo.controls = false;
                    
                    remoteVideo.srcObject = event.stream;
                    
                    // Add same browser compatibility fallbacks for legacy mode
                    remoteVideo.onloadedmetadata = () => {
                        console.log('Remote video metadata loaded (legacy)');
                        remoteVideo.play().catch((e) => {
                            console.error("Remote video autoplay failed in onloadedmetadata (legacy):", e);
                            addVideoSystemMessage('Click anywhere to enable remote video playback (legacy mode)');
                        });
                    };
                    
                    // Timed fallback for legacy browsers
                    setTimeout(() => {
                        if (remoteVideo.paused && remoteVideo.readyState >= 2) {
                            console.log('Attempting fallback play after timeout (legacy)');
                            remoteVideo.play().catch((e) => {
                                console.error("Fallback play failed after timeout (legacy):", e);
                                addVideoSystemMessage('Remote video requires manual play (legacy mode)');
                            });
                        }
                    }, 1000);
                    
                    remoteVideo.play().then(() => {
                        console.log('Remote video playing successfully (legacy)');
                        showUserFeedback('Remote video connected! (legacy mode)', 'success');
                    }).catch(e => {
                        console.error('Error playing remote video (legacy):', e);
                        showUserFeedback('Failed to play remote video (legacy) - check browser permissions', 'error');
                        showErrorFeedback('Failed to play remote video');
                    });
                } else {
                    console.warn('No remote video element or stream available (legacy)');
                    showUserFeedback('No remote stream received (legacy)', 'warning');
                }
            };
        }

        // Enhanced ICE candidate handling with queueing
        peerConnection.onicecandidate = (event) => {
            console.log('ICE candidate event:', event.candidate ? 'candidate' : 'end-of-candidates');
            
            if (event.candidate) {
                if (socket?.readyState === WebSocket.OPEN) {
                    console.log('Sending ICE candidate:', event.candidate.type);
                    socket.send(JSON.stringify({
                        type: 'webrtc_ice_candidate',
                        candidate: event.candidate.toJSON()
                    }));
                }
            } else {
                console.log('ICE gathering complete');
            }
        };

        // Enhanced connection state handling with retry logic
        peerConnection.onconnectionstatechange = () => {
            console.log('Connection state changed to:', peerConnection.connectionState);

            switch (peerConnection.connectionState) {
                case 'connecting':
                    addVideoSystemMessage('Connecting to video call...');
                    break;
                case 'connected':
                    addVideoSystemMessage('Video call connected successfully!');
                    webrtcRetryAttempts = 0; // Reset retry counter on success
                    // Clear timeout on successful connection
                    if (peerConnectionTimeout) {
                        clearTimeout(peerConnectionTimeout);
                        peerConnectionTimeout = null;
                    }
                    break;
                case 'disconnected':
                    addVideoSystemMessage('Video call disconnected.');
                    showErrorFeedback('Video connection was lost');
                    break;
                case 'failed':
                    handleWebRTCConnectionFailure();
                    break;
                case 'closed':
                    addVideoSystemMessage('Video call ended.');
                    if (peerConnectionTimeout) {
                        clearTimeout(peerConnectionTimeout);
                        peerConnectionTimeout = null;
                    }
                    break;
            }
        };

        // Handle ICE connection state
        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', peerConnection.iceConnectionState);
            
            if (peerConnection.iceConnectionState === 'failed') {
                console.log('ICE connection failed, restarting ICE');
                peerConnection.restartIce();
            }
        };

        // Handle signaling state changes
        peerConnection.onsignalingstatechange = () => {
            console.log('Signaling state:', peerConnection.signalingState);
        };

        // Create offer if initiator
        if (isInitiator) {
            setTimeout(async () => {
                await createOffer();
            }, 100);
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
        
        if (!peerConnection || peerConnection.signalingState === 'closed') {
            throw new Error('Peer connection not available');
        }

        const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
            iceRestart: false
        });

        console.log('Offer created, setting local description');
        await peerConnection.setLocalDescription(offer);
        console.log('Local description set');

        if (socket?.readyState === WebSocket.OPEN) {
            console.log('Sending offer to remote peer');
            socket.send(JSON.stringify({
                type: 'webrtc_offer',
                offer: offer.toJSON ? offer.toJSON() : offer
            }));
        } else {
            throw new Error('WebSocket not available for sending offer');
        }
    } catch (error) {
        console.error('Error creating offer:', error);
        addVideoSystemMessage('Failed to create video offer. Please try again.');
    }
}

async function handleWebRTCOffer(data) {
    try {
        console.log('Handling WebRTC offer...');

        if (!peerConnection) {
            console.log('No peer connection, initializing...');
            await initializeWebRTC(false);
        }

        if (!data.offer) {
            console.error('No offer data received');
            addVideoSystemMessage('Invalid video offer received.');
            return;
        }

        // Check signaling state before setting remote description
        console.log('Current signaling state:', peerConnection.signalingState);
        
        // Only set remote description if we're in the correct state
        if (peerConnection.signalingState === 'stable') {
            console.log('Setting remote description from offer');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            console.log('Remote description set successfully');
            
            // Mark remote description as set and flush queued candidates
            isRemoteDescriptionSet = true;
            await flushQueuedCandidates();
        } else if (peerConnection.signalingState === 'have-remote-offer') {
            console.log('Already have remote offer, skipping setRemoteDescription');
            // Remote description already set, just flush candidates
            if (!isRemoteDescriptionSet) {
                isRemoteDescriptionSet = true;
                await flushQueuedCandidates();
            }
        } else {
            console.warn('Cannot set remote description in current signaling state:', peerConnection.signalingState);
            addVideoSystemMessage('Invalid connection state for video offer.');
            return;
        }

        // Only create answer if we don't already have one
        if (peerConnection.signalingState === 'have-remote-offer') {
            const answer = await peerConnection.createAnswer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            });

            console.log('Answer created, setting local description');
            await peerConnection.setLocalDescription(answer);
            console.log('Local description set');

            if (socket?.readyState === WebSocket.OPEN) {
                console.log('Sending answer to remote peer');
                socket.send(JSON.stringify({
                    type: 'webrtc_answer',
                    answer: answer.toJSON ? answer.toJSON() : answer
                }));
            } else {
                throw new Error('WebSocket not available for sending answer');
            }
        } else {
            console.log('Skipping answer creation, signaling state:', peerConnection.signalingState);
        }
    } catch (error) {
        console.error('Error handling offer:', error);
        addVideoSystemMessage('Failed to handle video offer. Connection may fail.');
    }
}

async function handleWebRTCAnswer(data) {
    try {
        console.log('Handling WebRTC answer...');

        if (!peerConnection) {
            console.error('No peer connection available for answer');
            addVideoSystemMessage('Video connection error: No peer connection.');
            return;
        }

        if (!data.answer) {
            console.error('No answer data received');
            addVideoSystemMessage('Invalid video answer received.');
            return;
        }

        // Check signaling state before setting remote description
        console.log('Current signaling state:', peerConnection.signalingState);
        
        // Only set remote description if we're in the correct state
        if (peerConnection.signalingState === 'have-local-offer') {
            console.log('Setting remote description from answer');
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
            console.log('Remote description set successfully');
            
            // Mark remote description as set and flush queued candidates
            isRemoteDescriptionSet = true;
            await flushQueuedCandidates();
        } else if (peerConnection.signalingState === 'stable') {
            console.log('Connection already stable, answer may be duplicate');
            // Connection is already stable, might be a duplicate answer
            if (!isRemoteDescriptionSet) {
                isRemoteDescriptionSet = true;
                await flushQueuedCandidates();
            }
        } else {
            console.warn('Cannot set remote description in current signaling state:', peerConnection.signalingState);
            addVideoSystemMessage('Invalid connection state for video answer.');
            return;
        }
    } catch (error) {
        console.error('Error handling answer:', error);
        addVideoSystemMessage('Failed to handle video answer. Connection may fail.');
    }
}

// Enhanced ICE candidate handling with proper queueing
async function handleWebRTCIceCandidate(data) {
    try {
        if (!peerConnection) {
            console.error('No peer connection available for ICE candidate');
            return;
        }

        if (!data.candidate) {
            console.log('Received end-of-candidates signal');
            return;
        }

        console.log('Handling ICE candidate:', {
            type: data.candidate.type || 'unknown',
            protocol: data.candidate.protocol || 'unknown',
            address: data.candidate.address || 'unknown',
            port: data.candidate.port || 'unknown',
            priority: data.candidate.priority || 'unknown'
        });
        
        // Check if we can add the candidate immediately
        const canAddCandidate = isRemoteDescriptionSet && 
                                peerConnection.remoteDescription && 
                                peerConnection.signalingState !== 'closed';
        
        if (canAddCandidate) {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
                console.log('ICE candidate added successfully:', data.candidate.type);
            } catch (candidateError) {
                console.error('Failed to add ICE candidate:', {
                    error: candidateError,
                    candidateType: data.candidate.type,
                    signalingState: peerConnection.signalingState,
                    iceConnectionState: peerConnection.iceConnectionState
                });
                
                // Don't queue failed candidates to avoid infinite loops
                if (candidateError.name !== 'OperationError') {
                    console.log('Queueing failed candidate for retry');
                    iceCandidateQueue.push(data.candidate);
                }
            }
        } else {
            // Queue the candidate for later
            console.log('Remote description not ready, queueing ICE candidate:', {
                isRemoteDescriptionSet,
                hasRemoteDescription: !!peerConnection.remoteDescription,
                signalingState: peerConnection.signalingState,
                queueLength: iceCandidateQueue.length
            });
            iceCandidateQueue.push(data.candidate);
        }
    } catch (error) {
        console.error('Error handling ICE candidate:', error);
    }
}

// Enhanced flush queued ICE candidates with better error handling
async function flushIceCandidateQueue() {
    if (!peerConnection || iceCandidateQueue.length === 0) {
        return;
    }

    console.log(`Flushing ${iceCandidateQueue.length} queued ICE candidates`);
    
    const candidatesToProcess = [...iceCandidateQueue]; // Create a copy
    iceCandidateQueue = []; // Clear the queue immediately
    
    for (const candidateData of candidatesToProcess) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidateData));
            console.log('Queued ICE candidate added successfully');
        } catch (error) {
            console.error('Error adding queued ICE candidate:', error);
            // Don't re-queue failed candidates to avoid infinite loops
        }
    }
}

// Reusable function specifically for flushing queued candidates (as requested)
async function flushQueuedCandidates() {
    if (!peerConnection || !isRemoteDescriptionSet || iceCandidateQueue.length === 0) {
        console.log('Cannot flush candidates:', {
            hasPeerConnection: !!peerConnection,
            isRemoteDescriptionSet,
            queueLength: iceCandidateQueue.length,
            signalingState: peerConnection?.signalingState
        });
        return;
    }

    console.log(`Flushing ${iceCandidateQueue.length} queued ICE candidates`);
    console.log('Connection state before flushing:', {
        signalingState: peerConnection.signalingState,
        iceConnectionState: peerConnection.iceConnectionState,
        connectionState: peerConnection.connectionState
    });
    
    const candidatesToProcess = [...iceCandidateQueue];
    iceCandidateQueue = [];
    
    let successCount = 0;
    let failCount = 0;
    const failedCandidates = [];
    
    for (const candidateData of candidatesToProcess) {
        try {
            // Additional validation before adding candidate
            if (peerConnection.signalingState === 'closed') {
                console.log('Peer connection closed, skipping remaining candidates');
                break;
            }
            
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidateData));
            console.log(`ICE candidate added successfully: ${candidateData.type}`);
            successCount++;
        } catch (error) {
            console.error('Failed to add queued ICE candidate:', {
                error: error.message,
                candidateType: candidateData.type,
                signalingState: peerConnection.signalingState,
                iceConnectionState: peerConnection.iceConnectionState
            });
            failCount++;
            
            // Track failed candidates for potential retry
            if (error.name !== 'OperationError' && error.name !== 'InvalidStateError') {
                failedCandidates.push(candidateData);
            }
        }
    }
    
    console.log(`ICE candidates flushed: ${successCount} successful, ${failCount} failed`);
    
    // Re-queue candidates that failed due to temporary issues
    if (failedCandidates.length > 0 && peerConnection.signalingState !== 'closed') {
        console.log(`Re-queueing ${failedCandidates.length} candidates for retry`);
        iceCandidateQueue.push(...failedCandidates);
    }
    
    if (failCount > successCount) {
        showUserFeedback(`Warning: ${failCount} ICE candidates failed to be added`, 'warning');
    }
}

// Handle WebRTC connection failure with retry logic
function handleWebRTCConnectionFailure() {
    console.log(`WebRTC connection failed. Retry attempt: ${webrtcRetryAttempts}/${MAX_WEBRTC_RETRIES}`);
    
    if (webrtcRetryAttempts < MAX_WEBRTC_RETRIES) {
        webrtcRetryAttempts++;
        addVideoSystemMessage(`Connection failed. Retrying... (${webrtcRetryAttempts}/${MAX_WEBRTC_RETRIES})`);
        showErrorFeedback(`Connection failed. Attempting retry ${webrtcRetryAttempts}/${MAX_WEBRTC_RETRIES}`);
        
        setTimeout(() => {
            if (peerConnection && peerConnection.connectionState === 'failed') {
                console.log('Attempting ICE restart...');
                peerConnection.restartIce();
            }
        }, 2000 * webrtcRetryAttempts); // Exponential backoff
    } else {
        addVideoSystemMessage('Video call failed after multiple attempts. Please try again.');
        showErrorFeedback('Video connection failed permanently. Please refresh and try again.');
        
        // Show retry button for user
        const retryBtn = document.createElement('button');
        retryBtn.textContent = 'Start New Video Chat';
        retryBtn.style.margin = '10px';
        retryBtn.style.padding = '10px 20px';
        retryBtn.style.backgroundColor = '#dc3545';
        retryBtn.style.color = 'white';
        retryBtn.style.border = 'none';
        retryBtn.style.borderRadius = '4px';
        retryBtn.style.cursor = 'pointer';
        retryBtn.style.fontWeight = 'bold';
        
        retryBtn.onclick = () => {
            webrtcRetryAttempts = 0; // Reset retry counter
            cleanupConnections();
            startVideoChat();
        };
        
        if (videoChatMessages) {
            const msgDiv = document.createElement('div');
            msgDiv.style.textAlign = 'center';
            msgDiv.appendChild(retryBtn);
            videoChatMessages.appendChild(msgDiv);
        }
    }
}

// Enhanced error feedback function for user-facing alerts
function showErrorFeedback(message) {
    // Console log for debugging
    console.error('Error feedback:', message);
    
    // Create a visual error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '20px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translateX(-50%)';
    errorDiv.style.backgroundColor = '#dc3545';
    errorDiv.style.color = 'white';
    errorDiv.style.padding = '12px 20px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    errorDiv.style.zIndex = '10000';
    errorDiv.style.maxWidth = '400px';
    errorDiv.style.textAlign = 'center';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.fontWeight = 'bold';
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 5000);
    
    // Also show browser alert for critical errors
    if (message.includes('permanently') || message.includes('refresh')) {
        setTimeout(() => {
            alert(message);
        }, 100);
    }
}

// Fix 4: Manual retry button when reconnection fails
function showManualRetryButton() {
    console.log('Showing manual retry button after failed reconnection attempts');
    
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Retry Connection Now';
    retryBtn.style.margin = '10px';
    retryBtn.style.padding = '12px 20px';
    retryBtn.style.backgroundColor = '#28a745';
    retryBtn.style.color = 'white';
    retryBtn.style.border = 'none';
    retryBtn.style.borderRadius = '6px';
    retryBtn.style.cursor = 'pointer';
    retryBtn.style.fontWeight = 'bold';
    retryBtn.style.fontSize = '14px';
    
    retryBtn.onclick = () => {
        console.log('Manual retry button clicked');
        // Reset reconnection attempts and try again
        reconnectAttempts = 0;
        
        const message = 'Retrying connection...';
        currentChatType === 'text' 
            ? addSystemMessage(message)
            : addVideoSystemMessage(message);
        
        // Remove the retry button
        if (retryBtn.parentNode) {
            retryBtn.parentNode.removeChild(retryBtn);
        }
        
        // Attempt reconnection
        connectWebSocket();
    };
    
    // Add button to appropriate chat container
    const targetContainer = currentChatType === 'text' ? chatMessages : videoChatMessages;
    if (targetContainer) {
        const btnContainer = document.createElement('div');
        btnContainer.style.textAlign = 'center';
        btnContainer.style.margin = '10px 0';
        btnContainer.appendChild(retryBtn);
        targetContainer.appendChild(btnContainer);
        targetContainer.scrollTop = targetContainer.scrollHeight;
    }
}

// Centralized Error State Manager
class ErrorStateManager {
    constructor() {
        this.activeOverlays = new Set();
        this.retryCallbacks = new Map();
        this.timeoutHandlers = new Map();
        this.isReconnecting = false;
    }

    // Show critical error overlay with full-page modal
    showCriticalError(config = {}) {
        const {
            title = 'Connection Error',
            message = 'Something went wrong',
            type = 'error',
            showRetry = true,
            showGoBack = true,
            onRetry = null,
            onGoBack = null,
            persistent = false
        } = config;

        // Prevent duplicate overlays
        if (this.activeOverlays.has(type)) return;
        this.activeOverlays.add(type);

        const overlay = document.createElement('div');
        overlay.className = 'error-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
            animation: fadeIn 0.3s ease-out;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.4s ease-out;
            position: relative;
        `;

        const iconMap = {
            error: '❌',
            timeout: '⏰',
            permission: '🚫',
            connection: '🌐',
            retry: '🔄'
        };

        modal.innerHTML = `
            <div style="font-size: 60px; margin-bottom: 20px;">${iconMap[type] || iconMap.error}</div>
            <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">${title}</h2>
            <p style="color: #666; margin-bottom: 30px; font-size: 16px; line-height: 1.6;">${message}</p>
            <div class="error-buttons" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                ${showRetry ? `<button class="retry-btn" style="background: #28a745; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">🔄 Retry</button>` : ''}
                ${showGoBack ? `<button class="go-back-btn" style="background: #6c757d; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">← Go Back</button>` : ''}
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Button event listeners
        const retryBtn = modal.querySelector('.retry-btn');
        const goBackBtn = modal.querySelector('.go-back-btn');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.removeOverlay(overlay, type);
                if (onRetry) onRetry();
            });
        }

        if (goBackBtn) {
            goBackBtn.addEventListener('click', () => {
                this.removeOverlay(overlay, type);
                if (onGoBack) onGoBack();
                else showHomePage(); // Default action
            });
        }

        // Auto-close for non-persistent overlays
        if (!persistent) {
            setTimeout(() => {
                if (overlay.parentNode) {
                    this.removeOverlay(overlay, type);
                }
            }, 15000);
        }

        return overlay;
    }

    // Show reconnecting overlay with spinner
    showReconnectingOverlay() {
        if (this.isReconnecting) return;
        this.isReconnecting = true;

        const overlay = document.createElement('div');
        overlay.className = 'reconnecting-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        `;

        overlay.innerHTML = `
            <div style="background: white; border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
                <div class="spinner" style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #4a90e2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <h3 style="color: #333; margin-bottom: 10px;">Reconnecting...</h3>
                <p style="color: #666; margin: 0;">Please wait while we restore your connection</p>
            </div>
        `;

        document.body.appendChild(overlay);
        return overlay;
    }

    // Remove overlay
    removeOverlay(overlay, type) {
        if (overlay && overlay.parentNode) {
            overlay.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
        
        if (type) {
            this.activeOverlays.delete(type);
        }
        
        if (type === 'reconnecting') {
            this.isReconnecting = false;
        }
    }

    // Handle timeout alerts
    setupTimeoutAlert(timeoutType, duration, onTimeout) {
        const timeoutId = setTimeout(() => {
            console.log(`${timeoutType} timeout triggered after ${duration}ms`);
            
            if (onTimeout) {
                onTimeout();
            } else {
                // Default timeout handling
                this.showCriticalError({
                    title: 'Connection Timeout',
                    message: `Connection timed out after ${duration / 1000} seconds. Please check your internet connection and try again.`,
                    type: 'timeout',
                    onRetry: () => {
                        if (timeoutType === 'websocket') {
                            connectWebSocket();
                        } else if (timeoutType === 'webrtc') {
                            if (currentChatType === 'video') {
                                startVideoChat();
                            }
                        }
                    }
                });
            }
        }, duration);

        this.timeoutHandlers.set(timeoutType, timeoutId);
        return timeoutId;
    }

    // Clear timeout
    clearTimeoutAlert(timeoutType) {
        const timeoutId = this.timeoutHandlers.get(timeoutType);
        if (timeoutId) {
            clearTimeout(timeoutId);
            this.timeoutHandlers.delete(timeoutType);
        }
    }

    // Clear all timeouts and overlays
    cleanup() {
        // Clear all timeouts
        this.timeoutHandlers.forEach(timeoutId => clearTimeout(timeoutId));
        this.timeoutHandlers.clear();

        // Remove all overlays
        document.querySelectorAll('.error-overlay, .reconnecting-overlay').forEach(overlay => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        });

        this.activeOverlays.clear();
        this.isReconnecting = false;
    }
}

// Global error state manager instance
const errorStateManager = new ErrorStateManager();

// Enhanced user feedback system
function showUserFeedback(message, type = 'error', options = {}) {
    console.log(`User feedback (${type}):`, message);
    
    const {
        fullModal = false,
        showSpinner = false,
        persistent = false,
        onRetry = null,
        onGoBack = null
    } = options;

    // For critical errors or if fullModal is requested, show overlay
    if (fullModal || type === 'critical' || type === 'timeout' || type === 'permission') {
        return errorStateManager.showCriticalError({
            title: type === 'permission' ? 'Permission Required' : 'Error',
            message,
            type,
            persistent,
            onRetry,
            onGoBack
        });
    }

    // For reconnecting state with spinner
    if (type === 'reconnecting' || showSpinner) {
        return errorStateManager.showReconnectingOverlay();
    }
    
    // Regular toast notification
    const colors = {
        error: { bg: '#dc3545', border: '#c82333' },
        warning: { bg: '#ffc107', border: '#e0a800', text: '#212529' },
        info: { bg: '#17a2b8', border: '#138496' },
        success: { bg: '#28a745', border: '#1e7e34' },
        reconnecting: { bg: '#6f42c1', border: '#5a3a7c' }
    };
    
    const colorScheme = colors[type] || colors.error;
    
    const feedbackDiv = document.createElement('div');
    feedbackDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colorScheme.bg};
        color: ${colorScheme.text || 'white'};
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid ${colorScheme.border};
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 450px;
        text-align: center;
        font-size: 15px;
        font-weight: bold;
        animation: slideInFromTop 0.3s ease-out;
    `;
    
    const icons = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅',
        reconnecting: '🔄'
    };
    
    feedbackDiv.innerHTML = `${icons[type] || icons.error} ${message}`;
    
    document.body.appendChild(feedbackDiv);
    
    // Auto-remove
    setTimeout(() => {
        if (feedbackDiv.parentNode) {
            feedbackDiv.style.animation = 'slideOutToTop 0.3s ease-in';
            setTimeout(() => {
                if (feedbackDiv.parentNode) {
                    feedbackDiv.parentNode.removeChild(feedbackDiv);
                }
            }, 300);
        }
    }, persistent ? 10000 : 6000);
    
    return feedbackDiv;
}

// Timeout alert utility
function timeoutAlert(timeoutType, duration, customMessage = null, onRetry = null) {
    const message = customMessage || `Operation timed out after ${duration / 1000} seconds. Please try again.`;
    
    return errorStateManager.setupTimeoutAlert(timeoutType, duration, () => {
        showUserFeedback(message, 'timeout', {
            fullModal: true,
            persistent: true,
            onRetry: onRetry || (() => {
                console.log(`Retrying ${timeoutType}...`);
                if (timeoutType === 'websocket') {
                    connectWebSocket();
                } else if (timeoutType === 'webrtc') {
                    if (currentChatType === 'video') {
                        startVideoChat();
                    }
                }
            }),
            onGoBack: () => {
                cleanupConnections();
                showHomePage();
            }
        });
    });
}

// Add CSS animations for feedback popups
if (!document.getElementById('feedbackAnimations')) {
    const style = document.createElement('style');
    style.id = 'feedbackAnimations';
    style.textContent = `
        @keyframes slideInFromTop {
            0% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
            100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideOutToTop {
            0% { transform: translateX(-50%) translateY(0); opacity: 1; }
            100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
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
                <p>${sanitizeInput(data.reason)}</p>
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
    // Fix 1: Set shouldReconnect to false when manually disconnecting
    shouldReconnect = false;
    
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
        startNowBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Start Now button clicked');
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

    // Message input handling with XSS protection
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

    // Video chat input with XSS protection
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
    console.log('Stranger connected, chat type:', currentChatType);
    isConnected = true;
    setConnectButtonDisabled(false);
    setAttachButtonEnabled(true);

    // Remove connecting animation
    const strangerVideo = document.querySelector('.stranger-video');
    if (strangerVideo) {
        strangerVideo.classList.remove('connecting');
    }

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
        addVideoSystemMessage("Stranger connected! Initializing video connection...");
        
        // Initialize WebRTC as initiator
        setTimeout(async () => {
            try {
                await initializeWebRTC(true);
                console.log('WebRTC initialized successfully as initiator');
            } catch (error) {
                console.error('Failed to initialize WebRTC:', error);
                addVideoSystemMessage('Failed to establish video connection. Please try again.');
            }
        }, 500);
    }
}

function handleReceivedMessage(data) {
    if (!data.message) return;

    // Sanitize received message to prevent XSS
    const sanitizedMessage = sanitizeInput(data.message);
    
    currentChatType === 'text' 
        ? addStrangerMessage(sanitizedMessage)
        : addVideoStrangerMessage(sanitizedMessage);
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

    // Remove connecting animation
    const strangerVideo = document.querySelector('.stranger-video');
    if (strangerVideo) {
        strangerVideo.classList.remove('connecting');
    }

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
    
    // Clear timeouts
    if (peerConnectionTimeout) {
        clearTimeout(peerConnectionTimeout);
        peerConnectionTimeout = null;
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

    const fileName = sanitizeInput(file.name);
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

    const fileName = sanitizeInput(file.name);
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
