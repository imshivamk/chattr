# Socket.IO Implementation Guide

## Overview

This application uses **Socket.IO** for real-time bidirectional communication between the backend server and frontend clients. Socket.IO enables instant message delivery and online user presence tracking without requiring page refreshes or polling.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                                                                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │   useAuthStore       │◄────────►│   useChatStore       │   │
│  │  (Socket Manager)    │          │ (Message Handler)    │   │
│  └──────────┬───────────┘          └──────────┬───────────┘   │
│             │                                  │               │
│             │ Socket Connection                │ Listen to     │
│             │ (with JWT cookie)                │ "newMessage"  │
└─────────────┼──────────────────────────────────┼───────────────┘
              │                                  │
              │ WebSocket/Long-polling           │
              ▼                                  ▲
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
│                                                                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │   Socket Server      │          │  Chat Controller     │   │
│  │   (lib/socket.ts)    │          │  (sendMessage)       │   │
│  │                      │          │                      │   │
│  │  • Auth middleware   │          │  • Saves message     │   │
│  │  • Track users       │◄─────────│  • Emits to receiver │   │
│  │  • Online status     │          │    via socket        │   │
│  └──────────────────────┘          └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend Implementation

### 1. Socket Server Setup (`backend/src/lib/socket.ts`)

This is the **core Socket.IO server** that handles all real-time connections.

#### Key Components:

**a) Server Initialization**
```typescript
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,  // Allow cookies for authentication
  },
});
```
- Creates an HTTP server wrapped around Express
- Initializes Socket.IO server with CORS enabled
- Allows cookies to be sent with socket connections (needed for JWT authentication)

**b) Authentication Middleware**
```typescript
io.use(verifySocketToken);
```
- Runs **before** every socket connection
- Validates JWT token from cookies
- Attaches `userId` to socket object if valid
- Disconnects unauthorized users

**c) User Connection Tracking**
```typescript
const userSocketMap: Record<string, string> = {};

io.on("connection", async (socket: IAuthSocket) => {
  const user = await User.findById(socket.userId);
  if(!user) return socket.disconnect();
  
  userSocketMap[socket.userId as string] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
  socket.on("disconnect", () => {
    delete userSocketMap[socket.userId as string];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
```
- **`userSocketMap`**: Maps userId → socketId for quick lookups
- **On connection**: Store user's socket ID and broadcast updated online users list
- **On disconnect**: Remove user from map and broadcast updated list

**d) Helper Function**
```typescript
export const getReceiverSocketId = (userId: string) => {
  return userSocketMap[userId];
}
```
- Used by controllers to find a user's socket ID
- Returns `undefined` if user is offline

---

### 2. Authentication Middleware (`backend/src/middleware/auth.middleware.ts`)

#### `verifySocketToken()`
```typescript
export const verifySocketToken = (
  socket: IAuthSocket,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.headers.cookie
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) return next(new Error("Unauthorized!"));

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as IJwtPayload;
    socket.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(new Error("Unauthorized - Invalid Token"));
  }
}
```

**How it works:**
1. Extracts JWT from `cookie` header (sent automatically by browser)
2. Verifies token using `JWT_SECRET`
3. Attaches `userId` to socket for use in connection handlers
4. Blocks connection if token is invalid

---

### 3. Message Broadcasting (`backend/src/controllers/chat.controllers.ts`)

#### `sendMessage()` Controller
```typescript
export const sendMessage = async (req: IAuthRequest, res: Response) => {
  // ... validation and saving message to DB ...

  const receiverSocketId = getReceiverSocketId(receiverId);
  
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  
  return res.status(201).json({ savedMessage });
}
```

**Flow:**
1. HTTP POST `/api/v1/chat/send/:id` is received
2. Message is saved to MongoDB
3. Get receiver's socket ID using `getReceiverSocketId()`
4. If receiver is online, emit "newMessage" event **directly to their socket**
5. Return HTTP response to sender

**Key Socket.IO Methods:**
- `io.to(socketId).emit(event, data)`: Send to specific socket
- `io.emit(event, data)`: Broadcast to all connected sockets

---

### 4. Server Integration (`backend/src/index.ts`)

