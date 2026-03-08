import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ChatInterface.css';

interface Message {
  id: string;
  type: 'user' | 'system';
  content: string;
}

const parseMessageContent = (content: string) => {
  // Regex to match timestamps like [01:15] or [1:23:45]
  const regex = /\[(\d{1,2}:\d{2}(:\d{2})?)\]/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const timestamp = match[1];
    parts.push(
      <span
        key={match.index}
        className="timestamp-link"
        onClick={() => console.log(`Seek to ${timestamp}`)}
      >
        {timestamp}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts;
};

interface ChatInterfaceProps {
  videoId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  // console.log(videoId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hi! I have processed the video. You can ask me questions about it or click the timestamps I provide to navigate the video.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const queryText = inputValue.trim();
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':'application/json'
        },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      const systemMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: typeof data.response === 'string' ? data.response :
          typeof data.answer === 'string' ? data.answer :
            JSON.stringify(data)
      };
      setMessages(prev => [...prev, systemMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error while communicating with the server.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header glass-panel">
        <Bot size={20} className="text-accent" />
        <div className="header-info">
          <h3>Siftly</h3>
          <span className="status-online">● Ready</span>
        </div>
      </div>

      <div className="messages-container">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`message-wrapper ${msg.type}`}
            >
              <div className="message-avatar">
                {msg.type === 'system' ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`message-bubble ${msg.type}`}>
                <div className="message-content">
                  {parseMessageContent(msg.content)}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="message-wrapper system"
            >
              <div className="message-avatar">
                <Bot size={18} />
              </div>
              <div className="message-bubble system typing-indicator">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-wrapper glass-panel">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the video..."
            className="chat-textarea"
            rows={1}
          />
          <button
            type="submit"
            className="send-button"
            disabled={!inputValue.trim()}
          >
            <Send size={18} />
          </button>
        </form>
        <div className="input-footer text-muted">
          Press <b>Enter</b> to send, <b>Shift + Enter</b> for new line
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
