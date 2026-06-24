import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) return;

    // Extract base URL from VITE_API_URL (remove /api if present)
    let serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    serverUrl = serverUrl.replace(/\/api\/?$/, ''); // Remove trailing /api

    this.socket = io(serverUrl, {
      auth: {
        token
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      this.emit('socket:connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      this.emit('socket:disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.emit('socket:error', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket:error', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected() {
    return this.socket?.connected;
  }

  // Join a conversation
  joinConversation(conversationId, listingId, otherUserId) {
    this.socket.emit('conversation:join', {
      conversationId,
      listingId,
      otherUserId
    });
  }

  // Leave a conversation
  leaveConversation(conversationId) {
    this.socket.emit('conversation:leave', { conversationId });
  }

  // Send a message
  sendMessage(conversationId, content) {
    this.socket.emit('message:send', {
      conversationId,
      content
    });
  }

  // Typing indicator
  setTyping(conversationId, isTyping) {
    this.socket.emit('user:typing', {
      conversationId,
      isTyping
    });
  }

  // Mark messages as read
  markMessagesAsRead(conversationId, messageIds) {
    this.socket.emit('message:markAsRead', {
      conversationId,
      messageIds
    });
  }

  // Listen to socket events
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove listener
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit local events for internal communication
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }
}

export default new SocketService();
