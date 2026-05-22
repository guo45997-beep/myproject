# 电商主图设计工作流（含一键生图）

这是一个最小可用版本的网页应用：
- 前端：采集商品资料、生成提示词、展示图片与下载。
- 后端：通过 `OPENAI_API_KEY` 调用 OpenAI Images API 生成主图。
- 不使用数据库、不使用登录、不使用复杂框架。

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 复制环境变量文件

```bash
cp .env.example .env
```

3. 在 `.env` 填入你的密钥

```env
OPENAI_API_KEY=你的真实密钥
PORT=3000
```

4. 启动服务

```bash
npm start
```

5. 打开浏览器访问

```text
http://localhost:3000
```

## 使用说明（生成主图）

1. 在“商品资料输入区”填写商品信息。
2. 在“主图版式规划区”选择一个版式。
3. 在“一键生成可用主图”模块选择尺寸与风格。
4. 点击“一键生成主图”。
5. 成功后可在预览区查看，并点击“下载图片”保存。

## 安全说明

- API Key 仅存放在服务端 `.env`，不会出现在前端 `index.html` / `script.js`。
- 前端仅调用 `/api/generate-main-image`，由后端代为调用 OpenAI。
