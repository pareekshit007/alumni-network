import React, { useEffect, useState, useRef } from 'react';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import api from '../utils/api';
import Avatar from '../components/common/Avatar';
import Spinner from '../components/common/Spinner';

const MessagesPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages');
        setConversations(res.data.data);
      } catch (err) {
        console.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeConv._id}`);
        setMessages(res.data.data);
        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [activeConv]);

  // Socket setup
  useEffect(() => {
    if (!socket || !activeConv) return;

    socket.emit('join_conversation', activeConv._id);

    const handleNewMessage = (msg) => {
      if (msg.conversation === activeConv._id) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
      
      // Update conversations list latest message preview
      setConversations((prevConvs) => {
        return prevConvs.map(conv => {
            if (conv._id === msg.conversation) {
                return { ...conv, lastMessage: msg, updatedAt: Date.now() };
            }
            return conv;
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    };

    const handleTyping = ({ userId, conversationId, isTyping }) => {
      if (conversationId === activeConv._id && userId !== user.id) {
        setTypingUser(isTyping ? userId : null);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [socket, activeConv, user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    
    try {
      if (socket) socket.emit('typing', { conversationId: activeConv._id, isTyping: false });
      
      await api.post('/messages', {
        conversationId: activeConv._id,
        content: newMessage
      });
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleTypingChange = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && activeConv) {
        socket.emit('typing', { conversationId: activeConv._id, isTyping: true });
        
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('typing', { conversationId: activeConv._id, isTyping: false });
        }, 2000);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="card" style={{ display: 'flex', height: 'calc(100vh - 140px)', padding: 0, overflow: 'hidden' }}>
      
      {/* Left panel - Conversations List */}
      <div style={{ width: '35%', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="heading-3">Messages</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id !== user.id);
            const isActive = activeConv?._id === conv._id;
            
            return (
              <div 
                key={conv._id} 
                onClick={() => setActiveConv(conv)}
                style={{
                  padding: '16px 20px', 
                  display: 'flex', gap: '16px', alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background-color 0.2s'
                }}
              >
                <Avatar src={otherUser?.avatar} alt={otherUser?.name} size="48px" />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '4px' }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {otherUser?.name}
                    </h4>
                    {conv.lastMessage && <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                    </span>}
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.lastMessage?.content || 'Started a conversation'}
                  </p>
                </div>
              </div>
            );
          })}
          {conversations.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active conversations found. 
                  <br />Go to the Alumni Directory to connect and start chatting!
              </div>
          )}
        </div>
      </div>

      {/* Right panel - Message Thread */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FAFAFA' }}>
        {!activeConv ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Thread Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', gap: '12px' }}>
               <Avatar src={activeConv.participants.find(p => p._id !== user.id)?.avatar} alt="User" size="40px" />
               <h3 className="heading-3" style={{ fontSize: '1.25rem' }}>{activeConv.participants.find(p => p._id !== user.id)?.name}</h3>
            </div>

            {/* Messages body */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map(msg => {
                const isMine = msg.sender._id === user.id || msg.sender === user.id;
                return (
                  <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%', 
                      padding: '12px 16px',
                      borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isMine ? 'var(--primary)' : 'var(--surface)',
                      color: isMine ? 'white' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      border: isMine ? 'none' : '1px solid var(--border-color)'
                    }}>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{msg.content}</div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        marginTop: '4px', textAlign: 'right', 
                        color: isMine ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' 
                      }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
              {typingUser && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div className="text-muted" style={{ fontSize: '0.875rem', padding: '8px', fontStyle: 'italic' }}>
                          User is typing...
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--surface)' }}>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type your message..." 
                  className="input-field" 
                  style={{ borderRadius: 'var(--radius-full)' }}
                  value={newMessage}
                  onChange={handleTypingChange}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px 24px' }}
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
