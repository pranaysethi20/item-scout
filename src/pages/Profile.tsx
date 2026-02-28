import { Settings, Package, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-float text-2xl font-bold text-primary-foreground">
            Y
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground">You</h1>
            <p className="text-sm text-muted-foreground">Member since 2025</p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Package, label: "Listings", value: "0" },
            { icon: Heart, label: "Favorites", value: "0" },
            { icon: Star, label: "Rating", value: "–" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-card rounded-2xl p-4 shadow-card text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-bold text-card-foreground mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {["My Listings", "Trade Matches", "Bid History", "Settings"].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
