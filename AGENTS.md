## 项目概述
CareerPass（职业能力通行证）是一个模拟职业挑战与能力认证的移动端 Web 应用。核心功能包括用户登录、挑战广场、挑战流程、AI评分、通行证生成与验证等。

## 技术栈
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI 库**：MUI (Material UI) + Radix UI
- **样式**：Tailwind CSS + CSS-in-JS (Emotion)
- **包管理器**：pnpm
- **入口文件**：`src/main.tsx`
- **主应用**：`src/app/App.tsx`

## 目录结构
```
/workspace/projects/
├── .coze                     # Coze 项目配置文件
├── AGENTS.md                 # Agent 记忆文件
├── scripts/
│   ├── coze-preview-build.sh # 预览构建脚本
│   ├── coze-preview-run.sh   # 预览运行脚本
│   ├── build.sh              # 部署构建脚本
│   └── run.sh                # 部署运行脚本
├── src/
│   ├── main.tsx              # 应用入口
│   ├── app/
│   │   ├── App.tsx          # 主应用 + 路由状态管理
│   │   ├── components/       # 页面和组件
│   │   │   ├── iPhone16Frame.tsx    # iPhone 16 手机壳框架
│   │   │   ├── HomeScreen.tsx       # 首页
│   │   │   ├── LoginScreen.tsx      # 登录页
│   │   │   ├── PassScreen.tsx       # 通行证页
│   │   │   ├── ChallengeSquareScreen.tsx   # 挑战广场
│   │   │   ├── ChallengeActiveScreen.tsx    # 挑战进行中
│   │   │   ├── ChallengeResultScreen.tsx   # 挑战结果
│   │   │   ├── MeScreen.tsx         # 我的页面
│   │   │   └── ui/                  # shadcn/ui 组件
│   │   └── hooks/
│   │       └── usePullRefresh.ts    # 下拉刷新钩子
├── public/                   # 静态资源
├── vite.config.ts           # Vite 配置
├── package.json
└── index.html               # HTML 入口
```

## Coze 项目配置

### `.coze` 配置摘要
- **sub_id**: `02628d6c`
- **project_type**: `web`
- **preview_enable**: `enabled`
- **deploy.kind**: `service`
- **deploy.flavor**: `web`
- **entrypoint**: `index.html`
- **requires**: `nodejs-24`

### 预览链路
- **dev.build**: `bash scripts/coze-preview-build.sh`
- **dev.run**: `bash scripts/coze-preview-run.sh`
- **端口**: 5000
- **预览服务**: Vite dev server

### 部署链路
- **deploy.build**: `bash scripts/build.sh`
- **deploy.run**: `bash scripts/run.sh`
- **构建产物**: `dist/`
- **部署服务**: `npx serve dist`

## 关键入口 / 核心模块
1. **登录流程**：LoginScreen -> 验证码验证（Mock）-> 进入主应用
2. **挑战流程**：ChallengeSquareScreen -> ChallengeActiveScreen -> ChallengeResultScreen -> PassScreen
3. **AI 评分**：调用 `/api/ark` 代理到火山引擎 API
4. **状态管理**：组件内部 useState，App.tsx 管理全局路由

## 运行与预览
```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev    # 访问 http://localhost:5173

# 生产构建
pnpm run build
```

## 用户偏好与长期约束
- 移动端优先，iPhone 16 模拟（393×852px）
- 设计色系：#1A1A1A、#FF4D00、#FAF9F6
- 使用 pnpm 管理依赖，禁止 npm/yarn

## 常见问题和预防
- CORS 问题：Vite 配置了 `/api/ark` 代理到火山引擎
- 字体：使用 IBM Plex Mono 和 PingFang SC
- 部署超时：部署环境 30 秒超时限制，`serve` 包必须作为项目依赖安装，不能用 `npx serve`（会因下载包超时）；使用 `pnpm exec serve` 替代
