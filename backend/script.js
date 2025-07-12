
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
const MAX_RECONNECT_ATTEMPTS = 5;

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
        videoSection.classList.add('mobile-video-section');
        chatSection.classList.add('mobile-chat-section');
    } else {
        videoContainer.classList.add('desktop-layout');
        videoSection.classList.add('desktop-video-section');
        chatSection.classList.add('desktop-chat-section');
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
    // Reset layout classes
    videoContainer?.classList.remove('mobile-layout', 'desktop-layout');
    document.querySelector('.video-section')?.classList.remove('mobile-video-section', 'desktop-video-section');
    document.querySelector('.chat-section')?.classList.remove('mobile-chat-section', 'desktop-chat-section');
    
    // Clean up WebRTC
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (dataChannel) {
        dataChannel.close();
        dataChannel = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    disconnect();
}

function startTextChat() {
    currentChatType = 'text';
    homePage.style.display = 'none';
    homeScreen.style.display = 'none';
    chatContainer.style.display = 'flex';
    videoContainer.style.display = 'none';
    messageInput.focus();
    chatMessages.innerHTML = '';
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
    videoChatMessages.innerHTML = '';
    addVideoSystemMessage("Initializing video chat...");
    
    try {
        await requestMediaPermissions();
        connectWebSocket();
    } catch (error) {
        console.error('Video chat initialization failed:', error);
        addVideoSystemMessage("Failed to start video chat. Please try again.");
        setTimeout(() => {
            showChatSelection();
        }, 2000);
    }
}

// WebSocket Functions
function connectWebSocket() {
    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) return;
    
    socket = new WebSocket(WS_SERVER_URL);
    
    socket.onopen = () => {
        console.log('Connected to server');
        reconnectAttempts = 0;
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'join',
                chatType: currentChatType,
                interests: interestsInput ? interestsInput.value.split(',').map(i => i.trim()).filter(i => i) : []
            }));
        }
    };
    
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
    };
    
    socket.onclose = () => {
        console.log('Disconnected from server');
        isConnected = false;
        updateConnectionStatus(false);
        
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
                if (currentChatType) connectWebSocket();
            }, 2000 * reconnectAttempts);
        }
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

function handleWebSocketMessage(data) {
    switch (data.type) {
        case 'stranger_connected':
            handleStrangerConnected(data);
            break;
        case 'waiting':
            setConnectButtonDisabled(false);
            currentChatType === 'text' 
                ? addSystemMessage(data.message || "Looking for someone...")
                : addVideoSystemMessage(data.message || "Looking for someone...");
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
        default:
            console.warn('Unknown message type:', data.type);
    }
}

// Message Handling
function sendMessage() {
    const message = messageInput.value.trim();
    if (!message || !isConnected) return;

    addUserMessage(message);

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'message',
            message: message
        }));
    }

    messageInput.value = '';
    isTyping = false;
    sendTypingStatus(false);
}

function sendVideoMessage() {
    const message = videoMessageInput.value.trim();
    if (!message || !isConnected) return;
    
    addVideoUserMessage(message);
    
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            type: 'message',
            message: message
        }));
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
    const messageEl = addMessage(chatMessages, message, 'system-message');
    return messageEl;
}

function addVideoUserMessage(message) {
    addMessage(videoChatMessages, message, 'user-message');
}

function addVideoStrangerMessage(message) {
    addMessage(videoChatMessages, message, 'stranger-message');
}

function addVideoSystemMessage(message) {
    addMessage(videoChatMessages, message, 'system-message');
}

