import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Gavel, MessageCircle, Share2, Heart } from "lucide-react";
import { useState } from "react";
import { mockListings } from "@/data/mockListings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const listing = mockListings.find((l) => l.id === id);
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const highestBid = listing.bids.length
    ? Math.max(...listing.bids.map((b) => b.amount))
    : null;

  const handleBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || (highestBid && amount <= highestBid) || amount <= listing.price) {
      toast({
        title: "Invalid bid",
        description: `Bid must be higher than $${highestBid ?? listing.price}`,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "🎉 Bid placed!", description: `You bid $${amount}` });
    setBidAmount("");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Image */}
      <div className="relative">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={listing.image}
          alt={listing.title}
          className="w-full aspect-square object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card"
        >
          <ArrowLeft className="w-5 h-5 text-card-foreground" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card"
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : "text-card-foreground"}`} />
          </button>
          <button className="w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card">
            <Share2 className="w-5 h-5 text-card-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-5 shadow-card space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-card-foreground">{listing.title}</h1>
              <p className="text-xs text-muted-foreground mt-1">{listing.category} · {listing.condition} · {listing.createdAt}</p>
            </div>
            <span className="text-2xl font-extrabold text-primary">${highestBid ?? listing.price}</span>
          </div>

          {/* Seller */}
          <div className="flex items-center gap-3">
            <img src={listing.sellerAvatar} alt={listing.seller} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-card-foreground">{listing.seller}</p>
              <p className="text-xs text-muted-foreground">Seller</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto rounded-xl text-xs">
              <MessageCircle className="w-3.5 h-3.5 mr-1" /> Message
            </Button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-1">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Bid Section */}
          {listing.isAuction && (
            <div className="bg-muted rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Auction</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {listing.bids.length} bid{listing.bids.length !== 1 ? "s" : ""}
                </span>
              </div>

              {listing.bids.length > 0 && (
                <div className="space-y-2">
                  {listing.bids.slice(-3).reverse().map((bid) => (
                    <div key={bid.id} className="flex items-center justify-between text-sm">
                      <span className="text-card-foreground font-medium">{bid.bidder}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">${bid.amount}</span>
                        <span className="text-xs text-muted-foreground">{bid.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`$${(highestBid ?? listing.price) + 5}+`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="bg-card border-border rounded-xl"
                />
                <Button
                  onClick={handleBid}
                  className="gradient-warm text-primary-foreground border-0 rounded-xl px-6 shadow-float hover:opacity-90"
                >
                  Bid
                </Button>
              </div>
            </div>
          )}

          {!listing.isAuction && !listing.tradeOnly && (
            <Button className="w-full gradient-warm text-primary-foreground border-0 rounded-xl h-12 text-base font-bold shadow-float hover:opacity-90">
              Buy Now · ${listing.price}
            </Button>
          )}

          {listing.tradeOnly && (
            <Button className="w-full gradient-trade text-secondary-foreground border-0 rounded-xl h-12 text-base font-bold shadow-float hover:opacity-90">
              Offer Trade
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ListingDetail;
