const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"]
    })
);
app.use(express.json());

console.log("API Key Loaded:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
    res.send("Contextify API Running");
});

app.post("/generate", async (req, res) => {
    try {
        const { context, goal, type } = req.body;

        console.log("Incoming Request:", req.body);

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const prompt = `
You are an expert prompt engineer.

Context:
${context}

Goal:
${goal}

Prompt Type:
${type}

Create a detailed, professional AI prompt.
`;

        const result = await model.generateContent(prompt);

        const text = result.response.text();

        console.log("Generated:");
        console.log(text);

        return res.json({
            success: true,
            prompt: text
        });

    } catch (error) {
        console.error("ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});