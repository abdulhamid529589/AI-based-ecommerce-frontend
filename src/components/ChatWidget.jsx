import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import api from '../lib/axios'
import './ChatWidget.css'

/**
 * Chat Widget Component
 * Real-time chat for customers to message owner
 * Only available for logged-in users
 */
// NOTE: this component is exported as default below so that imports
// like `import ChatWidget from './components/ChatWidget'` continue to
// work. We also provide a named export in case someone prefers it.
export const ChatWidget = ({ user, isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Initialize chat
  useEffect(() => {
    if (!isLoggedIn || !user) return

    const initializeChat = async () => {
      try {
        // Start or get existing conversation
        const response = await api.post('/chat/start', {
          subject: `Chat with ${user.name}`,
        })

        setConversationId(response.data.conversationId)

        // Get conversation messages
        const messagesResponse = await api.get(`/chat/${response.data.conversationId}/messages`)
        setMessages(messagesResponse.data.messages)

        // Connect to Socket.io chat namespace
        const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin
        socketRef.current = io(`${socketUrl}/chat`, {
          auth: {
            userId: user.id,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
          withCredentials: true,
        })

        // Join chat room
        socketRef.current.emit('join-chat', {
          userId: user.id,
          conversationId: response.data.conversationId,
        })

        // Listen for messages
        socketRef.current.on('new-message', (data) => {
          setMessages((prev) => [...prev, data])
          if (data.senderId !== user.id) {
            setUnreadCount((prev) => prev + 1)
          }
        })

        // Listen for chat history
        socketRef.current.on('chat-history', (data) => {
          setMessages(data.messages || [])
        })

        // Listen for typing indicator
        socketRef.current.on('user-typing', (data) => {
          if (data.userId !== user.id) {
            setIsTyping(data.isTyping)
          }
        })

        // Listen for errors
        socketRef.current.on('error', (error) => {
          console.error('Chat error:', error)
        })
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initializeChat()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [isLoggedIn, user])

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !conversationId || !socketRef.current) return

    // Emit message through Socket.io
    socketRef.current.emit('send-message', {
      conversationId,
      message: newMessage,
      userId: user.id,
      isOwner: false,
    })

    // Mark as read
    socketRef.current.emit('mark-read', {
      conversationId,
      userId: user.id,
    })

    setUnreadCount(0)
    setNewMessage('')
  }

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    if (socketRef.current) {
      socketRef.current.emit('typing', {
        conversationId,
        userId: user.id,
        isTyping: true,
      })

      // Stop typing after 1 second
      setTimeout(() => {
        socketRef.current?.emit('typing', {
          conversationId,
          userId: user.id,
          isTyping: false,
        })
      }, 1000)
    }
  }

  // Show chat widget only if logged in
  if (!isLoggedIn) {
    return (
      <div className="chat-widget">
        {/* Chat Button - Always visible */}
        {!isOpen && (
          <button className="chat-button" onClick={() => setIsOpen(true)} title="Chat with owner">
            💬
          </button>
        )}

        {/* Chat Window - Login Prompt */}
        {isOpen && (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <h3>Chat with Owner</h3>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            {/* Login Prompt */}
            <div className="chat-messages login-prompt-container">
              <div className="login-prompt">
                <p className="prompt-icon">🔐</p>
                <p className="prompt-title">Login Required</p>
                <p className="prompt-message">
                  Please log in to your account to chat with our owner. We're here to help!
                </p>
                <a href="/login" className="prompt-button">
                  Go to Login
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="chat-widget">
      {/* Chat Button */}
      {!isOpen && (
        <button
          className="chat-button"
          onClick={() => {
            setIsOpen(true)
            setUnreadCount(0)
          }}
        >
          💬
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <h3>Chat with Owner</h3>
            <button className="close-button" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>👋 Start a conversation with us!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={`${msg.id}-${index}`}
                  className={`message ${msg.senderId === user.id ? 'customer' : 'owner'}`}
                >
                  {msg.isAutoReply && <div className="auto-reply-badge">Auto Reply</div>}
                  <div className="message-content">
                    <p className="message-text">{msg.message}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt || msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="typing-indicator">
                <p>Owner is typing</p>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="chat-input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={handleTyping}
              disabled={!conversationId}
            />
            <button type="submit" disabled={!newMessage.trim() || !conversationId}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

// default export for convenience
export default ChatWidget
