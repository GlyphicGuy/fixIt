import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getConversation, joinConversation, leaveConversation, sendMessage, setTyping, onMessageReceived, onUserTyping, onMessageRead, onUserOnline, onUserOffline, removeListener, markAsRead } from '../services/messageService';
import { getListingById } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import socketService from '../services/socketService';

const ConversationPage = () => {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('with');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [listing, setListing] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [readBy, setReadBy] = useState(new Map()); // userId -> timestamp
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const otherUser = conversation?.participants?.find(p => p._id !== user?._id);

  useEffect(() => {
    if (!user || !otherUserId) {
      navigate('/');
      return;
    }
    loadData();
  }, [listingId, otherUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!conversation?._id) return;

    const handleMessageReceived = (data) => {
      setMessages(prev => [...prev, {
        id: data.id,
        sender: data.sender,
        content: data.content,
        createdAt: data.createdAt,
        read: data.read
      }]);
      scrollToBottom();
    };

    const handleUserTyping = (data) => {
      if (data.userId === otherUserId) {
        setTypingUsers(prev => {
          const updated = new Set(prev);
          if (data.isTyping) {
            updated.add(data.userId);
          } else {
            updated.delete(data.userId);
          }
          return updated;
        });
      }
    };

    const handleUserOnline = (data) => {
      if (data.userId === otherUserId) {
        setOtherUserOnline(true);
      }
    };

    const handleUserOffline = (data) => {
      if (data.userId === otherUserId) {
        setOtherUserOnline(false);
      }
    };

    const handleMessageRead = (data) => {
      if (data.userId === otherUserId) {
        setReadBy(prev => new Map(prev).set(otherUserId, data.readAt));
        // Update messages to show read status
        setMessages(prev => prev.map(msg => 
          data.messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        ));
      }
    };

    onMessageReceived(handleMessageReceived);
    onUserTyping(handleUserTyping);
    onUserOnline(handleUserOnline);
    onUserOffline(handleUserOffline);
    onMessageRead(handleMessageRead);

    return () => {
      removeListener('message:received', handleMessageReceived);
      removeListener('user:typing', handleUserTyping);
      removeListener('user:online', handleUserOnline);
      removeListener('user:offline', handleUserOffline);
      removeListener('message:read', handleMessageRead);
    };
  }, [conversation?._id, otherUserId]);

  // Auto-mark messages as read
  useEffect(() => {
    if (messages.length === 0 || !conversation?._id) return;

    const unreadMessages = messages.filter(
      msg => msg.sender._id !== user?._id && !msg.read
    );

    if (unreadMessages.length > 0) {
      const timer = setTimeout(() => {
        markAsRead(conversation._id, unreadMessages.map(m => m.id));
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [messages, conversation?._id, user?._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [convData, listingData] = await Promise.all([
        getConversation(listingId, otherUserId),
        getListingById(listingId)
      ]);
      
      setConversation(convData.conversation);
      setMessages(convData.messages || []);
      setListing(listingData);

      // Join conversation via WebSocket
      setTimeout(() => {
        if (socketService.isConnected()) {
          joinConversation(convData.conversation._id, listingId, otherUserId);
        }
      }, 100);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load conversation', 'error');
      navigate(`/listing/${listingId}`);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      sendMessage(conversation._id, newMessage);
      setNewMessage('');
      setTypingUsers(prev => {
        const updated = new Set(prev);
        updated.delete(otherUserId);
        return updated;
      });
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setNewMessage(text);

    // Emit typing indicator
    if (text.length > 0) {
      setTyping(conversation._id, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(conversation._id, false);
      }, 3000);
    } else {
      setTyping(conversation._id, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (conversation?._id) {
        leaveConversation(conversation._id);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation?._id]);

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/listing/${listingId}`)}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {otherUser?.photoUrl && (
                    <img
                      src={otherUser.photoUrl}
                      alt={otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  {otherUserOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{otherUser?.name}</h1>
                  <p className="text-xs text-gray-600">
                    {typingUsers.has(otherUserId) ? (
                      <span className="text-blue-600 font-medium">typing...</span>
                    ) : otherUserOnline ? (
                      <span className="text-green-600">online</span>
                    ) : (
                      <span>offline</span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600 truncate max-w-md">
                    Re: {listing?.title}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/listing/${listingId}`)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Listing
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {messages?.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation</h3>
                <p className="text-gray-600">Send a message to discuss the listing details.</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.sender._id === user?._id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-lg ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <img
                      src={msg.sender.photoUrl}
                      alt={msg.sender.name}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 px-2 flex items-center gap-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span>{formatTime(msg.createdAt)}</span>
                        {isOwnMessage && msg.read && (
                          <span className="text-blue-600">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          
          {/* Typing Indicator */}
          {typingUsers.has(otherUserId) && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <img
                  src={otherUser?.photoUrl}
                  alt={otherUser?.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t shadow-lg sticky bottom-0">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                rows="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                sending || !newMessage.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {sending ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
