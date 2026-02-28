import { Gavel, Repeat2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  listing: any;
  index: number;
}

const ListingCard = ({ listing, index }: ListingCardProps) => {
  const navigate = useNavigate();
  const bids = listing.bids || [];
  const highestBid = bids.length
    ? Math.max(...bids.map((b: any) => Number(b.amount)))
    : null;

  const timeAgo = formatDistanceToNow(new Date(listing.created_at), { addSuffix: true });

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
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
          {listing.is_auction && (
            <div className="absolute top-2 left-2 gradient-warm text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Gavel className="w-3 h-3" />
              Auction
            </div>
          )}
          {listing.trade_only && (
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
              ${highestBid ?? Number(listing.price)}
            </span>
            {listing.is_auction && bids.length > 0 && (
              <span className="text-muted-foreground text-xs">
                {bids.length} bid{bids.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{listing.condition} · {timeAgo}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingCard;
