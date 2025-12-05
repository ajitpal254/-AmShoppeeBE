// Connects to the local Python AI Engine (3AmShopAI)
const AI_ENGINE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://3amshop-3amshopai.hf.space/generate' 
    : 'http://localhost:5000/generate';

/**
 * Process a command using the local Python AI Engine
 * @param {string} command - The user's input
 * @param {string} role - The user's role
 * @returns {Promise<string>} - The processed response from the AI
 */
const processCommand = async (command, role) => {
    try {
        console.log(`🤖 Sending command to AI Engine: "${command}"`);
        
        const response = await fetch(AI_ENGINE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command })
        });

        if (!response.ok) {
            throw new Error(`AI Engine Error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // The Python engine returns:
        // { "type": "tool_result" | "message", "result": "...", "tool": "..." }
        
        // Return the raw data so the controller can handle actions (like navigation)
        return data;

    } catch (error) {
        console.error("❌ AI Engine Connection Failed:", error.message);
        return "I'm having trouble connecting to my brain (Python Engine). Please make sure 'ai_engine.py' is running.";
    }
};

module.exports = {
    processCommand
};
