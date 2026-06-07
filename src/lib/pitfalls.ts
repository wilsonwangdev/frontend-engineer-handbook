/** 附录 D 数据源（SSOT）。页面只负责渲染，数据在这里集中维护。 */
export interface Pitfall {
  title: string;
  symptom: string;
  cause: string;
  fix: string;
}

export interface PitfallCategory {
  category: string;
  desc: string;
  items: Pitfall[];
}

export const PITFALLS: PitfallCategory[] = [
  {
    category: "D.1 网络与代理",
    desc: "中文开发环境中特有的网络问题——代理、镜像源、SSL 证书——在英文文档里几乎不会提到。",
    items: [
      {
        title: "TUN 模式代理拦截本地开发服务器",
        symptom: "pnpm test:e2e 卡死或返回 ERR_CONNECTION_REFUSED，但 curl 手动请求正常",
        cause:
          "Clash / Surge 等代理 APP 的 TUN 模式在网络栈 L3/L4 层拦截流量，绕开所有应用层 NO_PROXY / unset http_proxy 配置。CI 容器环境没有 TUN 所以能正常跑。",
        fix: "验证用 pnpm smoke（纯 node:http 打 127.0.0.1，绕开 L7 代理）。完整 E2E 时暂时关闭代理 APP 的 TUN 模式。详见 GOTCHAS G.3。",
      },
    ],
  },
  {
    category: "D.2 框架特定坑",
    desc: "Next.js / React / TypeScript 等技术栈自身的版本敏感问题。随版本升级可能过时，标注了发现时的版本号。",
    items: [
      {
        title: "Next.js 16 Cache Components 必须使用 use cache",
        symptom: "pnpm build 报 Uncached data was accessed outside of <Suspense>",
        cause:
          "next.config.ts 启用了 cacheComponents: true。数据读取函数（如 getAllDocs）未加 use cache 指令，被视为动态数据与 prerender 冲突。",
        fix: "给所有异步数据加载函数顶部加 use cache;。GOTCHAS G.1 有完整事故记录。",
      },
      {
        title: "Edge Runtime 与 Cache Components 互斥",
        symptom:
          "pnpm build 报 Route segment config runtime is not compatible with nextConfig.cacheComponents",
        cause:
          "cacheComponents: true 要求服务端 Runtime 支持静态缓存，Edge Runtime 的轻量环境不提供这一能力。两者不能同时开启。",
        fix: "去掉 export const runtime = 'edge'，改用默认 Node.js Runtime。对静态站而言性能差异可忽略——CDN 缓存后首次请求后的响应一样快。GOTCHAS G.7。",
      },
      {
        title: "编辑 MDX 内容后 dev server 不热更新",
        symptom: "修改 content/ 下的 .mdx 文件后浏览器不自动刷新，必须手动硬刷新",
        cause:
          "src/lib/content.ts 的函数使用了 use cache 指令，文件读取被缓存在内存中。Turbopack 不监听 content/ 目录。",
        fix: "硬刷新（Cmd+Shift+R）。内容编辑频率远低于组件开发，可以接受。GOTCHAS G.6 记录了 Fumadocs 的替代方案。",
      },
      {
        title: "Markdown 粗体 + CJK 括号解析错误",
        symptom: "**中文（English）** 渲染异常——粗体未闭合、括号丢失、后续文字被吞",
        cause:
          "Markdown 解析器遇到 ）**（全角右括号紧接两个星号）误判为星号属于括号内容的一部分，导致粗体边界识别错误。",
        fix: "用 HTML <strong> 标签替代 Markdown ** 语法。GOTCHAS G.5。",
      },
    ],
  },
  {
    category: "D.3 工具链协同",
    desc: "构建工具、测试框架、校验库之间的协作问题。往往不是单个工具的 bug，是搭配方式导致。",
    items: [
      {
        title: "Zod + gray-matter YAML 自动日期转换",
        symptom: "校验 content frontmatter 时 ZodError: expected string, received Date",
        cause:
          "gray-matter 遵循 YAML 1.1，会把裸 YYYY-MM-DD 自动解析为 JS Date 对象。同类转换：yes/no/on/off→boolean、null/~→null。",
        fix: "用防御性的 union + transform coerce：z.union([z.iso.date(), z.date()]).transform(v => v instanceof Date ? v.toISOString().slice(0,10) : v)。GOTCHAS G.2。",
      },
      {
        title: "oxlint --fix 静默吞掉不可修复的错误",
        symptom: "提交时 lint 通过，CI 上 lint 报错——同一份代码不同结果",
        cause:
          "lint-staged 配置为 oxlint --fix，但 --fix 对不可自动修复的错误（如未使用的 import）不报错退出。CI 上 oxlint（无 --fix）会报错。",
        fix: "lint-staged 拆为两步：oxlint（先检查拦截）+ oxlint --fix（再自动修复）。本项目已改为三阶段 oxlint → oxlint --fix → oxfmt。",
      },
      {
        title: "frontmatter sequential 编号冲突",
        symptom: '章节之间的"上一节/下一节"导航跳转错误——§4.6 的下一节显示 §5.1 标题',
        cause:
          "每篇内容文件的 frontmatter 里 paths.sequential 编号手工维护，新章编号与旧章尾部重叠。",
        fix: "scripts/check-sequential.mjs 自动检测重复和间隔，接入 pnpm ci 管道。新写内容时如果编号冲突构建直接失败。",
      },
    ],
  },
  {
    category: "D.4 部署与跨平台",
    desc: "生产环境部署、不同设备/浏览器上的表现差异。",
    items: [
      {
        title: "iOS Safari 输入框自动缩放",
        symptom: "iPhone 上点击搜索框后页面自动放大，键盘收起后不恢复",
        cause:
          "iOS Safari 默认行为：<input> 获得焦点时若 font-size < 16px，浏览器自动放大页面以便阅读——但用户期望的是不缩放。",
        fix: "设置输入框 font-size: 16px（刚好在阈值线上，性价比最高——0.5 个点的差异无关大局）。不要用 maximum-scale=1.0 禁止缩放——那会阻止所有用户手动缩放，影响可访问性。",
      },
      {
        title: "微信内置浏览器 Web Share API 不完整",
        symptom: "navigator.share() 弹窗后无法跳转到会话选择——分享流程中断",
        cause:
          "微信内置浏览器的 Web Share API 实现不完整，弹窗能出现但无法完成实际的分享操作。微信需要自己的 JS-SDK（wx.config()）才能正常分享。",
        fix: "检测 UA 中 MicroMessenger → 降级到 clipboard.copy。非微信移动端继续使用原生分享。详见 ShareButton 组件注释。",
      },
      {
        title: "移动端 tap 触发 mouse 事件序列",
        symptom: "移动端点击按钮首次无效，第二次才响应——特别是 tooltip/dropdown 类交互",
        cause:
          "移动端浏览器在 tap 时会模拟完整鼠标事件序列：touchstart → touchend → mouseenter → focus → click。如果组件同时绑定了 mouseenter 和 click handler，它们会相互抵消。",
        fix: "用 (hover: hover) 媒体查询检测设备 hover 能力，在触屏设备上屏蔽 onMouseEnter/onFocus，只靠 onClick 处理交互。不要用 max-width 判断移动端——iPad + 键盘有 hover，窄桌面窗口没有。",
      },
      {
        title: "移动端布局验证 gap",
        symptom: "组件在桌面端正常，移动端出现布局溢出、热区缺失、表格列过窄换行",
        cause: "开发时只在桌面端验证，没有在真实窄屏上检查。pnpm build 通过 ≠ 体验合格。",
        fix: "提交 UI 组件前在 375px 视口目视验证 + 交互组件三件套（点击外部关闭/ESC 关闭/显式关闭按钮）+ 表格横向滚动检查。GOTCHAS G.4。",
      },
    ],
  },
  {
    category: "D.5 性能与可访问性",
    desc: "影响用户体验但非功能性 bug 的隐性陷阱。",
    items: [
      {
        title: "链接 text-decoration 跨浏览器不一致",
        symptom: "字母 descender（g/y/p）会切断下划线——尤其是中文混排时更明显",
        cause:
          "text-decoration-skip-ink 在不同浏览器中对 ink 边界的判断不一致。部分渲染引擎的降部仍会与下划线重叠。",
        fix: "用 border-bottom 替代 text-decoration。边框始终绘制在元素 box 下方，不受字形影响。本站已在全局链接样式中采用此方案。",
      },
    ],
  },
];

export function getPitfallCount(): number {
  return PITFALLS.reduce((sum, c) => sum + c.items.length, 0);
}
