import api from './api';
import socketService from './socketService';

// Get or create a conversation for a listing
export const getConversation = async (listingId, otherUserId) => {
  const response = await api.get(`/messages/conversation/${listingId}/${otherUserId}`);
  return response.data;
};

// Send a message via WebSocket
export const sendMessage = (conversationId, content) => {
  socketService.sendMessage(conversationId, content);
};

// Get all conversations for the logged-in user
export const getUserConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
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
