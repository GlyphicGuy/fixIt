import api from './api';

// Get or create a conversation for a listing
export const getConversation = async (listingId, otherUserId) => {
  const response = await api.get(`/messages/conversation/${listingId}/${otherUserId}`);
  return response.data;
};

// Send a message in a conversation
export const sendMessage = async (conversationId, content) => {
  const response = await api.post(`/messages/${conversationId}`, { content });
  return response.data;
};

// Get all conversations for the logged-in user
export const getUserConversations = async () => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

// Mark messages as read
export const markAsRead = async (conversationId) => {
  const response = await api.put(`/messages/${conversationId}/read`);
  return response.data;
};
