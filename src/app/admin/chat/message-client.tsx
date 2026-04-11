"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, UserCircle, Navigation, MessageSquare } from "lucide-react";

type Rider = {
  id: string;
  full_name: string;
  email: string;
};

type Chat = {
  id: string;
  user_id: string;
  rider_id: string;
};

type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export function MessageClient({ adminId, riders }: { adminId: string; riders: Rider[] }) {
  const [activeRider, setActiveRider] = useState<Rider | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat for the selected rider
  useEffect(() => {
    if (!activeRider || !adminId) return;

    let isSubscribed = true;
    let channel: any;

    const fetchChatAndMessages = async () => {
      setIsLoading(true);
      // Try to find existing chat
      let { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .or(`and(user_id.eq.${adminId},rider_id.eq.${activeRider.id}),and(user_id.eq.${activeRider.id},rider_id.eq.${adminId})`)
        .maybeSingle();

      if (!chatData) {
        // Create new chat
        const { data: newChat, error: newChatErr } = await supabase
          .from('chats')
          .insert({ user_id: adminId, rider_id: activeRider.id })
          .select()
          .single();
        
        if (newChat) chatData = newChat;
      }

      if (chatData && isSubscribed) {
        setActiveChat(chatData);
        // Load messages
        const { data: msgs } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatData.id)
          .order('created_at', { ascending: true });
        
        if (msgs) setMessages(msgs);

        // Subscribe to real-time additions
        channel = supabase
          .channel(`chat_${chatData.id}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatData.id}` }, (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          })
          .subscribe();
      }
      setIsLoading(false);
    };

    fetchChatAndMessages();

    return () => {
      isSubscribed = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeRider, adminId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const msg = inputText.trim();
    setInputText("");

    await supabase.from('messages').insert({
      chat_id: activeChat.id,
      sender_id: adminId,
      message: msg
    });
  };

  return (
    <div className="flex w-full h-full text-white bg-[#1a1512]">
      {/* Sidebar - Riders List */}
      <div className="w-1/3 border-r border-white/5 bg-black/20 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-sm font-semibold tracking-wide text-white/80 uppercase">Available Riders ({riders.length})</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {riders.map((rider) => (
            <button
              key={rider.id}
              onClick={() => setActiveRider(rider)}
              className={`w-full p-4 flex items-center gap-3 text-left transition-colors border-b border-white/5 ${activeRider?.id === rider.id ? 'bg-accent/10 border-l-2 border-l-accent' : 'hover:bg-white/5'}`}
            >
              <UserCircle className={`w-8 h-8 ${activeRider?.id === rider.id ? 'text-accent' : 'text-white/40'}`} />
              <div>
                <p className="font-medium text-sm text-white/90">{rider.full_name}</p>
                <p className="text-xs text-white/40 truncate">{rider.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-black/40">
        {activeRider ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/60 shadow-sm z-10">
              <Navigation className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-semibold text-white/90 text-sm">Chatting with {activeRider.full_name}</h3>
                <p className="text-[10px] text-green-400 capitalize tracking-wider uppercase font-medium">Secured Comms Active</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full text-white/20 text-sm animate-pulse">Initializing Secure Channel...</div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-white/20 text-sm">No messages yet. Send a dispatch order to begin.</div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender_id === adminId;
                  return (
                    <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-accent text-background rounded-tr-none' : 'bg-[#2a2320] text-white/90 rounded-tl-none'} shadow-md`}>
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        <p className={`text-[10px] mt-1 ${isMe ? 'text-background/60' : 'text-white/40'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-black/60 border-t border-white/5">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type dispatch order..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-accent hover:bg-accent/80 text-background p-2 rounded-full disabled:opacity-50 transition-colors flex items-center justify-center w-10 h-10 shrink-0"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 p-8 text-center bg-black/20">
            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium text-white/50">No Fleet Rider Selected</p>
            <p className="text-sm mt-2 max-w-sm">Select a rider from the sidebar to open a secure dispatch communication channel.</p>
          </div>
        )}
      </div>
    </div>
  );
}
