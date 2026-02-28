import { useState } from "react";
import { Camera, Loader2, Check, Edit3, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Step = "upload" | "analyzing" | "review";

const CreateListing = () => {
  const [step, setStep] = useState<Step>("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [isAuction, setIsAuction] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        simulateAI();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAI = () => {
    setStep("analyzing");
    // Simulated AI analysis
    setTimeout(() => {
      setTitle("Vintage Wooden Side Table");
      setDescription(
        "Charming mid-century side table in solid oak. Shows beautiful patina from decades of use. Sturdy construction with tapered legs. Measures approximately 20\" x 16\" x 22\". A few surface scratches but structurally sound."
      );
      setPrice("85");
      setCategory("Furniture");
      setCondition("Good");
      setStep("review");
    }, 2500);
  };

  const handlePublish = () => {
    toast({
      title: "🎉 Listing published!",
      description: "Your item is now live on SnapSell.",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-lg mx-auto px-4 pt-4">
        <h1 className="text-xl font-extrabold text-foreground">
          <Sparkles className="w-5 h-5 inline text-primary mr-1" />
          AI Listing Creator
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Snap a photo, we'll do the rest
        </p>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <label className="block cursor-pointer">
                <div className="aspect-square rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors">
                  <div className="w-16 h-16 gradient-warm rounded-2xl flex items-center justify-center shadow-float">
                    <Camera className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground">
                      Take a photo or upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Our AI will identify the item & create your listing
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 flex flex-col items-center gap-4 py-20"
            >
              {imagePreview && (
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-card">
                  <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
                </div>
              )}
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-semibold text-foreground">AI is analyzing...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Identifying item, researching price, writing description
                </p>
              </div>
            </motion.div>
          )}

          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 space-y-4"
            >
              {imagePreview && (
                <div className="aspect-video rounded-2xl overflow-hidden shadow-card">
                  <img src={imagePreview} alt="Item" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="bg-primary/5 rounded-2xl p-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-xs text-primary font-medium">
                  AI-generated listing — review and edit before publishing
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-card border-border rounded-xl" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Description</label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="bg-card border-border rounded-xl resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Price ($)</label>
                    <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-card border-border rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Condition</label>
                    <Input value={condition} onChange={(e) => setCondition(e.target.value)} className="bg-card border-border rounded-xl" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Category</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} className="bg-card border-border rounded-xl" />
                </div>

                <div className="flex items-center justify-between bg-card rounded-xl p-3 border border-border">
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">Enable Auction</p>
                    <p className="text-xs text-muted-foreground">Let buyers bid on your item</p>
                  </div>
                  <button
                    onClick={() => setIsAuction(!isAuction)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${isAuction ? "gradient-warm" : "bg-muted"}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-card rounded-full shadow transition-transform ${isAuction ? "left-6" : "left-1"}`} />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { setStep("upload"); setImagePreview(null); }}
                  className="flex-1 rounded-xl border-border"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Retake
                </Button>
                <Button
                  onClick={handlePublish}
                  className="flex-1 rounded-xl gradient-warm text-primary-foreground border-0 shadow-float hover:opacity-90"
                >
                  <Check className="w-4 h-4 mr-2" /> Publish
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateListing;
