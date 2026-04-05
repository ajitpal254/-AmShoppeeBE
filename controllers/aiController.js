const asyncHandler = require("express-async-handler");

const predefinedResponses = [
  {
    keywords: ["popular", "products", "show"],
    message: "Here are some of our most popular products! Taking you there now...",
    action: { type: "NAVIGATE", payload: "/products" }
  },
  {
    keywords: ["return", "policy", "refund"],
    message: "We offer a 30-day return policy on all unworn and unopened items with original tags attached.",
    action: null
  },
  {
    keywords: ["track", "order", "where"],
    message: "You can track your orders in your profile. I'll take you to the orders page.",
    action: { type: "NAVIGATE", payload: "/orders" }
  },
  {
    keywords: ["gift", "recommend", "under"],
    message: "Absolutely! We have great accessories and smaller items. Check out our products page.",
    action: { type: "NAVIGATE", payload: "/products" }
  },
  {
    keywords: ["hello", "hi", "hey"],
    message: "Hello there! How can I help you today?",
    action: null
  }
];

const getBotResponse = (input) => {
  const normalizedInput = input.toLowerCase();
  
  // Exact match for predefined prompts
  const exactMatches = {
    "show me your most popular products": {
        message: "Here are some of our most popular products! Taking you there now...",
        action: { type: "NAVIGATE", payload: "/products" }
    },
    "what is your return policy?": {
        message: "We offer a 30-day return policy on all unworn and unopened items with original tags attached.",
        action: null
    },
    "i need help tracking my order": {
        message: "You can track your orders in your profile. I'll take you to the orders page.",
        action: { type: "NAVIGATE", payload: "/orders" }
    },
    "can you recommend a gift under $50?": {
        message: "Absolutely! We have great accessories and smaller items under $50. Check out our products page and filter by price.",
        action: { type: "NAVIGATE", payload: "/products" }
    }
  };

  if (exactMatches[normalizedInput]) {
    return exactMatches[normalizedInput];
  }

  // Keyword match
  for (const res of predefinedResponses) {
    if (res.keywords.some(kw => normalizedInput.includes(kw))) {
      return { message: res.message, action: res.action || null };
    }
  }

  return {
    message: "I'm a simple assistant right now, but I can help you find products, track orders, or answer questions about our return policy. Try selecting one of the suggested prompts or asking about products!",
    action: null
  };
};

/**
 * @desc    Handle AI Command (Proxies to Predefined Responses)
 * @route   POST /api/ai/command
 * @access  Private (Admin/Vendor/User)
 */
const handleCommand = asyncHandler(async (req, res) => {
  const { command } = req.body;
  const response = getBotResponse(command || "");
  res.status(200).json({
    success: true,
    message: response.message,
    action: response.action,
  });
});

/**
 * @desc    Get Pre-defined AI Prompts
 * @route   GET /api/ai/prompts
 * @access  Public
 */
const getPrompts = asyncHandler(async (req, res) => {
  const prompts = [
    { id: 1, text: "Show me your most popular products", icon: "🔥" },
    { id: 2, text: "What is your return policy?", icon: "↩️" },
    { id: 3, text: "I need help tracking my order", icon: "📦" },
    { id: 4, text: "Can you recommend a gift under $50?", icon: "🎁" },
  ];
  res.status(200).json({ success: true, count: prompts.length, data: prompts });
});

/**
 * @desc    Handle AI Chat Message
 * @route   POST /api/ai/chat
 * @access  Public
 */
const handleChat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  const response = getBotResponse(message);

  res.status(200).json({ 
    success: true, 
    message: response.message, 
    action: response.action 
  });
});

module.exports = {
  handleCommand,
  getPrompts,
  handleChat,
};
