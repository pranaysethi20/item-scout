import { Gavel, Repeat2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Listing } from "@/data/mockListings";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: Listing;
  index: number;
}

const ListingCard = ({ listing, index }: ListingCardProps) => {
  const navigate = useNavigate();
  const highestBid = listing.bids.length
    ? Math.max(...listing.bids.map((b) => b.amount))
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/listing/${listing.id}`)}
      className="cursor-pointer group"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {listing.isAuction && (
            <div className="absolute top-2 left-2 gradient-warm text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Gavel className="w-3 h-3" />
              Auction
            </div>
          )}
          {listing.tradeOnly && (
            <div className="absolute top-2 left-2 gradient-trade text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Repeat2 className="w-3 h-3" />
              Trade
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm text-card-foreground truncate">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-primary font-bold text-base">
              ${highestBid ?? listing.price}
            </span>
            {listing.isAuction && listing.bids.length > 0 && (
              <span className="text-muted-foreground text-xs">
                {listing.bids.length} bid{listing.bids.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{listing.condition}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
