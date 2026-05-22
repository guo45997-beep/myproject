"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type StyleOption =
  | "白底干净主图"
  | "高级摄影棚主图"
  | "618大促氛围主图"
  | "小红书高级感主图"
  | "淘宝天猫点击率主图"
  | "抖音商城强视觉主图";

type AspectRatio = "1:1" | "3:4";

const styleOptions: StyleOption[] = [
  "白底干净主图",
  "高级摄影棚主图",
  "618大促氛围主图",
  "小红书高级感主图",
  "淘宝天猫点击率主图",
  "抖音商城强视觉主图",
];

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [sellingPoints, setSellingPoints] = useState("");
  const [promoText, setPromoText] = useState("");
  const [style, setStyle] = useState<StyleOption>("白底干净主图");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultBase64, setResultBase64] = useState("");

  const resultDataUrl = useMemo(
    () => (resultBase64 ? `data:image/png;base64,${resultBase64}` : ""),
    [resultBase64],
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (files.length > 4) {
      setError("最多上传 4 张产品图。");
      return;
    }

    setError("");
    const readers = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("图片读取失败"));
          reader.readAsDataURL(file);
        }),
    );

    try {
      const base64Images = await Promise.all(readers);
      setImages(base64Images);
    } catch {
      setError("图片读取失败，请重试。");
    }
  };

  const generate = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setResultBase64("");

    if (images.length < 1) {
      setError("请至少上传 1 张产品图。");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-main-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          category,
          sellingPoints,
          promoText,
          style,
          aspectRatio,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "生成失败");
      }
      setResultBase64(data.imageBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold">电商美工主图一键生成</h1>
        <p className="mt-2 text-sm text-gray-600">上传产品图，填写信息，一键生成可用于电商平台的主图。</p>

        <form onSubmit={generate} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block font-medium">上传产品图片（1-4 张）</label>
            <input type="file" accept="image/*" multiple onChange={handleUpload} className="block w-full text-sm" />
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`预览${idx + 1}`} className="h-32 w-full rounded-lg border object-cover" />
              ))}
            </div>
          </div>

          <input className="w-full rounded-lg border p-2" placeholder="产品名称" value={productName} onChange={(e) => setProductName(e.target.value)} required />
          <input className="w-full rounded-lg border p-2" placeholder="产品类目" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <textarea className="w-full rounded-lg border p-2" placeholder="核心卖点（多行）" value={sellingPoints} onChange={(e) => setSellingPoints(e.target.value)} rows={4} required />
          <input className="w-full rounded-lg border p-2" placeholder="促销信息（可选）" value={promoText} onChange={(e) => setPromoText(e.target.value)} />

          <div>
            <label className="mb-2 block font-medium">主图风格</label>
            <select className="w-full rounded-lg border p-2" value={style} onChange={(e) => setStyle(e.target.value as StyleOption)}>
              {styleOptions.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">画幅</label>
            <select className="w-full rounded-lg border p-2" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}>
              <option value="1:1">1:1 电商主图</option>
              <option value="3:4">3:4 竖版主图</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-60">
            {loading ? "生成中..." : "一键生成主图"}
          </button>

          {error && <p className="rounded-lg bg-red-50 p-3 text-red-600">{error}</p>}
        </form>

        {resultDataUrl && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-semibold">生成结果</h2>
            <img src={resultDataUrl} alt="生成主图" className="max-w-full rounded-xl border" />
            <div className="mt-4 flex gap-3">
              <a href={resultDataUrl} download={`${productName || "main-image"}.png`} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                下载 PNG
              </a>
              <button onClick={(e) => generate(e as unknown as FormEvent)} className="rounded-lg border px-4 py-2">
                重新生成
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
