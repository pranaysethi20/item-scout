import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Gavel, MessageCircle, Share2, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [messaging, setMessaging] = useState(false);

  const handleMessage = async () => {
    if (!user) { navigate("/auth"); return; }
    if (user.id === listing?.user_id) {
      toast({ title: "That's your listing!", variant: "destructive" });
      return;
    }
    setMessaging(true);
    try {
      // Check for existing conversation
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("listing_id", listing!.id)
        .eq("buyer_id", user.id)
        .maybeSingle();

      if (existing) {
        navigate(`/chat/${existing.id}`);
        return;
      }

      // Create new conversation
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          listing_id: listing!.id,
          buyer_id: user.id,
          seller_id: listing!.user_id,
        })
        .select("id")
        .single();

      if (error) throw error;
      navigate(`/chat/${newConv.id}`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setMessaging(false);
    }
  };

  const { data: listing, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select(`*, profiles!listings_user_id_fkey(display_name, avatar_url), bids(id, amount, user_id, created_at)`)
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Realtime bids
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`bids-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bids", filter: `listing_id=eq.${id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["listing", id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Listing not found</p>
      </div>
    );
  }

  const bids = (listing.bids || []).sort((a: any, b: any) => Number(b.amount) - Number(a.amount));
  const highestBid = bids.length ? Number(bids[0].amount) : null;
  const profile = listing.profiles as any;

  const handleBid = async () => {
    if (!user) { navigate("/auth"); return; }
    const amount = parseFloat(bidAmount);
    const minBid = (highestBid ?? Number(listing.price)) + 1;
    if (!amount || amount < minBid) {
      toast({ title: "Invalid bid", description: `Bid must be at least $${minBid}`, variant: "destructive" });
      return;
    }
    setBidding(true);
    try {
      const { error } = await supabase.from("bids").insert({
        listing_id: listing.id,
        user_id: user.id,
        amount,
      });
      if (error) throw error;
      toast({ title: "🎉 Bid placed!", description: `You bid $${amount}` });
      setBidAmount("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setBidding(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="relative">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={listing.image_url || "/placeholder.svg"}
          alt={listing.title}
          className="w-full aspect-square object-cover"
        />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card">
          <ArrowLeft className="w-5 h-5 text-card-foreground" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => setLiked(!liked)} className="w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card">
            <Heart className={`w-5 h-5 ${liked ? "fill-primary text-primary" : "text-card-foreground"}`} />
          </button>
          <button className="w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center shadow-card">
            <Share2 className="w-5 h-5 text-card-foreground" />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-5 shadow-card space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-card-foreground">{listing.title}</h1>
              <p className="text-xs text-muted-foreground mt-1">
                {listing.category} · {listing.condition} · {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}
              </p>
            </div>
            <span className="text-2xl font-extrabold text-primary">${highestBid ?? Number(listing.price)}</span>
          </div>

          {profile && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {profile.display_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-card-foreground">{profile.display_name}</p>
                <p className="text-xs text-muted-foreground">Seller</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto rounded-xl text-xs" onClick={handleMessage} disabled={messaging}>
                <MessageCircle className="w-3.5 h-3.5 mr-1" /> {messaging ? "..." : "Message"}
              </Button>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-card-foreground mb-1">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {listing.is_auction && (
            <div className="bg-muted rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Auction</h3>
                <span className="ml-auto text-xs text-muted-foreground">
                  {bids.length} bid{bids.length !== 1 ? "s" : ""}
                </span>
              </div>

              {bids.slice(0, 3).map((bid: any) => (
                <div key={bid.id} className="flex items-center justify-between text-sm">
                  <span className="text-card-foreground font-medium">Bidder</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">${Number(bid.amount)}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder={`$${(highestBid ?? Number(listing.price)) + 1}+`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="bg-card border-border rounded-xl"
                />
                <Button onClick={handleBid} disabled={bidding} className="gradient-warm text-primary-foreground border-0 rounded-xl px-6 shadow-float hover:opacity-90">
                  {bidding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Bid"}
                </Button>
              </div>
            </div>
          )}

          {!listing.is_auction && !listing.trade_only && (
            <Button className="w-full gradient-warm text-primary-foreground border-0 rounded-xl h-12 text-base font-bold shadow-float hover:opacity-90">
              Buy Now · ${Number(listing.price)}
            </Button>
          )}

          {listing.trade_only && (
            <Button onClick={() => navigate("/trade")} className="w-full gradient-trade text-secondary-foreground border-0 rounded-xl h-12 text-base font-bold shadow-float hover:opacity-90">
              Offer Trade
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ListingDetail;
