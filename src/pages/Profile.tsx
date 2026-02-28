import { Settings, Package, Heart, Star, LogOut, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: listingCount = 0 } = useQuery({
    queryKey: ["my-listing-count", user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-4">
        <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-float">
          <LogIn className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="font-semibold text-foreground">Sign in to view your profile</p>
        <button
          onClick={() => navigate("/auth")}
          className="gradient-warm text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-float"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
          <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-float text-2xl font-bold text-primary-foreground">
            {(profile?.display_name?.[0] || user.email?.[0] || "?").toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground">
              {profile?.display_name || user.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button onClick={handleSignOut} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: Package, label: "Listings", value: String(listingCount) },
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
            {[
              { label: "My Listings", action: () => navigate("/") },
              { label: "Trade Matches", action: () => navigate("/trade") },
              { label: "Create Listing", action: () => navigate("/create") },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full text-left px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
