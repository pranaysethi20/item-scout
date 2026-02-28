import { useState, useCallback, useEffect } from "react";
import { X, Heart, RotateCcw, Repeat2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SwipeCard from "@/components/SwipeCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const TradeSwipe = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["trade-listings", user?.id],
    queryFn: async () => {
      // Get listings that the user hasn't swiped on yet, excluding own
      let query = supabase
        .from("listings")
        .select("*, profiles!listings_user_id_fkey(display_name)")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (user) {
        query = query.neq("user_id", user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (!user) return data || [];

      // Filter out already swiped
      const { data: swipes } = await supabase
        .from("trade_matches")
        .select("listing_id")
        .eq("user_id", user.id);

      const swipedIds = new Set((swipes || []).map((s) => s.listing_id));
      return (data || []).filter((l) => !swipedIds.has(l.id));
    },
  });

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (!user) { navigate("/auth"); return; }
      const item = listings[currentIndex];
      if (!item) return;

      try {
        const { error } = await supabase.from("trade_matches").insert({
          user_id: user.id,
          listing_id: item.id,
          direction,
          matched: false,
        });
        if (error) throw error;

        if (direction === "right") {
          toast({
            title: "👍 Trade interest sent!",
            description: `You're interested in "${item.title}"`,
          });
        }
      } catch (err: any) {
        console.error(err);
      }

      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, listings, user, toast, navigate]
  );

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-muted-foreground">Sign in to start trading</p>
        <button onClick={() => navigate("/auth")} className="gradient-trade text-secondary-foreground px-6 py-3 rounded-xl font-bold shadow-float">
          Sign In
        </button>
      </div>
    );
  }

  const remaining = listings.slice(currentIndex);
  const visibleCards = remaining.slice(0, 2);

  return (
    <div className="min-h-screen pb-24 flex flex-col">
      <div className="max-w-lg mx-auto px-4 pt-4 w-full">
        <div className="flex items-center gap-2">
          <Repeat2 className="w-5 h-5 text-secondary" />
          <h1 className="text-xl font-extrabold text-foreground">TradeMatch</h1>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Swipe right to offer a trade, left to skip
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm aspect-[3/4]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : visibleCards.length > 0 ? (
            <AnimatePresence>
              {visibleCards
                .slice()
                .reverse()
                .map((listing, i) => (
                  <SwipeCard
                    key={listing.id}
                    listing={listing}
                    onSwipe={handleSwipe}
                    isTop={i === visibleCards.length - 1}
                  />
                ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-16 h-16 gradient-trade rounded-2xl flex items-center justify-center mb-4">
                <Repeat2 className="w-8 h-8 text-secondary-foreground" />
              </div>
              <p className="font-semibold text-foreground">No more items to swipe</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for new trades</p>
              <button
                onClick={() => { setCurrentIndex(0); queryClient.invalidateQueries({ queryKey: ["trade-listings"] }); }}
                className="mt-4 flex items-center gap-2 text-sm text-primary font-semibold"
              >
                <RotateCcw className="w-4 h-4" /> Refresh
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {visibleCards.length > 0 && (
        <div className="flex items-center justify-center gap-6 pb-4">
          <button
            onClick={() => handleSwipe("left")}
            className="w-14 h-14 rounded-full bg-card border-2 border-destructive/20 flex items-center justify-center shadow-card hover:shadow-card-hover transition-shadow"
          >
            <X className="w-6 h-6 text-destructive" />
          </button>
          <button
            onClick={() => handleSwipe("right")}
            className="w-16 h-16 rounded-full gradient-trade flex items-center justify-center shadow-float hover:opacity-90 transition-opacity"
          >
            <Heart className="w-7 h-7 text-secondary-foreground" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeSwipe;
