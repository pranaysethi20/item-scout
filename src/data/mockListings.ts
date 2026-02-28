export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  condition: string;
  seller: string;
  sellerAvatar: string;
  bids: Bid[];
  createdAt: string;
  isAuction: boolean;
  tradeOnly?: boolean;
}

export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  time: string;
}

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "Mid-Century Modern Accent Chair",
    description: "Beautiful walnut frame accent chair with teal upholstery. Minor wear on armrests, otherwise excellent condition. Perfect for a living room or reading nook.",
    price: 120,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop",
    category: "Furniture",
    condition: "Good",
    seller: "Sarah M.",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    bids: [
      { id: "b1", bidder: "Alex", amount: 95, time: "2h ago" },
      { id: "b2", bidder: "Jordan", amount: 110, time: "1h ago" },
    ],
    createdAt: "3 hours ago",
    isAuction: true,
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Headphones",
    description: "Like-new noise cancelling headphones. Includes original box, case, and cables. Only used for a month.",
    price: 200,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
    category: "Electronics",
    condition: "Like New",
    seller: "Mike T.",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    bids: [],
    createdAt: "5 hours ago",
    isAuction: false,
  },
  {
    id: "3",
    title: "Vintage Denim Jacket",
    description: "Classic Levi's trucker jacket from the 90s. Size M. Great patina and broken-in feel.",
    price: 65,
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=600&fit=crop",
    category: "Clothing",
    condition: "Good",
    seller: "Emma L.",
    sellerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    bids: [
      { id: "b3", bidder: "Chris", amount: 50, time: "30m ago" },
    ],
    createdAt: "1 day ago",
    isAuction: true,
  },
  {
    id: "4",
    title: "Kindle Paperwhite (2023)",
    description: "Latest gen Kindle Paperwhite with adjustable warm light. Includes magnetic case. Perfect condition.",
    price: 90,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop",
    category: "Electronics",
    condition: "Excellent",
    seller: "David R.",
    sellerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    bids: [],
    createdAt: "2 days ago",
    isAuction: false,
    tradeOnly: true,
  },
  {
    id: "5",
    title: "Cast Iron Skillet Set",
    description: "Lodge cast iron 3-piece set. Well seasoned. Includes 8\", 10\", and 12\" skillets.",
    price: 75,
    image: "https://images.unsplash.com/photo-1585837146751-a44118595680?w=600&h=600&fit=crop",
    category: "Kitchen",
    condition: "Good",
    seller: "Lisa K.",
    sellerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    bids: [
      { id: "b4", bidder: "Nina", amount: 60, time: "4h ago" },
      { id: "b5", bidder: "Tom", amount: 70, time: "2h ago" },
      { id: "b6", bidder: "Sam", amount: 72, time: "45m ago" },
    ],
    createdAt: "6 hours ago",
    isAuction: true,
  },
  {
    id: "6",
    title: "Yoga Mat & Block Set",
    description: "Manduka PRO yoga mat in midnight color with two cork blocks. Barely used.",
    price: 55,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
    category: "Sports",
    condition: "Like New",
    seller: "Amy W.",
    sellerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    bids: [],
    createdAt: "1 day ago",
    isAuction: false,
    tradeOnly: true,
  },
];
