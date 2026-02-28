import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { X, Heart } from "lucide-react";
import type { Listing } from "@/data/mockListings";

interface SwipeCardProps {
  listing: Listing;
  onSwipe: (direction: "left" | "right") => void;
  isTop: boolean;
}

const SwipeCard = ({ listing, onSwipe, isTop }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe("right");
    } else if (info.offset.x < -100) {
      onSwipe("left");
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 bg-card rounded-3xl overflow-hidden shadow-card scale-[0.95] opacity-60">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
      className="absolute inset-0 bg-card rounded-3xl overflow-hidden shadow-float cursor-grab active:cursor-grabbing"
    >
      <img
        src={listing.image}
        alt={listing.title}
        className="w-full h-full object-cover"
      />
      {/* Overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 gradient-trade text-secondary-foreground font-extrabold text-2xl px-4 py-2 rounded-xl rotate-[-12deg] border-4 border-secondary"
      >
        TRADE!
      </motion.div>
      <motion.div
        style={{ opacity: nopeOpacity }}
        className="absolute top-6 right-6 bg-destructive text-destructive-foreground font-extrabold text-2xl px-4 py-2 rounded-xl rotate-[12deg] border-4 border-destructive"
      >
        NOPE
      </motion.div>
      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-6 pt-20">
        <h2 className="text-primary-foreground font-bold text-xl">{listing.title}</h2>
        <p className="text-primary-foreground/70 text-sm mt-1">{listing.condition} · ${listing.price} value</p>
        <p className="text-primary-foreground/60 text-xs mt-2 line-clamp-2">{listing.description}</p>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
