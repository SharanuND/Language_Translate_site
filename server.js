server.js
const express = require("express");
const path = require("path");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const client = new TranslationServiceClient();

app.post("/translate", async (req, res) => {

    try {

        const { text, targetLanguage } = req.body;

        const request = {
            parent: `projects/${process.env.PROJECT_ID}/locations/global`,
            contents: [text],
            mimeType: "text/plain",
            sourceLanguageCode: "en",
            targetLanguageCode: targetLanguage,
        };

        const [response] = await client.translateText(request);

        res.json({
            translatedText:
                response.translations[0].translatedText
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Translation failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});