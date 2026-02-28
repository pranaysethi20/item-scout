import { Search } from "lucide-react";
import { useState } from "react";
import { mockListings } from "@/data/mockListings";
import ListingCard from "@/components/ListingCard";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const categories = ["All", "Furniture", "Electronics", "Clothing", "Kitchen", "Sports"];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = mockListings.filter((l) => {
    const matchesCategory = activeCategory === "All" || l.category === activeCategory;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-extrabold text-foreground"
          >
            Snap<span className="text-primary">Sell</span>
          </motion.h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Snap it. List it. Sell it.
          </p>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-muted border-0 rounded-xl h-10 text-sm"
            />
          </div>
          {/* Categories */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? "gradient-warm text-primary-foreground shadow-float"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((listing, i) => (
            <ListingCard key={listing.id} listing={listing} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-semibold">No items found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
