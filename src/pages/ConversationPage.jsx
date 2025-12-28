import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getConversation, sendMessage, markAsRead } from '../services/messageService';
import { getListingById } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ConversationPage = () => {
  const { listingId } = useParams();
  const [searchParams] = useSearchParams();
  const otherUserId = searchParams.get('with');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversation, setConversation] = useState(null);
  const [listing, setListing] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

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
  }, [conversation?.messages]);

  useEffect(() => {
    // Mark messages as read when conversation loads
    if (conversation?._id) {
      markAsRead(conversation._id).catch(err => console.error('Failed to mark as read:', err));
    }
  }, [conversation?._id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [convData, listingData] = await Promise.all([
        getConversation(listingId, otherUserId),
        getListingById(listingId)
      ]);
      setConversation(convData);
      setListing(listingData);
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const updatedConversation = await sendMessage(conversation._id, newMessage);
      setConversation(updatedConversation);
      setNewMessage('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

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
                {otherUser?.photoUrl && (
                  <img
                    src={otherUser.photoUrl}
                    alt={otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{otherUser?.name}</h1>
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
          {conversation?.messages?.length === 0 ? (
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
            conversation.messages.map((msg, index) => {
              const isOwnMessage = msg.sender._id === user?._id;
              return (
                <div
                  key={index}
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
                      <p className={`text-xs text-gray-500 mt-1 px-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
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
                onChange={(e) => setNewMessage(e.target.value)}
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