```typescript
import { app, server } from "./lib/socket.js";

// Apply middleware to Express app
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);

// Start server (not app.listen!)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Important:**
- Use `server.listen()` instead of `app.listen()`
- This ensures Socket.IO and Express share the same HTTP server

---

## Frontend Implementation

### 1. Socket Connection Manager (`frontend/src/store/useAuthStore.tsx`)

This Zustand store manages the Socket.IO client connection lifecycle.

#### State
```typescript
{
  socket: Socket | null,        // Socket.IO client instance
  onlineUsers: string[],        // Array of online user IDs
  user: User | null,            // Current authenticated user
}
```

#### `connectSocket()`
```typescript
connectSocket: () => {
  const { user } = get();
  if (!user || get().socket?.connected) return;

  const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1/', '') 
    ?? "http://localhost:3000";
  
  const socket = io(socketUrl, {
    withCredentials: true  // Send cookies with connection
  });

  set({ socket: socket });

  socket.on("getOnlineUsers", (userIds: []) => {
    set({ onlineUsers: userIds });
  });
}
```

**How it works:**
1. Called after successful login/signup
2. Prevents duplicate connections (checks `socket?.connected`)
3. Connects to **base server URL** (not `/api/v1/` path)
4. `withCredentials: true` sends JWT cookie for authentication
5. Listens for "getOnlineUsers" event to update online status

#### `disconnectSocket()`
```typescript
disconnectSocket: () => {
  const { socket } = get();
  if (socket?.connected) socket.disconnect();
}
```
- Called on logout
- Properly closes WebSocket connection

---

### 2. Message Listener (`frontend/src/store/useChatStore.tsx`)

Handles incoming real-time messages.

#### `listenForMessages()`
```typescript
listenForMessages: () => {
  const { selectedUser } = get();
  if (!selectedUser) return;

  const socket = useAuthStore.getState().socket;
  if (!socket) return;

  socket.off("newMessage");  // Remove old listener to prevent duplicates

  socket.on("newMessage", (newMessage: Message) => {
    if (newMessage.senderId === selectedUser._id) {
      set({
        messages: [...get().messages, newMessage]
      });
    }
  });
}
```

**How it works:**
1. Gets socket from `useAuthStore`
2. Removes old "newMessage" listener (prevents duplicate handlers)
3. Adds new listener that:
   - Checks if message is from currently selected user
   - Appends message to messages array if match
   - Updates UI in real-time

#### `stopListeningForMessages()`
```typescript
stopListeningForMessages: () => {
  const socket = useAuthStore.getState().socket;
  if (socket) socket.off("newMessage");
}
```
- Called when user switches chats or leaves chat page
- Removes listener to prevent memory leaks

---

### 3. Component Integration (`frontend/src/components/chatPageComponents/MessageList.tsx`)

```typescript
useEffect(() => {
  const fetchMessages = async () => {
    if (selectedUser) {
      await getMessages(selectedUser._id);  // Fetch history via HTTP
      listenForMessages();                  // Start listening for new messages
    }
  };
  fetchMessages();
  
  return () => {
    stopListeningForMessages();  // Cleanup on unmount
  };
}, [selectedUser?._id]);
```

**Lifecycle:**
1. User selects a chat → Fetch message history (HTTP GET)
2. Start listening for real-time messages (WebSocket)
3. User switches chat/leaves → Stop listening (cleanup)

---

## Data Flow Examples

### Example 1: User Comes Online

```
1. User logs in (HTTP POST /api/v1/auth/login)
   ↓
2. Frontend calls connectSocket()
   ↓
3. Socket.IO connection established with JWT cookie
   ↓
4. Backend verifySocketToken() validates user
   ↓
5. Backend adds user to userSocketMap
   ↓
6. Backend emits "getOnlineUsers" to ALL connected clients
   ↓
7. All clients update their onlineUsers state
```

---

### Example 2: Sending a Message

```
SENDER SIDE:
1. User types message and clicks send
   ↓
2. Frontend calls sendMessage() (HTTP POST /api/v1/chat/send/:id)
   ↓
3. Backend saves message to MongoDB
   ↓
4. Backend gets receiver's socket ID from userSocketMap
   ↓
5. Backend emits "newMessage" event to receiver's socket
   ↓
6. Backend sends HTTP 201 response to sender
   ↓
7. Sender's UI updates with message

RECEIVER SIDE (if online):
1. Receiver's socket receives "newMessage" event
   ↓
2. useChatStore's listenForMessages() handler fires
   ↓
3. Checks if message is from currently selected user
   ↓
4. If yes: Adds message to messages array
   ↓
5. React re-renders MessageList with new message
```

---

### Example 3: User Goes Offline

```
1. User closes browser/logs out
   ↓
2. Frontend calls disconnectSocket()
   ↓
3. Socket connection closes
   ↓
4. Backend "disconnect" event fires
   ↓
5. Backend removes user from userSocketMap
   ↓
6. Backend emits "getOnlineUsers" to remaining clients
   ↓
