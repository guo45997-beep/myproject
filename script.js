const startProjectBtn = document.getElementById('startProjectBtn');
const productInfoSection = document.getElementById('product-info');
const generatePointsBtn = document.getElementById('generatePointsBtn');
const pointList = document.getElementById('pointList');
const selectedLayout = document.getElementById('selectedLayout');
const copyResult = document.getElementById('copyResult');
const competitorBody = document.getElementById('competitorBody');
const addCompetitorBtn = document.getElementById('addCompetitorBtn');

startProjectBtn.addEventListener('click', () => {
  productInfoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

generatePointsBtn.addEventListener('click', () => {
  pointList.innerHTML = `
    <li>主卖点：快速解决用户核心痛点</li>
    <li>辅助卖点 1：高颜值设计</li>
    <li>辅助卖点 2：使用方便</li>
    <li>辅助卖点 3：性价比高</li>
    <li>信任背书：热销好评、品质保障</li>
    <li>促销利益点：限时优惠、到手价更低</li>
  `;
});

document.getElementById('layoutCards').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-layout]');
  if (!button) return;
  selectedLayout.textContent = `已选择版式：${button.dataset.layout}`;
});

const copyTemplates = {
  main: '主标题：一眼看懂产品核心卖点',
  sub: '副标题：高颜值设计，满足日常使用需求',
  benefit: '利益点：省时、省力、更方便',
  promo: '促销角标：限时到手价 / 今日特惠 / 爆款热卖',
  all: `主标题：一眼看懂产品核心卖点\n副标题：高颜值设计，满足日常使用需求\n利益点：省时、省力、更方便\n促销角标：限时到手价 / 今日特惠 / 爆款热卖`
};

document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    copyResult.textContent = copyTemplates[type] || '文案生成中...';
  });
});

addCompetitorBtn.addEventListener('click', () => {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td contenteditable="true">新竞品</td>
    <td contenteditable="true">-</td>
    <td contenteditable="true">-</td>
    <td contenteditable="true">-</td>
    <td contenteditable="true">-</td>
    <td contenteditable="true">-</td>
  `;
  competitorBody.appendChild(row);
});