function addMessage(container, message, className) {
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
        
        // Add long press/click event for download
        let pressTimer;
        img.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        });
        
        img.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });
        
        img.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
        
        // Touch events for mobile
        img.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        });
        
        img.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
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
        
        // Add long press/click event for download
        let pressTimer;
        video.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        });
        
        video.addEventListener('mouseup', () => {
            clearTimeout(pressTimer);
        });
        
        video.addEventListener('mouseleave', () => {
            clearTimeout(pressTimer);
        });
        
        // Touch events for mobile
        video.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                showDownloadOption(fileURL, fileName);
            }, 500);
        });
        
        video.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
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
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// WebRTC Functions
async function requestMediaPermissions() {
    try {
        let constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };

        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        localVideo.srcObject = localStream;
        addVideoSystemMessage("Camera ready. Looking for someone to chat with...");
        return true;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        addVideoSystemMessage("Camera access denied or not found. Please check permissions & try again.");
        return false;
    }
}
 
async function initializeWebRTC(isInitiator) {
    try {
        peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        
        if (localStream) {
            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        }
        
        peerConnection.ontrack = (event) => {
            remoteVideo.srcObject = event.streams[0];
        };
        
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'webrtc_ice_candidate',
                    candidate: event.candidate
                }));
            }
        };
        
        if (isInitiator) {
            await createOffer();
        }
        return peerConnection;
    } catch (error) {
        console.error('Error initializing WebRTC:', error);
        throw error;
    }
}

async function createOffer() {
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'webrtc_offer',
                offer: offer
            }));
        }
    } catch (error) {
        console.error('Error creating offer:', error);
    }
}

async function handleWebRTCOffer(data) {
    if (!peerConnection) {
        await initializeWebRTC(false);
    }
    
    try {
        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'webrtc_answer',
                answer: answer
            }));
        }
    } catch (error) {
        console.error('Error handling offer:', error);
    }
}

async function handleWebRTCAnswer(data) {
    try {
        await peerConnection.setRemoteDescription(data.answer);
    } catch (error) {
        console.error('Error handling answer:', error);
    }
}

async function handleWebRTCIceCandidate(data) {
    try {
        await peerConnection.addIceCandidate(data.candidate);
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
    if (userCountText) {
        userCountText.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
    }
    if (videoUserCountText) {
        videoUserCountText.textContent = `${count} user${count !== 1 ? 's' : ''} online`;
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
        socket.send(JSON.stringify({
            type: 'typing',
            isTyping: typing
        }));
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
                if (socket?.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({
                        type: 'typing',
                        isTyping: false
                    }));
                }
            }
        });

        // Typing detection
        messageInput.addEventListener('input', () => {
            if (isConnected && socket?.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: 'typing',
                    isTyping: true
                }));

                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    if (socket?.readyState === WebSocket.OPEN) {
                        socket.send(JSON.stringify({
                            type: 'typing',
                            isTyping: false
                        }));
                    }
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
                chatMessages.innerHTML = '';
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
                videoChatMessages.innerHTML = '';
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
        if (attachMenu && !attachBtn.contains(e.target) && !attachMenu.contains(e.target)) {
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

        chatMessages.innerHTML = '';
        addSystemMessage("Stranger connected! Start chatting now.");
    } else if (currentChatType === 'video') {
        const label = videoConnectBtn?.querySelector('span');
        if (label) {
            label.textContent = "Skip";
        }

        videoChatMessages.innerHTML = '';
        addVideoSystemMessage("Stranger connected! Video chat started.");
        initializeWebRTC(true);
    }
}

function handleReceivedMessage(data) {
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

    if (remoteVideo && remoteVideo.srcObject) remoteVideo.srcObject = null;
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
    if (peerConnection) peerConnection.close();
    
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
    if (file) {
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size exceeds 500MB limit. Please select a smaller file.');
            event.target.value = '';
            return;
        }
        
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        // Create a file URL for display
        const fileURL = URL.createObjectURL(file);
        
        // Add photo message with actual image display
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
    }
}

function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size exceeds 500MB limit. Please select a smaller file.');
            event.target.value = '';
            return;
        }
        
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        // Create a file URL for display
        const fileURL = URL.createObjectURL(file);
        
        // Add video message with actual video display
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
        alert('Unable to get your location. Please check your browser settings.');
    });
}
