# 电商美工主图一键生成（Next.js + OpenAI）

这是一个电商主图生成网站：
- 上传 1~4 张产品包装图或实拍图
- 填写产品信息与风格
- 点击 **「一键生成主图」**
- 后端调用 OpenAI Responses API 的 `image_generation` 工具生成主图

## 1) 环境变量设置

1. 复制环境变量模板：
   ```bash
   cp .env.example .env.local
   ```
2. 在 `.env.local` 中填写：
   ```env
   OPENAI_API_KEY=你的_OpenAI_API_Key
   ```

> API Key 仅在服务端读取，前端不会暴露。

## 2) 在 Codex 网页预览里运行

```bash
npm install
npm run dev
```

启动后在 Codex 的网页预览中打开站点（默认 `http://localhost:3000`）。

## 3) 使用步骤

1. 上传产品图（支持 1-4 张，前端会转成 base64 data URL）。
2. 填写：产品名称、产品类目、核心卖点。
3. 可选填写促销信息（如 618、限时折扣等）。
4. 选择主图风格与画幅（1:1 或 3:4）。
5. 点击 **「一键生成主图」**。
6. 等待生成完成后可预览并点击 **下载 PNG**。
7. 如不满意，可点击 **重新生成**。

## 4) 常见错误与排查

1. **没有 API Key**
   - 现象：接口报错 `服务端未配置 OPENAI_API_KEY`。
   - 处理：检查 `.env.local` 是否存在且变量名正确。

2. **OpenAI 账户没有额度**
   - 现象：接口返回支付/额度相关错误。
   - 处理：登录 OpenAI 账户检查 Billing/额度状态。

3. **组织未验证（组织权限受限）**
   - 现象：返回权限不足或模型不可用错误。
   - 处理：完成组织验证、确认模型可用权限。

4. **图片太大**
   - 现象：上传后请求失败、超时或 413 类错误。
   - 处理：压缩图片体积、减少分辨率、控制上传张数。

5. **接口超时**
   - 现象：生成时间过长后失败。
   - 处理：稍后重试，减少图片数量，优化输入内容长度。

---

## 项目结构

- `app/page.tsx`：中文前端页面（上传、表单、结果展示、下载、错误与加载状态）
- `app/api/generate-main-image/route.ts`：服务端 API，调用 OpenAI Responses API
- `app/layout.tsx` + `app/globals.css`：应用基础布局与 Tailwind 全局样式
