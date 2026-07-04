import React, { useState, useRef, useEffect } from 'react';
import { Search, Edit, MoreVertical, Phone, Video, Paperclip, Smile, Send, Check, CheckCheck, MessageSquare } from 'lucide-react';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [inputValue, setInputValue] = useState('');
  
  const messagesEndRef = useRef(null);

  const chats = [
    { id: 1, name: 'General Staff', type: 'group', unread: 3, time: '10:42 AM', lastMessage: 'Sarah: Has anyone seen the pool car keys?' },
    { id: 2, name: 'David Chen', type: 'direct', unread: 0, time: '09:15 AM', lastMessage: 'I have arrived at the client site.' },
    { id: 3, name: 'Clinical Team', type: 'group', unread: 0, time: 'Yesterday', lastMessage: 'Dr. Taylor: The updated MAR charts are ready.' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sarah Jenkins', isMe: false, text: 'Hi team, checking in for the morning shift. Has anyone seen the pool car keys?', time: '10:30 AM', status: 'read' },
    { id: 2, sender: 'Me', isMe: true, text: 'I think David had them last night.', time: '10:32 AM', status: 'read' },
    { id: 3, sender: 'Me', isMe: true, text: 'Yes, David scanned them at 8 PM. I will give him a call.', time: '10:35 AM', status: 'read' },
  ]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      sender: 'Me',
      isMe: true,
      text: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' // simulate 'read' later if needed
    };
    
    setMessages([...messages, newMsg]);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-2 h-[calc(100vh-2rem)] flex flex-col">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl bg-gradient-to-r from-brand-800 to-brand-600 p-6 md:p-8 text-white shadow-lg shadow-brand-900/10 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans flex items-center gap-3">
            <MessageSquare className="w-8 h-8" />
            Staff Messages
          </h1>
          <p className="mt-1 text-sm md:text-base text-brand-100 font-medium">
            Internal communication and group chats.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[500px]">
        {/* Sidebar / Chat List */}
        <div className="w-full lg:w-80 glass-card rounded-2xl flex flex-col overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-800/80">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div className="relative w-full mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
              />
            </div>
            <button className="p-2 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-xl transition-colors shrink-0">
              <Edit className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white/50 dark:bg-slate-900/20">
            {chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors flex gap-3 ${activeChat === chat.id ? 'bg-brand-50/50 dark:bg-brand-900/10 border-l-4 border-l-brand-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent'}`}
              >
                <div className="relative shrink-0">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black shadow-sm ${chat.type === 'group' ? 'bg-gradient-to-tr from-brand-400 to-brand-600 text-white' : 'bg-gradient-to-tr from-emerald-400 to-teal-500 text-white'}`}>
                    {chat.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 truncate text-sm">{chat.name}</h3>
                    <span className="text-[10px] whitespace-nowrap font-bold text-slate-400">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-xs truncate text-slate-500 dark:text-slate-400 font-medium">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 glass-card rounded-2xl flex flex-col relative border border-slate-200/60 dark:border-slate-800/80 overflow-hidden">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-brand-400 to-brand-600 text-white rounded-xl flex items-center justify-center font-black shadow-sm">
                G
              </div>
              <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100">General Staff</h2>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 12 online
                </p>
              </div>
            </div>
            <div className="flex gap-2 text-slate-400">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><Phone className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><Video className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Today
              </span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && <span className="text-[10px] font-bold text-slate-400 mb-1.5 ml-1">{msg.sender}</span>}
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm ${msg.isMe ? 'bg-brand-600 text-white rounded-tr-sm shadow-brand-500/20' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                  <p className="text-[13px] sm:text-[14px] leading-relaxed font-medium">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1.5 mr-1">
                  <span className="text-[10px] font-bold text-slate-400">{msg.time}</span>
                  {msg.isMe && (
                    msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-brand-500" /> : <Check className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-end gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all">                <label className="p-2 text-slate-400 hover:text-brand-500 transition-colors shrink-0 cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                  <input type="file" className="hidden" />
                </label>
                <select className="bg-transparent text-xs text-slate-500 font-semibold focus:outline-none focus:ring-0 border-none px-1">
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
                <textarea  
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..." 
                className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 outline-none"
                rows="1"
              ></textarea>
              <button 
                onClick={handleSendMessage}
                className="flex h-10 w-10 items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors shrink-0 shadow-md shadow-brand-500/20 mb-0.5 mr-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Messages;

