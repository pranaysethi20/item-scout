import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          listings(title, image_url),
          buyer:profiles!conversations_buyer_id_fkey(display_name),
          seller:profiles!conversations_seller_id_fkey(display_name)
        `)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-muted-foreground">Sign in to view messages</p>
        <button onClick={() => navigate("/auth")} className="gradient-warm text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-float">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Messages
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">Your conversations with buyers & sellers</p>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-4 shadow-card animate-pulse flex gap-3">
                <div className="w-12 h-12 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))
          ) : conversations.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No messages yet</p>
              <p className="text-sm mt-1">Start a conversation from any listing</p>
            </div>
          ) : (
            conversations.map((conv: any, i: number) => {
              const otherPerson = conv.buyer_id === user.id ? conv.seller : conv.buyer;
              const listing = conv.listings;
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/chat/${conv.id}`)}
                  className="w-full bg-card rounded-2xl p-4 shadow-card flex gap-3 items-center text-left hover:shadow-card-hover transition-shadow"
                >
                  {listing?.image_url ? (
                    <img src={listing.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-card-foreground truncate">
                      {listing?.title || "Listing"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {otherPerson?.display_name || "User"} · {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
