const startProjectBtn = document.getElementById('startProjectBtn');
const productInfoSection = document.getElementById('product-info');
const generatePointsBtn = document.getElementById('generatePointsBtn');
const pointList = document.getElementById('pointList');
const selectedLayout = document.getElementById('selectedLayout');
const copyResult = document.getElementById('copyResult');
const competitorBody = document.getElementById('competitorBody');
const addCompetitorBtn = document.getElementById('addCompetitorBtn');

const generateMainImageBtn = document.getElementById('generateMainImageBtn');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const downloadImageBtn = document.getElementById('downloadImageBtn');
const imageGenStatus = document.getElementById('imageGenStatus');
const promptPreview = document.getElementById('promptPreview');
const imagePreview = document.getElementById('imagePreview');
const imageRatio = document.getElementById('imageRatio');
const imageStyle = document.getElementById('imageStyle');

let currentLayout = '未选择';
let latestImageDataUrl = '';

startProjectBtn.addEventListener('click', () => productInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));

generatePointsBtn.addEventListener('click', () => {
  pointList.innerHTML = '<li>主卖点：快速解决用户核心痛点</li><li>辅助卖点 1：高颜值设计</li><li>辅助卖点 2：使用方便</li><li>辅助卖点 3：性价比高</li><li>信任背书：热销好评、品质保障</li><li>促销利益点：限时优惠、到手价更低</li>';
});

document.getElementById('layoutCards').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-layout]');
  if (!button) return;
  currentLayout = button.dataset.layout;
  selectedLayout.textContent = `已选择版式：${currentLayout}`;
});

const copyTemplates = {
  main: '主标题：一眼看懂产品核心卖点', sub: '副标题：高颜值设计，满足日常使用需求', benefit: '利益点：省时、省力、更方便', promo: '促销角标：限时到手价 / 今日特惠 / 爆款热卖', all: '主标题：一眼看懂产品核心卖点\n副标题：高颜值设计，满足日常使用需求\n利益点：省时、省力、更方便\n促销角标：限时到手价 / 今日特惠 / 爆款热卖'
};
document.querySelectorAll('.copy-btn').forEach((btn) => btn.addEventListener('click', () => { copyResult.textContent = copyTemplates[btn.dataset.type] || '文案生成中...'; }));

addCompetitorBtn.addEventListener('click', () => {
  const row = document.createElement('tr');
  row.innerHTML = '<td contenteditable="true">新竞品</td><td contenteditable="true">-</td><td contenteditable="true">-</td><td contenteditable="true">-</td><td contenteditable="true">-</td><td contenteditable="true">-</td>';
  competitorBody.appendChild(row);
});

function collectProductInfo() {
  const v = (id) => document.getElementById(id).value.trim();
  return {
    name: v('productName'), category: v('productCategory'), price: v('productPrice'), promo: v('promoInfo'), audience: v('targetAudience'),
    coreFunction: v('coreFunction'), sellingPoints: v('productSellingPoints'), scene: v('usageScene'), competitorRef: v('competitorRef'),
    mainStyle: document.getElementById('mainStyle').value, layout: currentLayout, selectedStyle: imageStyle.value
  };
}

function buildMainImagePrompt(info) {
  return `你是资深电商视觉设计师，请生成可用于电商主图后期设计加工的商业广告产品图。
商品主体：${info.name || '未填写商品名'}
商品类目：${info.category || '未填写类目'}
目标人群：${info.audience || '未填写目标人群'}
核心卖点：${info.coreFunction || '未填写核心功能'}；${info.sellingPoints || '未填写产品卖点'}
促销利益点：${info.promo || '未填写促销信息'}，价格参考：${info.price || '未填写价格'}
使用场景：${info.scene || '未填写场景'}
主图风格：${info.selectedStyle}（基础偏好：${info.mainStyle}）
版式结构：${info.layout}
画面构图：主体清晰居前，视觉焦点集中，整体构图适合电商平台首图展示。
背景氛围：干净、有层次、具有电商商业广告质感。
输出要求：高清产品图、留出后期加字区域、促销视觉冲击力强、可用于后期设计加工。
严格限制：不要水印、不要二维码、不要错误品牌、不要多余文字、不要变形产品。`;
}

function mapRatioToSize(ratio) {
  if (ratio === '1:1') return '1024x1024';
  if (ratio === '3:4') return '1024x1536';
  // 9:16 首选 1024x1792；若模型不支持，后端会自动降级到最接近可用尺寸（1024x1536）。
  return '1024x1792';
}

copyPromptBtn.addEventListener('click', async () => {
  const prompt = buildMainImagePrompt(collectProductInfo());
  promptPreview.value = prompt;
  try {
    await navigator.clipboard.writeText(prompt);
    imageGenStatus.textContent = '提示词已复制。';
  } catch {
    imageGenStatus.textContent = '复制失败，请手动复制下方提示词。';
  }
});

generateMainImageBtn.addEventListener('click', async () => {
  const info = collectProductInfo();
  const prompt = buildMainImagePrompt(info);
  const size = mapRatioToSize(imageRatio.value);
  promptPreview.value = prompt;
  imageGenStatus.textContent = '正在生成主图，请稍候。';
  imagePreview.textContent = '生成中...';
  downloadImageBtn.disabled = true;

  try {
    const response = await fetch('/api/generate-main-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, size, style: info.selectedStyle })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '生成失败');

    latestImageDataUrl = data.imageBase64 ? `data:image/png;base64,${data.imageBase64}` : data.imageUrl;
    if (!latestImageDataUrl) throw new Error('服务端未返回图片数据');

    const img = document.createElement('img');
    img.src = latestImageDataUrl;
    img.alt = '生成主图预览';
    imagePreview.innerHTML = '';
    imagePreview.appendChild(img);
    imageGenStatus.textContent = `主图生成成功（尺寸：${data.actualSize || size}）。`;
    downloadImageBtn.disabled = false;
  } catch (error) {
    imagePreview.textContent = '生成失败，请检查参数后重试。';
    imageGenStatus.textContent = `生成失败：${error.message}`;
  }
});

downloadImageBtn.addEventListener('click', () => {
  if (!latestImageDataUrl) return;
  const link = document.createElement('a');
  link.href = latestImageDataUrl;
  link.download = '电商主图.png';
  link.click();
});
