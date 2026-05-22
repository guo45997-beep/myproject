import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "服务端未配置 OPENAI_API_KEY。" }, { status: 500 });
    }

    const { productName, category, sellingPoints, promoText, style, aspectRatio, images } = await req.json();

    if (!Array.isArray(images) || images.length < 1 || images.length > 4) {
      return NextResponse.json({ error: "images 必须是 1-4 张图片的 data URL 数组。" }, { status: 400 });
    }

    const prompt = `你是资深电商视觉设计师，请生成一张中文电商平台主图。

产品名称：${productName}
产品类目：${category}
核心卖点：${sellingPoints}
促销信息：${promoText || "无"}
主图风格：${style}
画幅：${aspectRatio}

强约束：
1) 必须保留上传产品的外观、包装形状、品牌 logo、文字结构、材质质感。
2) 不要改变产品主体，不要虚构不存在的功能，不要夸张虚假宣传。
3) 允许优化背景、光影、构图、摆放和商业氛围，以提升点击率。
4) 若有促销信息，可作为辅助贴片，文字少而清晰，不遮挡产品。
5) 画面干净，适合电商平台首图。`;

    const response = await openai.responses.create({
      model: "gpt-5.5",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            ...images.map((imageUrl: string) => ({
              type: "input_image" as const,
              image_url: imageUrl,
            })),
          ],
        },
      ],
      tools: [
        {
          type: "image_generation",
          action: "generate",
          quality: "high",
        },
      ],
    });

    const imageOutput = response.output.find((item) => item.type === "image_generation_call");
    const imageBase64 = imageOutput && "result" in imageOutput ? imageOutput.result : null;

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json({ error: "未获取到生成图片结果，请重试。" }, { status: 500 });
    }

    return NextResponse.json({ imageBase64 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: `主图生成失败：${message}` }, { status: 500 });
  }
}
