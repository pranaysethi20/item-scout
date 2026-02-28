import { motion } from "framer-motion";
import { Repeat2, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MatchCelebrationProps {
  listing: any;
  onClose: () => void;
}

const MatchCelebration = ({ listing, onClose }: MatchCelebrationProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-card rounded-3xl p-8 max-w-sm w-full shadow-float text-center"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className="w-20 h-20 gradient-trade rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-float"
        >
          <Repeat2 className="w-10 h-10 text-secondary-foreground" />
        </motion.div>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-extrabold text-card-foreground"
        >
          It's a Match! 🎉
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-2"
        >
          You and the seller both want to trade! Start a conversation to work out the details.
        </motion.p>

        {listing && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 bg-muted rounded-2xl p-3 flex items-center gap-3"
          >
            {listing.image_url && (
              <img src={listing.image_url} alt="" className="w-12 h-12 rounded-xl object-cover" />
            )}
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-sm text-card-foreground truncate">{listing.title}</p>
              <p className="text-xs text-muted-foreground">${Number(listing.price)} value</p>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 mt-6"
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-muted text-foreground font-semibold text-sm"
          >
            Keep Swiping
          </button>
          <button
            onClick={() => {
              onClose();
              if (listing) navigate(`/listing/${listing.id}`);
            }}
            className="flex-1 px-4 py-3 rounded-xl gradient-trade text-secondary-foreground font-semibold text-sm shadow-float flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Message
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MatchCelebration;
