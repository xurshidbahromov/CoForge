"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Hash,
    Send,
    Smile,
    Users,
    Menu
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import UserProfileModal from "@/components/dashboard/UserProfileModal";
import { Theme } from 'emoji-picker-react';

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Channel {
    id: number;
    name: string;
    description: string;
    type: string;
}

interface Message {
    id: number;
    content: string;
    user_id: number;
    username: string;
    avatar_url: string | null;
    created_at: string;
    parent_id?: number | null;
}

export default function GlobalChat() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mobile toggle
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // 1. Fetch User & Channels
    useEffect(() => {
        const init = async () => {
            try {
                const [userRes, channelRes] = await Promise.all([
                    axios.get("http://localhost:8000/profile/me", { withCredentials: true }),
                    axios.get("http://localhost:8000/chat/channels", { withCredentials: true })
                ]);
                setCurrentUser(userRes.data);
                setChannels(channelRes.data);
                if (channelRes.data.length > 0) {
                    setActiveChannel(channelRes.data[0]);
                }
            } catch (error) {
                console.error("Init failed", error);
                toast.error("Failed to load chat");
            }
        };
        init();
    }, []);

    // 2. Handle Channel Switch & History
    useEffect(() => {
        if (!activeChannel) return;

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/chat/channels/${activeChannel.id}/messages`, { withCredentials: true });
                setMessages(res.data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch history", error);
            }
        };

        fetchHistory();
        connectWebSocket(activeChannel.id);

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [activeChannel]);

    // 3. Connect WebSocket
    const connectWebSocket = (channelId: number) => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const wsUrl = `ws://localhost:8000/chat/ws/${channelId}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to chat");
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
            scrollToBottom();
        };

        ws.onclose = () => {
            console.log("Disconnected");
            setIsConnected(false);
        };

        socketRef.current = ws;
    };

    // 4. Click Outside Handler for Emoji Picker
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || !socketRef.current || !isConnected) return;

        socketRef.current.send(JSON.stringify({ content: inputValue }));
        setInputValue("");
        setShowEmojiPicker(false);
        // refocus input?
    };

    const onEmojiClick = (emojiData: any) => {
        setInputValue(prev => prev + emojiData.emoji);
    };

    return (
        <div className="flex h-[80vh] gap-6 relative">
            <UserProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />

            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className={`absolute md:relative z-20 w-64 h-full glass-panel rounded-3xl flex flex-col border border-white/5 ${!isSidebarOpen ? 'hidden md:flex' : 'flex'}`}
                    >
                        <div className="p-6 border-b border-white/5">
                            <h2 className="font-black text-xl flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" /> Community
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <div className="text-xs font-bold opacity-50 uppercase px-2 mb-2">Channels</div>
                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => {
                                        setActiveChannel(channel);
                                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeChannel?.id === channel.id ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-white/5 text-foreground/70 hover:text-foreground'}`}
                                >
                                    <Hash className="w-4 h-4 opacity-50" />
                                    {channel.name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Chat Area */}
            <div className="flex-1 glass-panel rounded-3xl flex flex-col border border-white/5 overflow-hidden relative group">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
                <div className="bg-glow-orb transition-opacity duration-1000 group-hover:opacity-100 opacity-60" />

                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 hover:bg-white/5 rounded-lg"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h3 className="font-bold flex items-center gap-2 text-lg">
                                <Hash className="w-5 h-5 text-foreground/40" />
                                {activeChannel?.name || "Loading..."}
                            </h3>
                            <p className="text-xs text-foreground/50">{activeChannel?.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-xs font-mono opacity-50">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar flex flex-col">
                    {messages.map((msg, i) => {
                        const isMe = currentUser && msg.user_id === currentUser.id;
                        const isConsecutive = i > 0 && messages[i - 1].user_id === msg.user_id;

                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''} ${isConsecutive ? 'mt-1' : 'mt-6'}`}
                            >
                                {!isConsecutive && (
                                    <button
                                        onClick={() => setSelectedUserId(msg.user_id)}
                                        className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-bold text-xs shrink-0 border border-white/10 shadow-sm text-foreground/80 hover:scale-105 transition-transform cursor-pointer"
                                    >
                                        {msg.username[0].toUpperCase()}
                                    </button>
                                )}
                                {isConsecutive && <div className="w-9 shrink-0" />}

                                <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!isConsecutive && (
                                        <div className="flex items-center gap-2 mb-1.5 px-1">
                                            <button
                                                onClick={() => setSelectedUserId(msg.user_id)}
                                                className="text-xs font-bold opacity-70 hover:opacity-100 hover:underline cursor-pointer"
                                            >
                                                {msg.username}
                                            </button>
                                            <span className="text-[10px] opacity-40">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}
                                    <div className={`px-4 py-2 text-sm leading-relaxed shadow-sm ${isMe
                                            ? 'bg-primary text-white rounded-2xl rounded-tr-sm'
                                            : 'bg-white/10 dark:bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm backdrop-blur-md'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-black/20 border-t border-white/5 relative z-30">
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                ref={emojiPickerRef}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-full left-4 mb-4 z-50 shadow-2xl rounded-3xl overflow-hidden border border-white/10"
                            >
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme={Theme.DARK}
                                    width={320}
                                    height={400}
                                    lazyLoadEmojis={true}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <form
                        onSubmit={sendMessage}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors"
                    >
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEmojiPicker(!showEmojiPicker);
                            }}
                            className={`p-2 rounded-lg transition-colors ${showEmojiPicker ? 'bg-primary/20 text-primary' : 'hover:bg-white/5 text-foreground/50 hover:text-foreground'}`}
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            // onClick={() => setShowEmojiPicker(false)} // Remove this so it doesn't close when typing
                            placeholder={`Message #${activeChannel?.name || "chat"}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm h-10"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || !isConnected}
                            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
