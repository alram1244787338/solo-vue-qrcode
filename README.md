# 二维码生成器

输入文本/URL 实时生成二维码，支持自定义颜色、尺寸、添加 Logo，导出 PNG/SVG。

## 技术栈

- **Vue 3** + Composition API (`<script setup>`)
- **Vite 5** 构建
- **纯手写 QR 生成算法**（零第三方依赖，版本 1-40，纠错 L/M/Q/H）

## 目录结构

```
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue      # 顶部导航
│   │   │   └── AppFooter.vue      # 底部版权
│   │   ├── QrForm.vue             # 左侧输入表单
│   │   └── QrPreview.vue          # 右侧 Canvas 预览
│   ├── styles/
│   │   └── global.css             # 全局样式 + CSS 变量
│   ├── utils/
│   │   ├── common.js              # 通用工具（颜色转换、校验、下载）
│   │   ├── qrcode.js              # 二维码生成核心算法 + Canvas/SVG 绘制
│   │   └── export.js              # PNG/SVG 导出
│   ├── App.vue                    # 根组件 + 状态管理
│   └── main.js                    # 应用入口
├── test/
│   ├── runner.js                  # 轻量测试框架
│   ├── common.test.js             # common.js 测试用例
│   ├── qrcode.test.js             # qrcode.js 纯函数测试
│   ├── export.test.js             # export.js 导出逻辑测试
│   └── index.js                   # 测试入口
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 5173）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

## 功能介绍

- 📝 **文本/URL 输入**：实时生成二维码，支持中文、emoji
- 🎨 **自定义颜色**：前景色/背景色，支持颜色选择器和手动输入十六进制（兼容 3 位短格式）
- 📏 **尺寸调节**：200-600px 滑块调节，实时预览
- 🛡️ **纠错等级**：L(7%) / M(15%) / Q(25%) / H(30%) 四档可选，损坏后仍可恢复
- 🖼️ **Logo 嵌入**：预留开关，支持 Logo 居中叠加（下一版本开放上传）
- ⬇️ **导出 PNG**：Canvas 原生导出，高清无损
- 📄 **导出 SVG**：矢量格式，可无损放大
- 📱 **响应式布局**：窄屏自动堆叠为单列

## 测试

手写轻量测试框架，覆盖核心纯函数。

```bash
# 运行所有测试
npm test
```

测试覆盖：

| 模块 | 测试内容 | 用例数 |
|------|----------|--------|
| `common.js` | `normalizeHex`（6位/3位/半透明/非法输入）、`hexToRgb`、`rgbToHex`、`isLightColor`、`clamp`、`validateQrContent` | 21 |
| `qrcode.js` | 矩阵尺寸、定位图案、纠错等级、SVG 字符串生成、颜色规范化 | 10 |
| `export.js` | SVG 颜色规范化、导出函数存在性、Blob/URL mock 测试 | 12 |

**总计：43 个测试，全部通过 ✅**

## License

MIT
