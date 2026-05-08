import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserConversations, onMessageReceived } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadConversations();
  }, [user]);

  // Listen for new messages to update conversations list
  useEffect(() => {
    const handleNewMessage = () => {
      loadConversations();
    };

    onMessageReceived(handleNewMessage);

    return () => {
      // Cleanup listener if needed
    };
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await getUserConversations();
      setConversations(data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getOtherUser = (conv) => {
    return conv.participants.find(p => p._id !== user?._id);
  };

  const getLastMessage = (conv) => {
    if (!conv.lastMessage) return 'No messages yet';
    const lastMsg = conv.lastMessage;
    const preview = lastMsg.content.length > 50 
      ? lastMsg.content.substring(0, 50) + '...' 
      : lastMsg.content;
    const isOwn = lastMsg.sender._id === user?._id;
    return `${isOwn ? 'You: ' : ''}${preview}`;
  };

  // Count unread messages - requires fetching full conversation data
  // For now, we'll show a simplified version
  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Your conversations about listings</p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h2>
            <p className="text-gray-600 mb-6">Start a conversation by messaging someone from a listing</p>
            <button
              onClick={() => navigate('/browse')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {conversations.map((conv) => {
              const otherUser = getOtherUser(conv);
              
              return (
                <button
                  key={conv._id}
                  onClick={() => navigate(`/conversation/${conv.listing._id}?with=${otherUser._id}`)}
                  className="w-full flex items-center space-x-4 p-4 hover:bg-gray-50 transition border-b border-gray-200 last:border-b-0"
                >
                  {/* User Photo */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={otherUser?.photoUrl}
                      alt={otherUser?.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUser?.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="text-sm text-blue-600 truncate mb-1">
                      {conv.listing?.title}
                    </p>
                    <p className="text-sm truncate text-gray-600">
                      {getLastMessage(conv)}
                    </p>
                  </div>

                  {/* Listing Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={conv.listing?.photoUrl}
                      alt={conv.listing?.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
