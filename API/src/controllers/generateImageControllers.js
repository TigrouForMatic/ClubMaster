const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const getGenerateImage = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: "Le prompt est requis" });
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image_url = response.data[0].url;

    res.json({ image_url });
  } catch (error) {
    console.error("Erreur lors de la génération de l'image:", error);
    res.status(500).json({ error: "Erreur lors de la génération de l'image" });
  }
};

module.exports = {
  getGenerateImage,
};