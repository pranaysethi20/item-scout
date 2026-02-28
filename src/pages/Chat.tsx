import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { format } from "date-fns";

const Chat = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversation } = useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          listings(title, image_url, price),
          buyer:profiles!conversations_buyer_id_fkey(display_name),
          seller:profiles!conversations_seller_id_fkey(display_name)
        `)
        .eq("id", conversationId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!conversationId && !!user,
  });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId && !!user,
  });

  // Realtime messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !user || !conversationId) return;
    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: message.trim(),
      });
      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", conversationId);

      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const otherPerson = conversation
    ? conversation.buyer_id === user?.id
      ? (conversation.seller as any)?.display_name
      : (conversation.buyer as any)?.display_name
    : "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/messages")} className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>
          {conversation?.listings && (
            <img
              src={(conversation.listings as any).image_url || "/placeholder.svg"}
              alt=""
              className="w-9 h-9 rounded-lg object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-card-foreground truncate">
              {otherPerson || "Chat"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {(conversation?.listings as any)?.title || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-lg mx-auto w-full">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No messages yet. Say hi! 👋
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isMine = msg.sender_id === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? "gradient-warm text-primary-foreground rounded-br-md"
                        : "bg-card text-card-foreground shadow-card rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {format(new Date(msg.created_at), "h:mm a")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-background border-t border-border pb-20">
        <div className="max-w-lg mx-auto px-4 py-3 flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="bg-card border-border rounded-xl"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="w-10 h-10 gradient-warm rounded-xl flex items-center justify-center shadow-float hover:opacity-90 disabled:opacity-50 flex-shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-primary-foreground" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
