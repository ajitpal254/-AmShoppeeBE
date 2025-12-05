const asyncHandler = require('express-async-handler');
const LocalLLM = require('../utils/3AmShopLLM');

/**
 * @desc    Handle AI Command (Proxies to Python AI Engine)
 * @route   POST /api/ai/command
 * @access  Private (Admin/Vendor/User)
 */
const handleCommand = asyncHandler(async (req, res) => {
    const { command, role } = req.body;

    try {
        // Call the Python AI Engine
        const aiResponse = await LocalLLM.processCommand(command, role);
        
        let message = "";
        let action = null;

        // Handle different response types from Python
        if (aiResponse.type === 'tool_result') {
            message = aiResponse.result;
            
            // Special handling for Navigation
            if (aiResponse.tool === 'navigate') {
                const dest = aiResponse.args?.destination || 'home';
                
                // Map keywords to actual frontend routes
                const routeMap = {
                    'home': '/',
                    'homepage': '/',
                    'cart': '/cart',
                    'basket': '/cart',
                    'profile': '/profile',
                    'settings': '/profile',
                    'products': '/products',
                    'orders': '/orders',
                    'admin': '/admin/dashboard',
                    'login': '/login'
                };
                
                action = {
                    type: 'NAVIGATE',
                    payload: routeMap[dest.toLowerCase()] || `/${dest}`
                };
            }
        } else if (aiResponse.type === 'message') {
            message = aiResponse.result.message || JSON.stringify(aiResponse.result);
        } else {
            // Fallback for raw strings or errors
            message = typeof aiResponse === 'string' ? aiResponse : JSON.stringify(aiResponse);
        }

        res.status(200).json({
            success: true,
            message: message,
            action: action
        });

    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(200).json({ 
            success: true, 
            message: "I'm having trouble connecting to my brain right now. Please try again later." 
        });
    }
});

module.exports = {
    handleCommand
};
