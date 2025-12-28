# Messaging System Implementation

## Overview
A private, in-platform messaging system has been implemented to replace email-based communication. Users can now have threaded conversations directly on the Fix-It Hub platform.

## Features Implemented

### 1. **Backend Components**

#### Message Model (`server/models/Message.js`)
- Stores conversations between users about specific listings
- Each conversation contains:
  - Listing reference
  - Array of participants (poster and fixer)
  - Array of messages with sender, content, timestamp, and read status
  - Timestamps for conversation and last message

#### Message Controller (`server/controllers/messageController.js`)
- `getConversation`: Get or create a conversation between two users for a listing
- `sendMessage`: Send a message in a conversation
- `getUserConversations`: Get all conversations for the logged-in user
- `markAsRead`: Mark messages as read

#### Message Routes (`server/routes/messageRoutes.js`)
- `GET /api/messages/conversations` - Get all user conversations
- `GET /api/messages/conversation/:listingId/:otherUserId` - Get or create a specific conversation
- `POST /api/messages/:conversationId` - Send a message
- `PUT /api/messages/:conversationId/read` - Mark messages as read

### 2. **Frontend Components**

#### Message Service (`src/services/messageService.js`)
- API functions for messaging operations
- Interfaces with the backend message endpoints

#### Conversation Page (`src/pages/ConversationPage.jsx`)
- Real-time chat interface for one-on-one conversations
- Features:
  - Message bubbles with sender photos
  - Time stamps (smart formatting: "Just now", "5m ago", "Yesterday", etc.)
  - Listing context header showing what the conversation is about
  - Auto-scroll to latest message
  - Auto-mark messages as read when viewing
  - Press Enter to send, Shift+Enter for new line
  - Back button to return to listing

#### Messages Page (`src/pages/MessagesPage.jsx`)
- Inbox view showing all conversations
- Features:
  - List of all conversations sorted by most recent
  - Shows last message preview
  - Unread message count badges
  - Displays conversation partner's photo
  - Shows listing thumbnail and title
  - Click to open conversation

### 3. **Integration Points**

#### ListingDetailPage Updates
Replaced email `mailto:` links with buttons that navigate to conversation:
- **"Message Poster" button** - For fixers to contact the poster
- **"Message" button** - In interested fixers list (for poster to contact fixers)
- **"Message Fixer/Poster" button** - In accepted fixer card (for both parties)

#### Navbar Updates
- Added "Messages" link in navigation (visible only when logged in)
- Provides easy access to the messages inbox

#### App Routes
- `/messages` - Messages inbox page
- `/conversation/:listingId?with=:userId` - Individual conversation page

## Security & Privacy

### Authorization Checks
1. Only participants in a conversation can view it
2. Users must be either:
   - The listing poster, OR
   - An interested fixer who has expressed interest, OR
   - The accepted fixer
3. Messages are only visible to the two participants

### Data Privacy
- Conversations are private between poster and fixer only
- Other interested fixers cannot see conversations
- No global message visibility

## User Flow Examples

### Scenario 1: Fixer Messages Poster
1. Fixer views a listing
2. Clicks "Message Poster" button
3. Opens conversation page with poster
4. Sends message about the repair
5. Poster receives message and responds

### Scenario 2: Poster Messages Interested Fixer
1. Poster views their listing with interested fixers
2. Sees fixer's pitch/message
3. Clicks "Message" button next to that fixer
4. Opens conversation page
5. Discusses details before accepting

### Scenario 3: Accepted Fixer Communication
1. Poster accepts a fixer
2. Both poster and accepted fixer see "Message" button in accepted fixer card
3. Either party can initiate conversation
4. They coordinate repair details

### Scenario 4: Viewing All Messages
1. User clicks "Messages" in navbar
2. Sees all active conversations
3. Unread conversations show badge count
4. Clicks any conversation to continue chatting

## Technical Details

### Message Storage
- Messages stored in MongoDB using the Message model
- Indexed by listing ID and participants for fast queries
- Sorted by `lastMessageAt` for inbox ordering

### Real-time Updates
Currently messages load on page view. Future enhancement: WebSocket support for real-time updates.

### Read Status
- Messages marked as read when conversation is viewed
- Unread count displayed in messages inbox
- Visual indicators for unread conversations

### UI/UX Features
- Clean, modern chat interface
- Message bubbles colored differently for own vs. other messages
- Timestamps with smart formatting
- Auto-scroll to bottom on new messages
- Textarea with keyboard shortcuts
- Loading states and error handling
- Empty states with helpful messages

## Files Created/Modified

### Created:
- `server/models/Message.js`
- `server/controllers/messageController.js`
- `server/routes/messageRoutes.js`
- `src/services/messageService.js`
- `src/pages/ConversationPage.jsx`
- `src/pages/MessagesPage.jsx`

### Modified:
- `server/server.js` - Added message routes
- `src/App.jsx` - Added conversation and messages routes
- `src/pages/ListingDetailPage.jsx` - Replaced mailto links with message buttons
- `src/components/Navbar.jsx` - Added Messages link

## Testing Checklist

- [ ] Create a listing as User A
- [ ] Express interest as User B (sends a message)
- [ ] User A views listing and sees User B's message
- [ ] User A clicks "Message" button to open conversation
- [ ] Both users can send messages back and forth
- [ ] Messages appear in correct order with timestamps
- [ ] Navigate to /messages to see conversation in inbox
- [ ] Accept User B as fixer
- [ ] Both see "Message Fixer/Poster" button in accepted card
- [ ] Unread count shows correctly in inbox
- [ ] Messages marked as read when viewed
- [ ] Cannot access conversations for listings you're not involved in

## Future Enhancements

1. **Real-time Updates** - WebSocket/Socket.io for instant message delivery
2. **Notifications** - Push notifications for new messages
3. **File Attachments** - Allow sending images (e.g., repair photos)
4. **Message Search** - Search within conversations
5. **Typing Indicators** - Show when other person is typing
6. **Message Reactions** - Emoji reactions to messages
7. **Archive Conversations** - Hide completed conversations
8. **Block/Report** - Safety features for problematic users
