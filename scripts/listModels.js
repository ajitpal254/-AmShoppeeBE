const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listAvailableModels() {
    console.log("🔍 Checking Available Gemini Models...");
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY is missing in .env");
        return;
    }
    console.log(`🔑 API Key found: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

    try {
        // We can't list models directly with the SDK in all versions easily, 
        // but let's try to just use a model and see the error details or success.
        // Actually, let's try to use the 'gemini-1.5-flash' model specifically and print the FULL error.
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("👉 Sending test request to gemini-1.5-flash...");
        const result = await model.generateContent("Test");
        const response = await result.response;
        console.log("✅ Success! gemini-1.5-flash is working.");
        console.log("Response:", response.text());

    } catch (error) {
        console.error("❌ Error Details:");
        console.error("Message:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
            console.error("Response Data:", JSON.stringify(error.response.data, null, 2));
        }
        
        // Try a fallback model just in case
        try {
            console.log("\n👉 Retrying with 'gemini-pro'...");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Test");
            console.log("✅ Success! gemini-pro is working.");
        } catch (e) {
            console.error("❌ gemini-pro also failed:", e.message);
        }
    }
}

listAvailableModels();
