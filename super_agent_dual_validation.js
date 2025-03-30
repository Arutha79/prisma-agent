require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Clé API manquante.");
    process.exit(1);
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Mémoire fictive (sans fichier pour simplifier le déploiement Railway)
let learningMemory = [];
let interactionHistory = [];

cron.schedule('0 * * * *', () => {
    console.log("🕒 Sauvegarde automatique (fictive sur Railway)");
});

app.get('/', (req, res) => {
    res.send('✅ Super Agent IA en ligne (Railway)');
});

app.post('/api/interact', async (req, res) => {
    const { prompt, max_tokens = 200 } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Le champ "prompt" est requis.' });
    }

    try {
        const modelA = "gpt-3.5-turbo";
        const modelB = "gpt-4";

        const responseA = await openai.createChatCompletion({
            model: modelA,
            messages: [{ role: 'user', content: prompt }],
            max_tokens
        });

        const responseB = await openai.createChatCompletion({
            model: modelB,
            messages: [{ role: 'user', content: prompt }],
            max_tokens
        });

        const messageA = responseA.data.choices[0].message.content.trim();
        const messageB = responseB.data.choices[0].message.content.trim();

        const same = messageA === messageB;

        res.json({
            coherence: same ? "✅ Réponses identiques" : "⚠️ Divergence détectée",
            gpt_3_5: messageA,
            gpt_4: messageB
        });
    } catch (error) {
        console.error("❌ Erreur API :", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Prisma en ligne sur port ${port}`);
});