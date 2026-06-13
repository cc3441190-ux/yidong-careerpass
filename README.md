# CareerPass - 职业能力通行证

一个模拟职业挑战与能力认证的移动端Web应用，使用React + TypeScript + Vite构建。

## ✨ 项目特点

### 🎨 设计特色
- **iPhone 16 真实模拟** - 包含灵动岛、状态栏、侧边按钮等真实细节
- **统一设计语言** - 使用 `#1A1A1A`、`#FF4D00`、`#FAF9F6` 三色体系
- **IBM Plex Mono** - 等宽字体用于标签和按钮
- **PingFang SC** - 中文字体用于正文

### 🎭 动画效果
- **页面切换动画** - 前进时滑动进入，返回时淡入淡出
- **按钮按压反馈** - `buttonPress` 动画
- **Toast通知系统** - 操作反馈动画
- **下拉刷新** - 原生移动端体验
- **骨架屏闪烁** - 加载状态shimmer效果
- **直播脉冲** - 实时状态指示

### 📱 移动端优化
- **393×852px** - iPhone 16 逻辑像素
- **触摸优化** - 去除默认高光和选择
- **滚动隐藏** - 统一的scrollbar-width样式
- **安全区域** - 支持env(safe-area-inset-*) 
- **Flex布局** - 所有页面使用flex:1自适应

### 🧩 组件架构
```
src/app/
├── App.tsx                     # 主应用 + 路由
├── components/
│   ├── iPhone16Frame.tsx      # iPhone 16 手机壳
│   ├── Header.tsx             # 顶部导航
│   ├── BottomNav.tsx          # 底部标签栏
│   ├── HomeScreen.tsx         # 首页
│   ├── LoginScreen.tsx        # 登录页
│   ├── PassScreen.tsx         # 通行证页
│   ├── Challenge*.tsx         # 挑战流程页
│   ├── Toast.tsx             # 通知组件
│   ├── RefreshIndicator.tsx   # 下拉刷新
│   └── ...
├── hooks/
│   └── usePullRefresh.ts      # 下拉刷新钩子
└── styles/
    └── animations.css         # 全局动画
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
# 或
pnpm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 `http://localhost:5173` 查看效果。

### 构建生产版本
```bash
npm run build
```

## 📖 使用指南

### 认证流程
1. **闪屏页** - 点击"进入"按钮
2. **登录页** - 输入手机号 + 验证码（Mock）
3. **主应用** - 进入底部导航

### 底部导航
- **🏠 首页** - 能力档案 + 雷达图
- **🎯 挑战** - 浏览并接受挑战
- **📜 通行证** - 查看AI认证结果
- **👤 我的** - 个人设置和记录

### 挑战流程
1. **挑战广场** - 浏览可用挑战
2. **接受挑战** - 点击"接受挑战"
3. **答题界面** - 5个阶段，倒计时
4. **AI评分** - 加载动画
5. **成功页** - 查看结果
6. **通行证** - 生成能力认证

## 🎯 核心功能

### 1. 下拉刷新
在首页和挑战广场，下拉页面可以刷新数据（Mock）。

### 2. Toast通知
所有重要操作都有Toast通知反馈：
- ✅ 登录成功
- ✅ 接受挑战
- ✅ 分享通行证

### 3. 页面切换动画
- **前进** (deepening) - 从右向左滑动
- **返回** (shallowing) - 淡入淡出

### 4. 响应式布局
所有页面使用 `flex: 1` 布局，自动适配iPhone 16尺寸。

## 🛠 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **CSS-in-JS** - 内联样式（无外部CSS框架）

## 📐 设计规格

### 颜色
- **主色** - `#FF4D00` (橙红)
- **背景** - `#FAF9F6` (暖白)
- **文字** - `#1A1A1A` (近黑)
- **边框** - `#1A1A1A` 2px solid
- **阴影** - `3px 3px 0px #1A1A1A`

### 字体
- **英文/数字** - `IBM Plex Mono, monospace`
- **中文** - `PingFang SC, Noto Sans SC, Hiragino Sans GB, sans-serif`

### 间距
- **容器内边距** - `20px`
- **卡片圆角** - `6-8px`
- **按钮高度** - `48-52px`

## 🐛 调试

### Lint检查
```bash
npm run lint
```

### 常见问题
1. **页面不滚动** - 检查是否设置了 `overflow: "auto"`
2. **布局溢出** - 确保所有页面使用 `flex: 1` 而非固定尺寸
3. **动画不生效** - 检查全局CSS文件是否正确导入

## 📝 更新日志

### v2.4.1 (2026-06-09)
- ✅ 添加iPhone 16手机壳边框
- ✅ 修复所有页面的flex布局
- ✅ 添加页面切换方向动画
- ✅ 创建全局动画CSS文件
- ✅ 集成下拉刷新功能
- ✅ 优化Toast通知系统

## 📄 许可证

MIT License

---

**制作** - CareerPass Team  
**日期** - 2026年6月
