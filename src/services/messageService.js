import api from './api';
import socketService from './socketService';

// Get or create a conversation for a listing via WebSocket
export const getConversation = (listingId, otherUserId) => {
  return new Promise((resolve, reject) => {
    if (!socketService.socket) {
      return reject({ response: { data: { message: 'WebSocket not initialized' } } });
    }

    const handleLoaded = (data) => {
      socketService.socket.off('conversation:loaded', handleLoaded);
      socketService.socket.off('error', handleError);
      resolve(data);
    };

    const handleError = (error) => {
      socketService.socket.off('conversation:loaded', handleLoaded);
      socketService.socket.off('error', handleError);
      reject({ response: { data: { message: error.message || 'Socket error' } } });
    };

    socketService.socket.on('conversation:loaded', handleLoaded);
    socketService.socket.on('error', handleError);

    socketService.socket.emit('conversation:join', {
      conversationId: null,
      listingId,
      otherUserId
    });
  });
};

// Send a message via WebSocket
export const sendMessage = (conversationId, content) => {
  socketService.sendMessage(conversationId, content);
};

// Get all conversations for the logged-in user via WebSocket
export const getUserConversations = () => {
  return new Promise((resolve, reject) => {
    if (!socketService.socket) {
      return reject({ response: { data: { message: 'WebSocket not initialized' } } });
    }

    const handleLoaded = (data) => {
      socketService.socket.off('conversations:loaded', handleLoaded);
      socketService.socket.off('error', handleError);
      resolve(data);
    };

    const handleError = (error) => {
      socketService.socket.off('conversations:loaded', handleLoaded);
      socketService.socket.off('error', handleError);
      reject({ response: { data: { message: error.message || 'Socket error' } } });
    };

    socketService.socket.on('conversations:loaded', handleLoaded);
    socketService.socket.on('error', handleError);

    socketService.socket.emit('conversations:get');
  });
};

// Mark messages as read via WebSocket
export const markAsRead = (conversationId, messageIds) => {
  socketService.markMessagesAsRead(conversationId, messageIds);
};

// Join a conversation (WebSocket)
export const joinConversation = (conversationId, listingId, otherUserId) => {
  socketService.joinConversation(conversationId, listingId, otherUserId);
};

// Leave a conversation (WebSocket)
export const leaveConversation = (conversationId) => {
  socketService.leaveConversation(conversationId);
};

// Set user typing status (WebSocket)
export const setTyping = (conversationId, isTyping) => {
  socketService.setTyping(conversationId, isTyping);
};

// Listen to conversation loaded event
export const onConversationLoaded = (callback) => {
  socketService.on('conversation:loaded', callback);
};

// Listen to message received event
export const onMessageReceived = (callback) => {
  socketService.on('message:received', callback);
};

// Listen to typing indicator event
export const onUserTyping = (callback) => {
  socketService.on('user:typing', callback);
};

// Listen to message read event
export const onMessageRead = (callback) => {
  socketService.on('message:read', callback);
};

// Listen to user online event
export const onUserOnline = (callback) => {
  socketService.on('user:online', callback);
};

// Listen to user offline event
export const onUserOffline = (callback) => {
  socketService.on('user:offline', callback);
};

// Listen to socket errors
export const onSocketError = (callback) => {
  socketService.on('socket:error', callback);
};

// Remove listener
export const removeListener = (event, callback) => {
  socketService.off(event, callback);
};
