import { useState, useCallback } from "react";
import { X, Heart, RotateCcw, Repeat2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import SwipeCard from "@/components/SwipeCard";
import { mockListings } from "@/data/mockListings";
import { useToast } from "@/hooks/use-toast";

const tradeItems = mockListings.filter((l) => l.tradeOnly || l.price < 100);

const TradeSwipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const item = tradeItems[currentIndex];
      if (direction === "right") {
        // Simulate ~30% match chance
        if (Math.random() > 0.6) {
          setMatches((prev) => [...prev, item.id]);
          toast({
            title: "🎉 It's a match!",
            description: `You matched with ${item.seller} for "${item.title}"`,
          });
        }
      }
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, toast]
  );

  const remaining = tradeItems.slice(currentIndex);
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

        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 bg-secondary/10 rounded-xl p-3 flex items-center gap-2"
          >
            <Heart className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              {matches.length} match{matches.length > 1 ? "es" : ""}!
            </span>
          </motion.div>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="relative w-full max-w-sm aspect-[3/4]">
          {visibleCards.length > 0 ? (
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
                onClick={() => setCurrentIndex(0)}
                className="mt-4 flex items-center gap-2 text-sm text-primary font-semibold"
              >
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
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
