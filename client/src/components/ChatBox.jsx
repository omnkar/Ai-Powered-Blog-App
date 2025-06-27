import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ChatBox = ({ blogContent,id }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I can help answer questions about this blog post. What would you like to know?'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { axios } = useAppContext();
  const bottomRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    
    const newMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const res = await axios.post(`/api/blog/chat/ask`, {
        blogId:id,
        userQuestion: userInput,
      });
      console.log(res.data.content);
      const data = res.data.content;
      // console.log(data);
      const botMessage = { sender: 'bot', text: data };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 text-sm italic p-3 rounded-lg border shadow-sm">
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t bg-white p-3">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <textarea
              placeholder="Ask me anything about this blog post..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
              style={{ minHeight: '40px', maxHeight: '100px' }}
              disabled={loading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!userInput.trim() || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;