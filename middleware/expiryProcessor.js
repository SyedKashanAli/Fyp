const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HF_API_KEY);

exports.checkExpiry = async (foodItem) => {
    const prompt = `You are a food safety expert. Estimate the expiry date for:
    - Item: ${foodItem.itemname}
    - Description: ${foodItem.description}
    - Manufacture Date: ${foodItem.manufacturedate}
    - Today: ${new Date().toLocaleDateString()}
    Respond ONLY with {"expiry": "YYYY-MM-DD", "isExpired": boolean}`;

    const response = await hf.textGeneration({
        model: 'deepseek-ai/DeepSeek-R1',
        inputs: prompt,
        parameters: { max_new_tokens: 50 }
    });

    return JSON.parse(response.generated_text.trim());
};