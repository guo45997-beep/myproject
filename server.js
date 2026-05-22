require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json({ limit: '2mb' }));
app.use(express.static('.'));
app.post('/api/generate-main-image', async (req, res) => {
  const { prompt, size } = req.body || {};
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: '服务端未配置 OPENAI_API_KEY，请先配置 .env。' });
  if (!prompt || !size) return res.status(400).json({ error: '缺少必要参数：prompt 和 size。' });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const supportedSizes = new Set(['1024x1024', '1024x1536', '1536x1024']);
  const actualSize = supportedSizes.has(size) ? size : '1024x1536';
  try {
    const result = await client.images.generate({ model: 'gpt-image-1', prompt, size: actualSize });
    const imageBase64 = result.data?.[0]?.b64_json;
    const imageUrl = result.data?.[0]?.url;
    if (!imageBase64 && !imageUrl) return res.status(502).json({ error: '图片生成完成，但未收到可用图片数据。' });
    return res.json({ imageBase64, imageUrl, actualSize });
  } catch (error) {
    return res.status(500).json({ error: error?.message || '服务端调用 OpenAI Images API 失败' });
  }
});
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