7. All clients update their online users list
```

---

## Files Reference

### Backend Files Using Socket.IO
| File | Purpose |
|------|---------|
| `backend/src/lib/socket.ts` | Socket.IO server initialization, connection handling, user tracking |
| `backend/src/middleware/auth.middleware.ts` | JWT authentication for socket connections |
| `backend/src/controllers/chat.controllers.ts` | Message sending and real-time broadcasting |
| `backend/src/types/types.ts` | TypeScript interfaces (IAuthSocket) |
| `backend/src/index.ts` | Server startup (imports socket server) |

### Frontend Files Using Socket.IO
| File | Purpose |
|------|---------|
| `frontend/src/store/useAuthStore.tsx` | Socket connection management, online users |
| `frontend/src/store/useChatStore.tsx` | Message listening and handling |
| `frontend/src/components/chatPageComponents/MessageList.tsx` | UI component that subscribes to messages |

---

## Events Reference

### Backend → Frontend Events

| Event | Payload | Trigger | Purpose |
|-------|---------|---------|---------|
| `getOnlineUsers` | `string[]` (user IDs) | User connects/disconnects | Update online status of all users |
| `newMessage` | `Message` object | Someone sends a message | Deliver message in real-time to receiver |

### Frontend → Backend Events

| Event | Payload | Purpose |
|-------|---------|---------|
| `disconnect` | (none) | Automatically fired when user leaves/closes tab |

---

## Key Concepts

### 1. **Why Socket.IO instead of plain WebSockets?**
- **Fallback support**: If WebSocket fails, Socket.IO falls back to HTTP long-polling
- **Automatic reconnection**: Handles network drops gracefully
- **Room/namespace support**: Can organize connections (not used in this app yet)
- **Event-based API**: Cleaner than raw WebSocket message handling

### 2. **Authentication Flow**
- JWT stored in HTTP-only cookie (secure)
- Cookie automatically sent with socket handshake
- Backend validates on every connection attempt
- No token = connection rejected

### 3. **User-to-Socket Mapping**
- Each user can only have **one active socket connection**
- `userSocketMap[userId] = socketId` allows targeted message delivery
- When user disconnects, mapping is removed

### 4. **Why separate HTTP and WebSocket?**
- **HTTP**: Reliable for queries, file uploads, authentication
- **WebSocket**: Low-latency for real-time updates
- Socket.IO is used **only** for pushing data to clients (messages, online status)
- Client still uses HTTP for sending messages (saves to DB first)

---

## Environment Variables

### Backend (.env)
```env
CLIENT_URL=http://localhost:5173  # Used for CORS and Socket.IO origin
JWT_SECRET=your_secret_key        # Used to verify socket tokens
PORT=3000                          # Server port
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api/v1/  # API base for HTTP requests
```

**Note:** Socket.IO connects to `http://localhost:3000` (base URL, not `/api/v1/`)

---

## Common Issues & Solutions

### Issue 1: Socket not connecting
**Cause:** Frontend connecting to wrong URL (e.g., including `/api/v1/` path)
**Solution:** Ensure socket connects to base server URL:
```typescript
const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1/', '') 
  ?? "http://localhost:3000";
```

### Issue 2: Messages not received in real-time
**Cause:** Message listener not active or checking wrong sender ID
**Solution:** Verify `listenForMessages()` is called and filters by `selectedUser._id`

### Issue 3: "Unauthorized" error on socket connection
**Cause:** Cookie not being sent or token expired
**Solution:** 
- Check `withCredentials: true` on client
- Check `credentials: true` in CORS config
- Verify JWT token is valid

### Issue 4: Multiple message duplicates
**Cause:** Multiple listeners attached without cleanup
**Solution:** Always call `socket.off("newMessage")` before adding new listener

---

## Performance Considerations

1. **Scaling**: Current implementation uses in-memory `userSocketMap`
   - For multi-server deployments, use Redis adapter
   - Example: `socket.io-redis` to share state across servers

2. **Memory**: Listener cleanup is critical
   - Always remove listeners in `useEffect` cleanup
   - Prevents memory leaks from abandoned listeners

3. **Bandwidth**: Socket.IO is efficient
   - Uses binary protocol when possible
   - Heartbeat/ping packets are small (~50 bytes)

---

## Future Enhancements

1. **Typing Indicators**: Emit "typing" event when user types
2. **Message Read Receipts**: Track when messages are seen
3. **Group Chats**: Use Socket.IO rooms for multi-user chats
4. **Delivery Status**: Show "sent", "delivered", "read" states
5. **Push Notifications**: Integrate with service workers for background notifications

---

## Testing Socket.IO

### Backend Test (using Postman or curl)
1. Get JWT token from login endpoint
2. Use Socket.IO client libraries to connect with token
3. Monitor connection/disconnect events in server logs

### Frontend Test (Browser DevTools)
1. Open Network tab → Filter by "WS" (WebSocket)
2. Look for Socket.IO connection (e.g., `?EIO=4&transport=websocket`)
3. Check Console logs for connection status and events

### Debug Logging
Add to backend:
```typescript
io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});
```

---

## Summary

Socket.IO in this application provides:
- ✅ Real-time message delivery (instant chat updates)
- ✅ Online/offline status tracking
- ✅ Secure authentication via JWT cookies
- ✅ Targeted message delivery (sender → specific receiver)
- ✅ Automatic reconnection on network issues

The implementation separates concerns:
- **Backend**: Manages connections, validates auth, broadcasts events
- **Frontend**: Connects on login, listens for events, updates UI reactively

All real-time features are built on top of a traditional REST API, combining the reliability of HTTP with the speed of WebSockets.
